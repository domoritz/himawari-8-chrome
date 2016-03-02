package himawari

import (
	"bytes"
	"fmt"
	"io/ioutil"
	"net/http"
	"strings"

	"google.golang.org/appengine"
	"google.golang.org/appengine/urlfetch"
)

func init() {
	http.HandleFunc("/", handler)
}

const BaseUrl = "http://himawari8-dl.nict.go.jp/himawari8/img/"

func handler(w http.ResponseWriter, r *http.Request) {
	w.Header().Add("Access-Control-Allow-Origin", "*")
	w.Header().Add("Content-Type", "text/json")

	infrared := r.FormValue("infrared")

	var buffer bytes.Buffer

	buffer.WriteString(BaseUrl)

	if strings.HasPrefix(infrared, "t") {
		buffer.WriteString("INFRARED_FULL")
	} else {
		buffer.WriteString("D531106")
	}
	buffer.WriteString("/latest.json")

	ctx := appengine.NewContext(r)
	client := urlfetch.Client(ctx)
	resp, err := client.Get(buffer.String())
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	// fmt.Fprintf(w, "HTTP GET returned status %v", resp.Status)

	body, err := ioutil.ReadAll(resp.Body)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	fmt.Fprintf(w, string(body))
}
