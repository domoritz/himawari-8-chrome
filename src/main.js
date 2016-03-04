import {queue} from 'd3-queue';
import {json} from 'd3-request';

var BASE_URL = "http://himawari8-dl.nict.go.jp/himawari8/img/";
var INFRARED = "INFRARED_FULL";
var VISIBLE_LIGHT = "D531106";
var WIDTH = 550;
var BLOCK_SIZES = [1, 4, 8, 16, 20];

var IMAGE_QUALITY = 0.9;
var RELOAD_INTERVAL = 1*60*1000;  // 1 minutes
var RELOAD_TIME_INTERVAL = 10*1000;  // 10 seconds
var IMAGE_DATA_KEY = "imageData";
var CACHED_DATE_KEY = "cachedDate";
var CACHED_IMAGE_TYPE_KEY = "cachedImageType";

var isChromeExtension = window.chrome && chrome.app.getDetails();

/**
 * Returns an array of objects containing URLs and metadata
 * for Himawari 8 image tiles based on a given date.
 * Options:
 * - date: Date object or Date string (YYYY-MM-DD HH:MM:SSZ)
 * - infrared: boolean (optional)
 * - zoom: number (default: 1)
 * - blocks: alternative to zoom, how many images per row/column (default: 1)
 *      Has to be a valid block number (1, 4, 8, 16, 20)
 *
 * @param  {Object}       options
 */
function himawariURLs(options) {
  options = options || {};
  var baseURL = getBaseURL(options.infrared);
  var date = resolveDate(options.date);

  // Normalize our date
  date = normalizeDate(date);

  // Define some image parameters
  var blocks = options.blocks || (options.zoom ? BLOCK_SIZES[options.zoom - 1] : BLOCK_SIZES[0]);
  var level = blocks + 'd';
  var time = [date.getUTCHours(), date.getUTCMinutes(), date.getUTCSeconds()].map(function(s) {return pad(s, 2)}).join("");
  var year = date.getUTCFullYear();
  var month = pad(date.getUTCMonth() + 1, 2);
  var day = pad(date.getUTCDate(), 2);

  // compose URL
  var tilesURL = [baseURL, level, WIDTH, year, month, day, time].join("/");
  var tiles = [];

  for (var y = 0; y < blocks; y++) {
    for (var x = 0; x < blocks; x++) {
      var name = x + "_" + y + ".png";
      var url = tilesURL + "_" + name;

      tiles.push({
        name: name,
        url: getCachedUrl(url),
        x: x,
        y: y
      });
    }
  }

  return {
    tiles: tiles,
    blocks: blocks,
    date: date
  };
}

/**
 * Returns base URL for Himawari-8 images
 * @param   {Boolean}   infrared  returns base URL for infrared images if true
 * @returns {String}              full base URL
 */
function getBaseURL(infrared) {
  var url = BASE_URL;
  if (infrared) {
    url += INFRARED;
  } else {
    url += VISIBLE_LIGHT;
  }
  return url;
}

/**
 * Takes a Date and normalizes it to ten minute intervals.
 * @param   {Date}  input   Date object
 * @returns {Date}          normalized Date object
 */
function normalizeDate(date) {
  date.setMinutes(date.getMinutes() - (date.getMinutes() % 10));
  date.setSeconds(0);
  return date;
}

/**
 * Parses a date.
 * @param   {string | Date} date  Date as string or date object
 * @returns {Date}                Date object
 */
function resolveDate(date) {
  if (typeof date === "string") {
    // Don't use Date.parse because it doesn't work with YYYY-MM-DD HH:MM:SSZ
    var parts = date.match(/(\d{4})-(\d{2})-(\d{2})\s(\d{2}):(\d{2}):(\d{2})Z/);
    parts[2] -= 1; //months are zero-based
    return new Date(Date.UTC.apply(this, parts.slice(1)));
  } else {
    return date;
  }
}

/**
 * Create a cached URL thanks to our friends at Google.
 * See https://gist.github.com/carlo/5379498
 */
function getCachedUrl(url) {
  // 5 days caching, in seconds
  var cache = 5 * 24 * 60 * 60;
  return "https://images1-focus-opensocial.googleusercontent.com/gadgets/proxy?url=" + url + "&container=focus&refresh=" + cache
}

/**
 * Pads a number with trailing zeros and makes it a string.
 */
function pad(num, size) {
  var s = num + "";
  while (s.length < size) {
    s = "0" + s;
  }
  return s;
}

/**
 * Get the date of the latest image by making an Ajax request to the servers from nict.go.jp.
 * @param   {boolean}  infrared  gets the latest infrared image
 * @returns {function}           callback function
 */
function getLatestDate(infrared, cb) {
  json("https://himawari-8.appspot.com/latest" + (infrared ? "?infrared=true" : ""),
    function(error, data) {
      if (error) throw error;
      var latest = data.date;
      cb(resolveDate(latest + "Z"));
    });
}

/**
 * Looks at the screen resolution and figures out a zoom level that returns images at a sufficient resolution.
 */
