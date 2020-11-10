# Himawari-8 JSON proxy

This is a Google AppEngine application running at https://himawari-8.appspot.com/.

## Features

* Written in golang
* Uses memcache and always returns the last cached version unless it's too stale
* Asynchronously updates the entries in memcache
* Fault tolerant in that it returns stale data if the server cannot be reached

## Run

Install AppEngine for golang and then run `dev_appserver.py app.yaml`.

## Deploy

Run `gcloud app deploy --project=himawari-8`.

### Deploy from cloud shell

Move the code into `$GOPATH/src/himawari-8`. Then run `gcloud app deploy`.

## Try

Get latest true color data: https://himawari-8.appspot.com/latest
Get latest infrared data: https://himawari-8.appspot.com/latest?infrared=true
