import {queue} from 'd3-queue';
import {json} from 'd3-request';

// base url for images
const HIMAWARI_BASE_URL = "http://himawari8-dl.nict.go.jp/himawari8/img/";
const DSCOVR_BASE_URL = "https://epic.gsfc.nasa.gov/archive/";

const GEOS_EAST_URL = "http://goes.gsfc.nasa.gov/goescolor/goeseast/overview2/color_lrg/latestfull.jpg";
const GEOS_WEST_URL = "http://goes.gsfc.nasa.gov/goescolor/goeswest/overview2/color_lrg/latestfull.jpg";

// links to online image explorers
const HIMAWARI_EXPLORER = "http://himawari8.nict.go.jp/himawari8-image.htm?sI=D531106";
const DSCOVR_EXPLORER = "https://epic.gsfc.nasa.gov";
const DSCOVR_EXPLORER_ENHANCED = DSCOVR_EXPLORER + "/enhanced";

// image types
const INFRARED = "INFRARED_FULL";
const VISIBLE_LIGHT = "D531106";
const DSCOVR_EPIC = "EPIC";
const DSCOVR_EPIC_ENHANCED = "EPIC_ENHANCED";
const GEOS_EAST = "GEOS_EAST";  // GEOS 13
const GEOS_WEST = "GEOS_WEST";  // GEOS 15

const WIDTH = 550;
const BLOCK_SIZES = [1, 4, 8, 16, 20];

const DSCOVR_WIDTH = 2048;
const GEOS_WIDTH = 3072;

const IMAGE_QUALITY = 0.9;
const RELOAD_INTERVAL = 1 * 60 * 1000;  // 1 minutes
const RELOAD_TIME_INTERVAL = 10 * 1000;  // 10 seconds

// local storage keys
const IMAGE_DATA_KEY = "imageData";
const CACHED_DATE_KEY = "cachedDate";
const CACHED_IMAGE_TYPE_KEY = "cachedImageType";

// unknown date
const UNKNOWN = 'unknown';

const isChromeExtension = window.chrome && chrome.app.getDetails();

/**
 * Returns an array of objects containing URLs and metadata
 * for Himawari 8 image tiles based on a given date.
 * Options:
 * - date: Date object
 * - type: boolean (default: visible light)
 * - zoom: number (default: 1)
 * - blocks: alternative to zoom, how many images per row/column (default: 1)
 *      Has to be a valid block number (1, 4, 8, 16, 20)
 *
 * @param  {Object}       options
 */