function getOptimalNumberOfBlocks() {
  var height = document.getElementById("output").clientHeight * window.devicePixelRatio;
  var minNumber = height/WIDTH;

  for (var i = 0; i < BLOCK_SIZES.length; i++) {
    var l = BLOCK_SIZES[i];
    if (l > minNumber) {
      return l;
    }
  }

  return BLOCK_SIZES[BLOCK_SIZES.length - 1];
}

// the date that is currently loaded
var loadedDate = null;
var loadedType = null;

function updateTimeAgo(date) {
  var ago = (Date.now() - date.getTime()) / (1000 * 60);
  document.getElementById("time").innerHTML = "<abbr title=\"" + date + "\">" + Math.floor(ago) + " minutes</abbr> ago";
}

/**
 * Creates an image composed of tiles.
 * @param {Date object} date  The date for which to load the data.
 */
function setImages(date, infrared) {
  // no need to set images if we have up to date images and the image type has not changed
  if (loadedDate && date.getTime() === loadedDate.getTime() &&  loadedType === (infrared ? INFRARED : VISIBLE_LIGHT)) {
    return;
  }

  // if we haven't loaded images before, we want to show progress
  var initialLoad = !localStorage.getItem(CACHED_DATE_KEY);

  // get the URLs for all tiles
  var result = himawariURLs({
    date: date,
    blocks: getOptimalNumberOfBlocks(),
    infrared: infrared
  });

  var pixels = result.blocks * WIDTH;

  var canvas = initialLoad ? document.getElementById("output") : document.createElement("canvas");
  var ctx = canvas.getContext("2d");
  ctx.canvas.width = pixels;
  ctx.canvas.height = pixels;

  var q = queue();

  // add image to canvas and call callback when done
  function addImage(tile, callback) {
    var img = new Image();
    img.setAttribute("crossOrigin", "anonymous");
    img.onload = function() {
      ctx.drawImage(img, tile.x * WIDTH, tile.y * WIDTH, WIDTH, WIDTH);
      callback();
    }
    img.src = tile.url;
  }

  result.tiles.forEach(function(tile) {
    q.defer(addImage, tile);
  });

  // wait for all images to be drawn on canvas
  q.awaitAll(function(error) {
    if (error) throw error;

    if (!initialLoad) {
      // copy canvas into output in one step
      var output = document.getElementById("output");
      var outCtx = output.getContext("2d")
      outCtx.canvas.width = pixels;
      outCtx.canvas.height = pixels;
      outCtx.drawImage(canvas, 0, 0);
    }

    updateTimeAgo(result.date);
    loadedDate = date;
    loadedType = infrared ? INFRARED : VISIBLE_LIGHT;

    // put date and image data in cache
    var imageData = canvas.toDataURL("image/jpeg", IMAGE_QUALITY);
    localStorage.setItem(IMAGE_DATA_KEY, imageData);
    localStorage.setItem(CACHED_DATE_KEY, date);
    localStorage.setItem(CACHED_IMAGE_TYPE_KEY, infrared ? INFRARED : VISIBLE_LIGHT);
  });
}

/* Asynchronously load latest image date and images for that date */
function setLatestImages() {
  if (!navigator.onLine) {
    // browser is offline, no need to do this
    return;
  }

  function cb(infrared) {
    getLatestDate(infrared, function(latest) {
      setImages(latest, infrared);
    });
  }

  if (isChromeExtension) {
    chrome.storage.sync.get({
      imageType: VISIBLE_LIGHT
    }, function(items) {
      var infrared = items.imageType === INFRARED;
      cb(infrared);
    });
  } else {
    // if we are not in the extension, let's always load non infrared
    cb(false);
  }
}

/** Load image from local storage */
function setCachedImage() {
  var canvas = document.getElementById("output");
  var ctx = canvas.getContext("2d");
  var date = new Date(localStorage.getItem(CACHED_DATE_KEY));

  var img = new Image();
  img.onload = function() {
    ctx.canvas.width = img.width;
    ctx.canvas.height = img.height;
    ctx.drawImage(img, 0, 0);

    updateTimeAgo(date);
    loadedDate = date;
    loadedType = localStorage.getItem(CACHED_IMAGE_TYPE_KEY);
  }
  img.src = localStorage.getItem(IMAGE_DATA_KEY);
}

// check if there are new images form time to time
window.setInterval(setLatestImages, RELOAD_INTERVAL);

// also load a new image when we come back online
window.addEventListener("online", setLatestImages);

// initial loading
if (localStorage.getItem(CACHED_DATE_KEY)) {
  setCachedImage();
}
setLatestImages();

// update the time ago
window.setInterval(function() {
  if (loadedDate) {
    updateTimeAgo(loadedDate);
  }
}, RELOAD_TIME_INTERVAL);

// hide some things if we are not a chrome extension
if (isChromeExtension) {
  document.body.className += "extension";
  document.getElementById("go-to-options").addEventListener("click", function() {
    chrome.runtime.openOptionsPage();
  });
}
