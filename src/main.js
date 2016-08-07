import {queue} from 'd3-queue';
import {json} from 'd3-request';

// base url for images
var HIMAWARI_BASE_URL = "http://himawari8-dl.nict.go.jp/himawari8/img/";
var DSCOVR_BASE_URL = "http://epic.gsfc.nasa.gov/epic-archive/png/";

// links to online image explorers
var HIMAWARI_EXPLORER = "http://himawari8.nict.go.jp/";
var DSCOVR_EXPLORER = "http://epic.gsfc.nasa.gov/";

// image types
var INFRARED = "INFRARED_FULL";
var VISIBLE_LIGHT = "D531106";
var DSCOVR_EPIC = "EPIC";

var WIDTH = 550;
var BLOCK_SIZES = [1, 4, 8, 16, 20];

// the dscovr images have a lot of padding around them and it varies
var DSCOVR_PADDING = 100;
var DSCOVR_WIDTH = 2048 - 2 * DSCOVR_PADDING;

var IMAGE_QUALITY = 0.9;
var RELOAD_INTERVAL = 1 * 60 * 1000;  // 1 minutes
var RELOAD_TIME_INTERVAL = 10 * 1000;  // 10 seconds

// local storage keys
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
  var baseURL = getHimawariBaseURL(options.infrared);
  var date = resolveDate(options.date);

  // Normalize our date
  date = normalizeDate(date);

  // Define some image parameters
  var blocks = options.blocks || (options.zoom ? BLOCK_SIZES[options.zoom - 1] : BLOCK_SIZES[0]);
  var level = blocks + 'd';
  var time = [date.getUTCHours(), date.getUTCMinutes(), date.getUTCSeconds()].map(function (s) { return pad(s, 2) }).join("");
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
function getHimawariBaseURL(infrared) {
  var url = HIMAWARI_BASE_URL;
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
 * Parses a date string into a date object.
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
 * Get the date of the latest himawari image by making an Ajax request.
 * @param   {boolean}  infrared  gets the latest infrared image
 * @returns {function}           callback function
 */
function getLatestHimawariDate(infrared, cb) {
  json("https://himawari-8.appspot.com/latest" + (infrared ? "?infrared=true" : ""),
    function (error, data) {
      if (error) throw error;
      var latest = data.date;
      cb(resolveDate(latest + "Z"));
    });
}

function getLatestDscovrImageUrlAndDate(cb) {
  json("http://epic.gsfc.nasa.gov/api/images.php",
    function (error, data) {
      if (error) throw error;
      var latest = data[data.length - 1];
      latest.date = resolveDate(latest.date + "Z")
      cb(latest);
    });
}

/**
 * Looks at the screen resolution and figures out a zoom level that returns images at a sufficient resolution.
 */
function getOptimalNumberOfBlocks() {
  var height = document.getElementById("output").clientHeight * window.devicePixelRatio;
  var minNumber = height / WIDTH;

  for (var i = 0; i < BLOCK_SIZES.length; i++) {
    var l = BLOCK_SIZES[i];
    if (l > minNumber) {
      return l;
    }
  }

  console.log(height)

  return BLOCK_SIZES[BLOCK_SIZES.length - 1];
}

// the date that is currently loaded
var loadedDate = null;
var loadedType = null;

function timeSince(date) {
  var seconds = Math.floor((new Date() - date) / 1000);

  var interval = Math.floor(seconds / 31536000);

  if (interval > 1) {
    return interval + " years";
  }
  interval = Math.floor(seconds / 2592000);
  if (interval > 1) {
    return interval + " months";
  }
  interval = Math.floor(seconds / 86400);
  if (interval > 1) {
    return interval + " days";
  }
  interval = Math.floor(seconds / 3600);
  if (interval > 1) {
    return interval + " hours";
  }
  interval = Math.floor(seconds / 60);
  if (interval > 1) {
    return interval + " minutes";
  }
  return Math.floor(seconds) + " seconds";
}

function updateTimeAgo(date) {
  document.getElementById("time").innerHTML = "<abbr title=\"" + date + "\">" + timeSince(date) + "</abbr> ago";
}

/**
 * Creates an image composed of tiles.
 * @param {Date object} date  The date for which to load the data.
 */
function setHimawariImages(date, infrared) {
  // no need to set images if we have up to date images and the image type has not changed
  if (loadedDate && date.getTime() === loadedDate.getTime() && loadedType === (infrared ? INFRARED : VISIBLE_LIGHT)) {
    return;
  }

  // if we haven't loaded images before, we want to show progress
  var initialLoad = !localStorage.getItem(CACHED_DATE_KEY);

  // immediately set the type and body class beacuse we are not loading in the background
  if (initialLoad) {
    loadedType = infrared ? INFRARED : VISIBLE_LIGHT;
    setBodyClass();
  }

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
    img.onload = function () {
      ctx.drawImage(img, tile.x * WIDTH, tile.y * WIDTH, WIDTH, WIDTH);
      callback();
    }
    img.src = tile.url;
  }

  result.tiles.forEach(function (tile) {
    q.defer(addImage, tile);
  });

  // wait for all images to be drawn on canvas
  q.awaitAll(function (error) {
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
    setBodyClass();

    // put date and image data in cache
    var imageData = canvas.toDataURL("image/jpeg", IMAGE_QUALITY);
    localStorage.setItem(IMAGE_DATA_KEY, imageData);
    localStorage.setItem(CACHED_DATE_KEY, date);
    localStorage.setItem(CACHED_IMAGE_TYPE_KEY, infrared ? INFRARED : VISIBLE_LIGHT);
  });
}

