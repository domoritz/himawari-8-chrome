# Himawari 8 New Tab Page

Experience the latest image taken by the [geostationary](https://en.wikipedia.org/wiki/Geostationary_orbit) [Himawari 8 satellite](http://himawari8.nict.go.jp/) every time you open a new tab in Chrome. The satellite has been deployed by the [Japan Meteorological Agency](http://www.jma.go.jp/jma/indexe.html) and takes photographs of Earth every 10 minutes. Since the new tab page is a simple web page, you can also [try it online](https://domoritz.github.io/himawari-8-chrome).

🛰 Get the extension from the [Chrome web store](https://chrome.google.com/webstore/detail/himawari-8-new-tab-page/llelgapflianaapmnpncgakfjhfhnojm).

![screenshot](https://domoritz.github.io/himawari-8-chrome/screenshot.png "Screenshot of the browser with the new tab page")

This extension is inspired by https://glittering.blue/, https://github.com/jakiestfu/himawari.js/ and https://github.com/ngoldman/himawari-urls.

## Features

* Loads the latest image, updates automatically
* Automatically loads images at the optimal resolution (incl retina resolutions). If more than one image is needed, automatically downloads tiles.
* Uses Google's caching to take the load from the image servers
* Caches last version in local storage (compressed jpeg) and immediately displays it when you load the page. Then loads the latest image.
* Full offline support
* Images are drawn on a canvas so that we can cache and load it easily.
* The earth always stay centered, thanks to CSS magic.


## Planned features

**Contributions welcome**

* Automatically download a better image if the window is resized
* Time travel
* Actual logo/ icon
* Error handling


## Demo

Have a look at the [latest image from Himawari 8](https://domoritz.github.io/himawari-8-chrome).


## Develop

Run `npm run watch` and `npm start` in two different terminals. Then open [localhost:8000](http://localhost:8000/) and start developing. Run `pack.sh` to pack the Chrome extension.
