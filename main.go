package main

import (
	"bytes"
	"fmt"
	"io/ioutil"
	"log"
	"net/http"
	"strings"
	"time"

	"golang.org/x/net/context"
	"google.golang.org/appengine"
	"google.golang.org/appengine/delay"
	"google.golang.org/appengine/memcache"
)

func main() {
	http.HandleFunc("/latest", handler)
	http.HandleFunc("/", home)

	appengine.Main()
}

const baseURL = "https://himawari8-dl.nict.go.jp/himawari8/img/"
const infrared = "INFRARED_FULL"
const visible = "D531106"

// Time after which we should make an asynchronous request.
const timeoutUpdate = 1 * time.Minute

// Time after which we should make a synchronous request.
const timeout = 5 * time.Minute

// Get the data about the latest image.
func downloadLatest(useInfraredImage bool) ([]byte, error) {
	var buffer bytes.Buffer
	buffer.WriteString(baseURL)

	if useInfraredImage {
		buffer.WriteString(infrared)
	} else {
		buffer.WriteString(visible)
	}
	buffer.WriteString("/latest.json")

	resp, err := http.Get(buffer.String())
	if err != nil {
		log.Fatalf("error fetching data: %v", err)
		return nil, err
	}

	body, err := ioutil.ReadAll(resp.Body)
	if err != nil {
		return nil, err
	}

	return body, nil
}

// Put the latest data in memcache.
func cacheLatest(ctx context.Context, useInfraredImage bool, dataKey, timeKey string) ([]byte, error) {
	body, err := downloadLatest(useInfraredImage)
	if err != nil {
		return nil, err
	}

	dataItem := &memcache.Item{
		Key:   dataKey,
		Value: body,
	}

	timeBytes, err := time.Now().GobEncode()
	if err != nil {
		log.Fatalf("error encoding data: %v", err)
	}
	timeItem := &memcache.Item{
		Key:   timeKey,
		Value: timeBytes,
	}

	if err := memcache.SetMulti(ctx, []*memcache.Item{dataItem, timeItem}); err != nil {
		log.Fatalf("error setting items: %v", err)
	}

	log.Printf("updated memcached key %s", dataKey)

	return body, nil
}

// Update the latest cached version and delete mutex.
var cacheLatestAsync = delay.Func("cacheLatest", func(ctx context.Context, useInfraredImage bool, dataKey, timeKey string) {
	if item, err := memcache.Get(ctx, timeKey); err == memcache.ErrCacheMiss || !isUpToDate(item.Value, timeoutUpdate) {
		log.Printf("start delayed update for key %s", dataKey)

		_, err = cacheLatest(ctx, useInfraredImage, dataKey, timeKey)
		if err != nil {
			log.Fatalf("error during update: %v", err)
		}
	}
})

// Checks whether the time is within the timeout.
func isUpToDate(encodedTime []byte, timeout time.Duration) bool {
	var then time.Time

	err := then.GobDecode(encodedTime)
	if err != nil {
		log.Fatalf("error decoding date: %v", encodedTime)
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
		log.Printf("item not in the cache")

		body, err := cacheLatest(ctx, useInfraredImage, dataKey, timeKey)
		if err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}

		fmt.Fprintf(w, string(body))
	} else if err != nil {
		log.Fatalf("error getting item: %v", err)
		http.Error(w, err.Error(), http.StatusInternalServerError)
	} else if !isUpToDate(items[timeKey].Value, timeout) {
		log.Printf("item too old")
		body, err := cacheLatest(ctx, useInfraredImage, dataKey, timeKey)
		if err != nil {
			log.Fatalf("error synchronously getting data (data will be stale): %v", err)
			fmt.Fprintf(w, string(items[dataKey].Value))
			return
		}

		fmt.Fprintf(w, string(body))
	} else if !isUpToDate(items[timeKey].Value, timeoutUpdate) {
		log.Printf("item in the cache but not up to date")
		fmt.Fprintf(w, string(items[dataKey].Value))

		// Update asynchronously but only if we are not fetching right now.
		cacheLatestAsync.Call(ctx, useInfraredImage, dataKey, timeKey)
	} else {
		log.Printf("item in the cache")
		fmt.Fprintf(w, string(items[dataKey].Value))
	}
}

func home(w http.ResponseWriter, r *http.Request) {
	fmt.Fprintf(w, "Welcome to the Himawari-8 JSON proxy. The API endpoint is at `/latest` and the only parameter is `infrared` (can be set to true).")
}
