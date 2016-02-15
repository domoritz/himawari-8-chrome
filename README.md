# Himawari-8 New Tab Page

Experience the latest image from the Himawari 8 satellite every time you open a new tab in Chrome. Since the new tab page is a simple web page, you can also [try it online](https://domoritz.github.io/himawari-8-chrome).

![screenshot](https://domoritz.github.io/himawari-8-chrome/screenshot.png "Screenshot of the browser with the new tab page")


Inspired by https://github.com/jakiestfu/himawari.js/ and https://github.com/ngoldman/himawari-urls.

## Features

* No dependencies, pure JS and CSS
* Loads the latest image, updates every 5 minutes
* Automatically loads images at the optimal resolution (incl retina resolutions). If more than one image is needed, automatically downloads and inserts tiles.
* Uses Google's caching to take the load from the image servers


## Planned features

* More local caching to increase responsiveness
* Automatically download a better image if the window is resized
* Time travel
* Actual logo/ icon
* Error handling


## Demo

Have a look at the [latest image from Himawari 8](https://domoritz.github.io/himawari-8-chrome).


## Develop

Run `python -m SimpleHTTPServer` and open [localhost:8000](http://localhost:8000/).