function himawariURLs(options) {
  options = options || {};
  const baseURL = HIMAWARI_BASE_URL + (options.type || VISIBLE_LIGHT);
  const date = options.date;

  // Define some image parameters
  const blocks = options.blocks || (options.zoom ? BLOCK_SIZES[options.zoom - 1] : BLOCK_SIZES[0]);
  const level = blocks + 'd';
  const time = [date.getUTCHours(), date.getUTCMinutes(), date.getUTCSeconds()].map(function (s) { return pad(s, 2) }).join("");
  const year = date.getUTCFullYear();
  const month = pad(date.getUTCMonth() + 1, 2);
  const day = pad(date.getUTCDate(), 2);

  // compose URL
  const tilesURL = [baseURL, level, WIDTH, year, month, day, time].join("/");
  const tiles = [];

  for (let y = 0; y < blocks; y++) {
    for (let x = 0; x < blocks; x++) {
      const name = x + "_" + y + ".png";
      const url = tilesURL + "_" + name;

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
 * Parses a date string into a date object.
 * @param   {string | Date} date  Date as string or date object
 * @returns {Date}                Date object
 */
function resolveDate(date) {
  if (typeof date === "string") {
    // Don't use Date.parse because it doesn't work with YYYY-MM-DD HH:MM:SSZ
    const parts = date.match(/(\d{4})-(\d{2})-(\d{2})\s(\d{2}):(\d{2}):(\d{2})Z/);
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
  const cache = 5 * 24 * 60 * 60;
  return `https://images1-focus-opensocial.googleusercontent.com/gadgets/proxy?url=${url}&container=focus&refresh=${cache}`;
}

/**
 * Pads a number with trailing zeros and makes it a string.
 */
function pad(num, size) {
  let s = num + "";
  while (s.length < size) {
    s = "0" + s;
  }
  return s;
}

/**
 * Get the date of the latest himawari image by making an Ajax request.
 * @param   {string}  imageType  The type of image
 * @returns {function}           callback function
 */
function getLatestHimawariDate(imageType, cb) {
  json("https://himawari-8.appspot.com/latest" + (imageType === INFRARED ? "?infrared=true" : ""),
    function (error, data) {
      if (error) throw error;
      const latest = data.date;
      cb(resolveDate(latest + "Z"));
    });
}

function getLatestDscovrDate(imageType, cb) {
  json("http://epic.gsfc.nasa.gov/api/" + (imageType === DSCOVR_EPIC_ENHANCED ? "enhanced" : "natural"),
    function (error, data) {
      if (error) throw error;
      if (data.length === 0) return;
      const latest = data[data.length - 1];
      latest.date = resolveDate(latest.date + "Z")
      cb(latest);
    });
}

/**
 * Looks at the screen resolution and figures out a zoom level that returns images at a sufficient resolution.
 */
function getOptimalNumberOfBlocks() {
  const height = document.getElementById("output").clientHeight * window.devicePixelRatio;
  const minNumber = height / WIDTH;

  for (let i = 0; i < BLOCK_SIZES.length; i++) {
    const l = BLOCK_SIZES[i];
    if (l > minNumber) {
      return l;
    }
  }

  console.log(height)

  return BLOCK_SIZES[BLOCK_SIZES.length - 1];
}

// the date that is currently loaded
let loadedDate = null;
let loadedType = null;

function timeSince(date) {
  const seconds = Math.floor((new Date() - date) / 1000);

  let interval = Math.floor(seconds / 31536000);

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
  if (date === UNKNOWN) {
    document.getElementById("time").innerHTML = "";
  } else {
    document.getElementById("time").innerHTML = "<abbr title=\"" + date + "\">" + timeSince(date) + "</abbr> ago";
  }
}

/*
 * Set the right class on the body so that we can have different css.
 */
function setBodyClass(imageType) {
  document.body.classList.remove("himawari");
  document.body.classList.remove("dscovr");
  document.body.classList.remove("geos");

  switch (imageType) {
    case INFRARED:
    case VISIBLE_LIGHT:
      document.body.classList.add("himawari");
      break;
    case DSCOVR_EPIC:
    case DSCOVR_EPIC_ENHANCED:
      document.body.classList.add("dscovr");
      break;
    case GEOS_EAST:
    case GEOS_WEST:
      document.body.classList.add("geos");
      break;
    default:
      console.warn("Unknown image type", imageType)
  }
}

function updateStateAndUI(date, imageType) {
  updateTimeAgo(date);
  loadedDate = date;
  setBodyClass(imageType);
  loadedType = imageType;
}

/**
 * Creates an image composed of tiles.
 * @param {Date object} date  The date for which to load the data.
 */
function setHimawariImages(date, imageType) {
  // no need to set images if we have up to date images and the image type has not changed
  if (loadedDate && date.getTime() === loadedDate.getTime() && loadedType === imageType) {
    return;
  }

  // if we haven't loaded images before, we want to show progress
  const initialLoad = !localStorage.getItem(CACHED_DATE_KEY);

  // immediately set the type and body class beacuse we are not loading in the background
  if (initialLoad) {
    updateStateAndUI(date, imageType)
  }

  // get the URLs for all tiles
  const result = himawariURLs({
    date: date,
    blocks: getOptimalNumberOfBlocks(),
    type: imageType
  });

  const pixels = result.blocks * WIDTH;

  const canvas = initialLoad ? document.getElementById("output") : document.createElement("canvas");
  const ctx = canvas.getContext("2d");
  ctx.canvas.width = pixels;
  ctx.canvas.height = pixels;

  const q = queue();

  // add image to canvas and call callback when done
  function addImage(tile, callback) {
    const img = new Image();
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
      const output = document.getElementById("output");
      const outCtx = output.getContext("2d")
      outCtx.canvas.width = pixels;
      outCtx.canvas.height = pixels;
      outCtx.drawImage(canvas, 0, 0);
    }

    updateStateAndUI(date, imageType);

    // put date and image data in cache
    const imageData = canvas.toDataURL("image/jpeg", IMAGE_QUALITY);
    localStorage.setItem(IMAGE_DATA_KEY, imageData);
    localStorage.setItem(CACHED_DATE_KEY, date);
    localStorage.setItem(CACHED_IMAGE_TYPE_KEY, imageType);
  });
}

function setDscovrImage(latest, imageType) {
  // no need to set images if we have up to date images and the image type has not changed
  if (loadedDate && latest.date.getTime() === loadedDate.getTime() && loadedType === imageType) {
    return;
  }

  // if we haven't loaded images before, we want to show progress
  const initialLoad = !localStorage.getItem(CACHED_DATE_KEY);

  // immediately set the type and body class beacuse we are not loading in the background
  if (initialLoad) {
    updateStateAndUI(latest.date, imageType)
  }

  const canvas = initialLoad ? document.getElementById("output") : document.createElement("canvas");
  const ctx = canvas.getContext("2d");
  ctx.canvas.width = DSCOVR_WIDTH;
  ctx.canvas.height = DSCOVR_WIDTH;

  const img = new Image();
  img.setAttribute("crossOrigin", "anonymous");
  img.onload = function () {
    ctx.drawImage(img, 0, 0);

    if (!initialLoad) {
      // copy canvas into output in one step
      const output = document.getElementById("output");
      const outCtx = output.getContext("2d")
      outCtx.canvas.width = DSCOVR_WIDTH;
      outCtx.canvas.height = DSCOVR_WIDTH;
      outCtx.drawImage(canvas, 0, 0);
    }

    updateStateAndUI(latest.date, imageType)

    // put date and image data in cache
    const imageData = canvas.toDataURL("image/jpeg", IMAGE_QUALITY);
    localStorage.setItem(IMAGE_DATA_KEY, imageData);
    localStorage.setItem(CACHED_DATE_KEY, latest.date);
    localStorage.setItem(CACHED_IMAGE_TYPE_KEY, imageType);
  }
  const type = imageType === DSCOVR_EPIC_ENHANCED ? "enhanced" : "natural";
  const month = pad(latest.date.getMonth() + 1, 2);
  const date = pad(latest.date.getDate(), 2);
  img.src = getCachedUrl(`${DSCOVR_BASE_URL}${type}/${latest.date.getFullYear()}/${month}/${date}/png/${latest.image}.png`);
}

function setGeosImage(imageType) {
  // if we haven't loaded images before, we want to show progress
  const key = localStorage.getItem(CACHED_IMAGE_TYPE_KEY);
  const initialLoad = !key || (key !== GEOS_EAST && key !== GEOS_WEST);

  // immediately set the type and body class beacuse we are not loading in the background
  if (initialLoad) {
    updateStateAndUI(UNKNOWN, imageType)
  }

  const canvas = initialLoad ? document.getElementById("output") : document.createElement("canvas");
  const ctx = canvas.getContext("2d");
  ctx.canvas.width = GEOS_WIDTH;
  ctx.canvas.height = GEOS_WIDTH;

  const img = new Image();
  img.setAttribute("crossOrigin", "anonymous");
  img.onload = function () {
    ctx.drawImage(img, 0, 0);

    if (!initialLoad) {
      // copy canvas into output in one step
      const output = document.getElementById("output");
      const outCtx = output.getContext("2d")
      outCtx.canvas.width = GEOS_WIDTH;
      outCtx.canvas.height = GEOS_WIDTH;
      outCtx.drawImage(canvas, 0, 0);
    }

    updateStateAndUI(UNKNOWN, imageType)

    // put date and image data in cache
    const imageData = canvas.toDataURL("image/jpeg", IMAGE_QUALITY);
    localStorage.setItem(IMAGE_DATA_KEY, imageData);
    localStorage.setItem(CACHED_DATE_KEY, UNKNOWN);
    localStorage.setItem(CACHED_IMAGE_TYPE_KEY, imageType);
  }

  img.src = getCachedUrl(imageType === GEOS_WEST ? GEOS_WEST_URL : GEOS_EAST_URL);
}

/* Asynchronously load latest image(s) date and images for that date */
function setLatestImage() {
  if (!navigator.onLine) {
    // browser is offline, no need to do this
    return;
  }

  function himawariCallback(imageType) {
    getLatestHimawariDate(imageType, function (latest) {
      setHimawariImages(latest, imageType);
    });
  }

  function dscovrCallback(imageType) {
    getLatestDscovrDate(imageType, function (latest) {
      setDscovrImage(latest, imageType);
    });
  }

  function geosCallback(imageType) {
    setGeosImage(imageType);
  }

  if (isChromeExtension) {
    chrome.storage.sync.get({
      imageType: VISIBLE_LIGHT
    }, function (items) {
      switch (items.imageType) {
        case DSCOVR_EPIC:
        case DSCOVR_EPIC_ENHANCED:
          dscovrCallback(items.imageType);
          break;
        case INFRARED:
        case VISIBLE_LIGHT:
        default:
          himawariCallback(items.imageType);
          break;
        case GEOS_EAST:
        case GEOS_WEST:
          geosCallback(items.imageType);
          break;
      }
    });
  } else {
    // if we are not in the extension, let's always load visible light
    himawariCallback(VISIBLE_LIGHT);
  }
}

/** Load image from local storage */
function setCachedImage() {
  const canvas = document.getElementById("output");
  const ctx = canvas.getContext("2d");
  const date = new Date(localStorage.getItem(CACHED_DATE_KEY));

  const img = new Image();
  img.onload = function () {
    ctx.canvas.width = img.width;
    ctx.canvas.height = img.height;
    ctx.drawImage(img, 0, 0);

    updateStateAndUI(date, localStorage.getItem(CACHED_IMAGE_TYPE_KEY));
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
  window.open(loadedType === DSCOVR_EPIC ? DSCOVR_EXPLORER : loadedType === DSCOVR_EPIC_ENHANCED ? DSCOVR_EXPLORER_ENHANCED : HIMAWARI_EXPLORER, "_self");
});