function setDscovrImage(latest) {
  // no need to set images if we have up to date images and the image type has not changed
  if (loadedDate && latest.date.getTime() === loadedDate.getTime() && loadedType === DSCOVR_EPIC) {
    return;
  }

  var canvas = document.getElementById("output");
  var ctx = canvas.getContext("2d");
  ctx.canvas.width = DSCOVR_WIDTH;
  ctx.canvas.height = DSCOVR_WIDTH;

  var img = new Image();
  img.setAttribute("crossOrigin", "anonymous");
  img.onload = function () {
    ctx.drawImage(img, -DSCOVR_PADDING, -DSCOVR_PADDING);

    updateTimeAgo(latest.date);
    loadedType = DSCOVR_EPIC;

    setBodyClass();

    // put date and image data in cache
    var imageData = canvas.toDataURL("image/jpeg", IMAGE_QUALITY);
    localStorage.setItem(IMAGE_DATA_KEY, imageData);
    localStorage.setItem(CACHED_DATE_KEY, latest.date);
    localStorage.setItem(CACHED_IMAGE_TYPE_KEY, DSCOVR_EPIC);
  }
  img.src = getCachedUrl(DSCOVR_BASE_URL + latest.image + '.png');
}

/*
 * Set the right class on the body so that we can have different css.
 */
function setBodyClass() {
  switch (loadedType) {
    case DSCOVR_EPIC:
      document.body.classList.add("dscovr");
      document.body.classList.remove("himawari");
      break;
    default:
      document.body.classList.remove("dscovr");
      document.body.classList.add("himawari");
      break;
  }
}

/* Asynchronously load latest image(s) date and images for that date */
function setLatestImage() {
  if (!navigator.onLine) {
    // browser is offline, no need to do this
    return;
  }

  function himawariCallback(infrared) {
    getLatestHimawariDate(infrared, function (latest) {
      setHimawariImages(latest, infrared);
    });
  }

  function dscovrCallback() {
    getLatestDscovrImageUrlAndDate(function (latest) {
      setDscovrImage(latest);
    });
  }

  if (isChromeExtension) {
    chrome.storage.sync.get({
      imageType: VISIBLE_LIGHT
    }, function (items) {
      switch (items.imageType) {
        case DSCOVR_EPIC:
          dscovrCallback();
          break;
        case INFRARED:
          himawariCallback(true);
          break;
        case VISIBLE_LIGHT:
        default:
          himawariCallback(false);
          break;
      }
    });
  } else {
    // if we are not in the extension, let's always load non infrared
    himawariCallback(false);
  }
}

/** Load image from local storage */
function setCachedImage() {
  var canvas = document.getElementById("output");
  var ctx = canvas.getContext("2d");
  var date = new Date(localStorage.getItem(CACHED_DATE_KEY));

  var img = new Image();
  img.onload = function () {
    ctx.canvas.width = img.width;
    ctx.canvas.height = img.height;
    ctx.drawImage(img, 0, 0);

    updateTimeAgo(date);
    loadedDate = date;
    loadedType = localStorage.getItem(CACHED_IMAGE_TYPE_KEY);
    setBodyClass();
  }
  img.src = localStorage.getItem(IMAGE_DATA_KEY);
}

// check if there are new images form time to time
window.setInterval(setLatestImage, RELOAD_INTERVAL);

// also load a new image when we come back online
window.addEventListener("online", setLatestImage);

// initial loading
if (localStorage.getItem(CACHED_DATE_KEY)) {
  setCachedImage();
}
setLatestImage();

// update the time ago
window.setInterval(function () {
  if (loadedDate) {
    updateTimeAgo(loadedDate);
  }
}, RELOAD_TIME_INTERVAL);

// hide some things if we are not a chrome extension
if (isChromeExtension) {
  document.body.classList.add("extension");
  document.getElementById("go-to-options").addEventListener("click", function () {
    chrome.runtime.openOptionsPage();
  });
}

document.getElementById("explore").addEventListener("click", function () {
  window.open(loadedType === DSCOVR_EPIC ? DSCOVR_EXPLORER : HIMAWARI_EXPLORER, "_self");
});
