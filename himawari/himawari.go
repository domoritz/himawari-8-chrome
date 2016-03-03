package himawari

import (
	"bytes"
	"fmt"
	"io/ioutil"
	"net/http"
	"strings"
	"time"

	"golang.org/x/net/context"
	"google.golang.org/appengine"
	"google.golang.org/appengine/delay"
	"google.golang.org/appengine/log"
	"google.golang.org/appengine/memcache"
	"google.golang.org/appengine/urlfetch"
)

func init() {
	http.HandleFunc("/latest", handler)
	http.HandleFunc("/", home)
}

const baseUrl = "http://himawari8-dl.nict.go.jp/himawari8/img/"
const infrared = "INFRARED_FULL"
const visible = "D531106"

// time after which we should make an asynchronous request
const timeoutUpdate = 1 * time.Minute

// time after which we should make a synchronous request
const timeout = 5 * time.Minute

// get the data about the latest image
func downloadLatest(ctx context.Context, useInfraredImage bool) ([]byte, error) {
	var buffer bytes.Buffer
	buffer.WriteString(baseUrl)

	if useInfraredImage {
		buffer.WriteString(infrared)
	} else {
		buffer.WriteString(visible)
	}
	buffer.WriteString("/latest.json")

	client := urlfetch.Client(ctx)
	resp, err := client.Get(buffer.String())
	if err != nil {
		log.Errorf(ctx, "error fetching data: %v", err)
		return nil, err
	}

	body, err := ioutil.ReadAll(resp.Body)
	if err != nil {
		return nil, err
	}

	return body, nil
}

// put the latest data in memcache
func cacheLatest(ctx context.Context, useInfraredImage bool, dataKey, timeKey string) ([]byte, error) {
	body, err := downloadLatest(ctx, useInfraredImage)
	if err != nil {
		return nil, err
	}

	dataItem := &memcache.Item{
		Key:   dataKey,
		Value: body,
	}

	timeBytes, err := time.Now().GobEncode()
	if err != nil {
		log.Errorf(ctx, "error encoding data: %v", err)
	}
	timeItem := &memcache.Item{
		Key:   timeKey,
		Value: timeBytes,
	}

	if err := memcache.SetMulti(ctx, []*memcache.Item{dataItem, timeItem}); err != nil {
		log.Errorf(ctx, "error setting items: %v", err)
	}

	log.Infof(ctx, "updated memcached key %s", dataKey)

	return body, nil
}

// update the latest cached version and delete mutex
var cacheLatestAsync = delay.Func("cacheLatest", func(ctx context.Context, useInfraredImage bool, dataKey, timeKey string) {
	if item, err := memcache.Get(ctx, timeKey); err == memcache.ErrCacheMiss || !isUpToDate(ctx, item.Value, timeoutUpdate) {
		log.Infof(ctx, "start delayed update for key %s", dataKey)

		_, err = cacheLatest(ctx, useInfraredImage, dataKey, timeKey)
		if err != nil {
			log.Errorf(ctx, "error during update: %v", err)
		}
	}
})

// checks whether the time is within the timeout
func isUpToDate(ctx context.Context, encodedTime []byte, timeout time.Duration) bool {
	var then time.Time

	err := then.GobDecode(encodedTime)
	if err != nil {
		log.Errorf(ctx, "error decoding date: %v", encodedTime)
		return false
	}

	duration := time.Since(then)
	return duration <= timeout
}

func handler(w http.ResponseWriter, r *http.Request) {
	w.Header().Add("Access-Control-Allow-Origin", "*")
	w.Header().Add("Content-Type", "text/json")

	ctx := appengine.NewContext(r)

	useInfraredImage := strings.HasPrefix(r.FormValue("infrared"), "t")

	imageKey := visible
	if useInfraredImage {
		imageKey = infrared
	}

	dataKey := "data_" + imageKey
	timeKey := "time_" + imageKey

	if items, err := memcache.GetMulti(ctx, []string{dataKey, timeKey}); err == memcache.ErrCacheMiss || items[dataKey] == nil || items[timeKey] == nil {
		log.Infof(ctx, "item not in the cache")

		body, err := cacheLatest(ctx, useInfraredImage, dataKey, timeKey)
		if err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}

		fmt.Fprintf(w, string(body))
	} else if err != nil {
		log.Errorf(ctx, "error getting item: %v", err)
		http.Error(w, err.Error(), http.StatusInternalServerError)
	} else if !isUpToDate(ctx, items[timeKey].Value, timeout) {
		log.Infof(ctx, "item too old")
		body, err := cacheLatest(ctx, useInfraredImage, dataKey, timeKey)
		if err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}

		fmt.Fprintf(w, string(body))
	} else if !isUpToDate(ctx, items[timeKey].Value, timeoutUpdate) {
		log.Infof(ctx, "item in the cache but not up to date")
		fmt.Fprintf(w, string(items[dataKey].Value))

		// update asynchronously but only if we are not fetching right now
		cacheLatestAsync.Call(ctx, useInfraredImage, dataKey, timeKey)
	} else {
		log.Infof(ctx, "item in the cache")
		fmt.Fprintf(w, string(items[dataKey].Value))
	}
}

func home(w http.ResponseWriter, r *http.Request) {
	fmt.Fprintf(w, "Welcome to the Himawari 8 JSON proxy. The API endpoint is at `/latest` and the only parameter is `infrared` (can be set to true).")
}
