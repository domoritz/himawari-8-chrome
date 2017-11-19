import {queue} from "d3-queue";
import {json} from "d3-request";
import {utcFormat, utcParse} from "d3-time-format";

// base url for images
const HIMAWARI_BASE_URL = "https://himawari8-dl.nict.go.jp/himawari8/img/";
const DSCOVR_BASE_URL = "https://epic.gsfc.nasa.gov/archive/";

const GOES_EAST_URL = "http://goes.gsfc.nasa.gov/goescolor/goeseast/overview2/color_lrg/latestfull.jpg";
const GOES_WEST_URL = "http://goes.gsfc.nasa.gov/goescolor/goeswest/overview2/color_lrg/latestfull.jpg";

const SLIDER_BASE_URL = "http://rammb-slider.cira.colostate.edu/data/";

// links to online image explorers
const HIMAWARI_EXPLORER = "http://himawari8.nict.go.jp/himawari8-image.htm?sI=D531106";
const DSCOVR_EXPLORER = "https://epic.gsfc.nasa.gov";
const DSCOVR_EXPLORER_ENHANCED = DSCOVR_EXPLORER + "/enhanced";
const SLIDER_EXPLORER = "http://rammb-slider.cira.colostate.edu/";

// image types
const INFRARED = "INFRARED_FULL";
const VISIBLE_LIGHT = "D531106";
const DSCOVR_EPIC = "EPIC";
const DSCOVR_EPIC_ENHANCED = "EPIC_ENHANCED";
const GOES_EAST = "GOES_EAST";  // GOES 13
const GOES_WEST = "GOES_WEST";  // GOES 15
const GOES_16 = "GOES_16";

type ImageType = typeof INFRARED | typeof VISIBLE_LIGHT | typeof DSCOVR_EPIC |
  typeof DSCOVR_EPIC_ENHANCED | typeof GOES_EAST | typeof GOES_WEST | typeof GOES_16;

const HIMAWARI_WIDTH = 550;
const HIMAWARI_BLOCK_SIZES = [1, 4, 8, 16, 20];

const SLIDER_WIDTH = 678;
const SLIDER_BLOCK_SIZES = [1, 2, 4, 8, 16];

const DSCOVR_WIDTH = 2048;
const GOES_WIDTH = 3072;

const IMAGE_QUALITY = 0.9;
const RELOAD_INTERVAL = 1 * 60 * 1000;  // 1 minutes
const RELOAD_TIME_INTERVAL = 10 * 1000;  // 10 seconds

// local storage keys
const IMAGE_DATA_KEY = "imageData";
const CACHED_DATE_KEY = "cachedDate";
const CACHED_IMAGE_TYPE_KEY = "cachedImageType";

// unknown date
const UNKNOWN: Date = null;

const isExtension = "chrome" in window && !!(window as any).chrome.storage;

interface ITile {
  x: number;
  y: number;
  url: string;
}

/**
 * Returns an array of objects containing URLs and metadata
 * for Himawari 8 image tiles based on a given date.
 * Options:
 * - date: Date object
 * - type: boolean (default: visible light)
 * - blocks: alternative to zoom, how many images per row/column (default: 1)
 *      Has to be a valid block number (1, 4, 8, 16, 20)
 *
 * @param  {Object}       options
 */
function himawariURLs(options: {date: Date, type?: ImageType, blocks: number}) {
  const baseURL = HIMAWARI_BASE_URL + (options.type || VISIBLE_LIGHT);
  const date = options.date;

  // Define some image parameters
  const blocks = options.blocks;

  // compose URL
  const tilesURL = `${baseURL}/${blocks}d/${HIMAWARI_WIDTH}/${utcFormat("%Y/%m/%d/%H%M%S")(date)}`;
  const tiles: ITile[] = [];

  for (let y = 0; y < blocks; y++) {
    for (let x = 0; x < blocks; x++) {
      const url = `${tilesURL}_${x}_${y}.png`;

      tiles.push({
        url: getCachedUrl(url),
        x,
        y,
      });
    }
  }

  return {
    blocks,
    date,
    tiles,
  };
}

function sliderURLs(options: {date: Date, blocks: number, level: number}) {
  const date = options.date;

  const blocks = options.blocks;
  const level = options.level;

  const formattedDate = utcFormat("%Y%m%d")(options.date);
  const formattedDateTime = utcFormat("%Y%m%d%H%M%S")(options.date);

  const tilesURL = `${SLIDER_BASE_URL}/imagery/${formattedDate}/goes-16---full_disk/geocolor/${formattedDateTime}/`;
  const tiles: ITile[] = [];

  for (let y = 0; y < blocks; y++) {
    for (let x = 0; x < blocks; x++) {
      const url = `${tilesURL}${pad(level, 2)}/${pad(y, 3)}_${pad(x, 3)}.png`;

      tiles.push({
        url: getCachedUrl(url),
        x,
        y,
      });
    }
  }

  return {
    blocks,
    date,
    tiles,
  };
}

/**
 * Create a cached URL thanks to our friends at Google.
 * See https://gist.github.com/carlo/5379498
 *
 * Default caching is 5 days, in seconds
 */
function getCachedUrl(url: string, cache = 5 * 24 * 60 * 60) {
  return `https://images1-focus-opensocial.googleusercontent.com/gadgets/proxy?url=${url}&container=focus&refresh=${cache}`;
}

/**
 * Pads a number with trailing zeros and makes it a string.
 */
function pad(num: string | number, size: number) {
  let s = num + "";
  while (s.length < size) {
    s = "0" + s;
  }
  return s;
}

/**
 * Get the date of the latest Himawari image by making an Ajax request.
 * @param   {string}  imageType  The type of image
 * @returns {function}           callback function
 */
function getLatestHimawariDate(imageType: ImageType, cb: (date: Date) => void) {
  json("https://himawari-8.appspot.com/latest" + (imageType === INFRARED ? "?infrared=true" : ""),
    (error, data: {date: string}) => {
      if (error) { throw error; }
      const latest = data.date;
      cb(utcParse("%Y-%m-%d %H:%M:%S")(latest));
    });
}

function getLatestDscovrDate(imageType: ImageType, cb: (latest: {date: Date, image: string}) => void) {
  json("http://epic.gsfc.nasa.gov/api/" + (imageType === DSCOVR_EPIC_ENHANCED ? "enhanced" : "natural"),
    (error, data: Array<{date: string, image: string}>) => {
      if (error) { throw error; }
      if (data.length === 0) { return; }
      const latest = data[data.length - 1];
      cb({
        date: utcParse("%Y-%m-%d %H:%M:%S")(latest.date),
        image: latest.image,
      });
    });
}

function getLatestSliderDate(cb: (date: Date) => void) {
  json(`${SLIDER_BASE_URL}json/goes-16/full_disk/geocolor/latest_times.json`, (error, data: {timestamps_int: string[]}) => {
    if (error) { throw error; }
    cb(utcParse("%Y%m%d%H%M%S")(data.timestamps_int[0]));
  });
}

/**
 * Looks at the screen resolution and figures out a zoom level that returns images at a sufficient resolution.
 */
function getOptimalNumberOfBlocks(width: number, sizes: number[]): {blocks: number, level: number} {
  const height = (document.getElementById("output")!).clientHeight * window.devicePixelRatio;
  const minNumber = height / width;

  for (let level = 0; level < sizes.length; level++) {
    const blocks = sizes[level];
    if (blocks > minNumber) {
      return {blocks, level};
    }
  }

  const lastLevel = sizes.length - 1;
  return {blocks: sizes[lastLevel], level: lastLevel};
}

// the date that is currently loaded
let loadedDate: Date = null;
let loadedType: ImageType = null;

function timeSince(date: Date) {
  const seconds = Math.floor(((new Date()).getTime() - date.getTime()) / 1000);

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

function updateTimeAgo(date: Date) {
  if (date === UNKNOWN) {
    document.getElementById("time").innerHTML = "";
  } else {
    document.getElementById("time").innerHTML = `<abbr title="${date}">${timeSince(date)}</abbr> ago`;
  }
}

/*
 * Set the right class on the body so that we can have different css.
 */
function setBodyClass(imageType: ImageType) {
  document.body.classList.remove("himawari");
  document.body.classList.remove("dscovr");
  document.body.classList.remove("goes");
  document.body.classList.remove("goes16");

  switch (imageType) {
    case INFRARED:
    case VISIBLE_LIGHT:
      document.body.classList.add("himawari");
      break;
    case DSCOVR_EPIC:
    case DSCOVR_EPIC_ENHANCED:
      document.body.classList.add("dscovr");
      break;
    case GOES_16:
      document.body.classList.add("goes16");
      break;
    case GOES_EAST:
    case GOES_WEST:
      document.body.classList.add("goes");
      break;
    default:
      console.warn("Unknown image type", imageType);
  }
}

function updateStateAndUI(date: Date, imageType: ImageType) {
  updateTimeAgo(date);
  loadedDate = date;
  setBodyClass(imageType);
  loadedType = imageType;
}

/**
 * Creates an image composed of tiles.
 * @param {Date object} date  The date for which to load the data.
 */
function setHimawariImages(date: Date, imageType: ImageType) {
  // no need to set images if we have up to date images and the image type has not changed
  if (loadedDate && date.getTime() === loadedDate.getTime() && loadedType === imageType) {
    return;
  }

  // if we haven't loaded images before, we want to show progress
  const initialLoad = !localStorage.getItem(CACHED_DATE_KEY);

  // immediately set the type and body class because we are not loading in the background
  if (initialLoad) {
    updateStateAndUI(date, imageType);
  }

  // get the URLs for all tiles
  const result = himawariURLs({
    blocks: getOptimalNumberOfBlocks(HIMAWARI_WIDTH, HIMAWARI_BLOCK_SIZES).blocks,
    date,
    type: imageType,
  });

  const pixels = result.blocks * HIMAWARI_WIDTH;

  const canvas = initialLoad ? document.getElementById("output") as HTMLCanvasElement : document.createElement("canvas");
  const ctx = canvas.getContext("2d")!;
  ctx.canvas.width = pixels;
  ctx.canvas.height = pixels;

  const q = queue();

  // add image to canvas and call callback when done
  function addImage(tile: ITile, callback: () => void) {
    const img = new Image();
    img.setAttribute("crossOrigin", "anonymous");
    img.onload = () => {
      ctx.drawImage(img, tile.x * HIMAWARI_WIDTH, tile.y * HIMAWARI_WIDTH, HIMAWARI_WIDTH, HIMAWARI_WIDTH);
      callback();
    };
    img.src = tile.url;
  }

  result.tiles.forEach(tile => {
    q.defer(addImage, tile);
  });

  // wait for all images to be drawn on canvas
  q.awaitAll(error => {
    if (error) { throw error; }

    if (!initialLoad) {
      // copy canvas into output in one step
      const output = document.getElementById("output") as HTMLCanvasElement;
      const outCtx = output.getContext("2d");
      outCtx.canvas.width = pixels;
      outCtx.canvas.height = pixels;
      outCtx.drawImage(canvas, 0, 0);
    }

    updateStateAndUI(date, imageType);

    // put date and image data in cache
    const imageData = canvas.toDataURL("image/jpeg", IMAGE_QUALITY);
    localStorage.setItem(IMAGE_DATA_KEY, imageData);
    localStorage.setItem(CACHED_DATE_KEY, date.toDateString());
    localStorage.setItem(CACHED_IMAGE_TYPE_KEY, imageType);
  });
}

function setDscovrImage(latest: {date: Date, image: string}, imageType: ImageType) {
  // no need to set images if we have up to date images and the image type has not changed
  if (loadedDate && latest.date.getTime() === loadedDate.getTime() && loadedType === imageType) {
    return;
  }

  // if we haven't loaded images before, we want to show progress
  const initialLoad = !localStorage.getItem(CACHED_DATE_KEY);

  // immediately set the type and body class because we are not loading in the background
  if (initialLoad) {
    updateStateAndUI(latest.date, imageType);
  }

  const canvas = initialLoad ? document.getElementById("output") as HTMLCanvasElement : document.createElement("canvas");
  const ctx = canvas.getContext("2d");
  ctx.canvas.width = DSCOVR_WIDTH;
  ctx.canvas.height = DSCOVR_WIDTH;

  const img = new Image();
  img.setAttribute("crossOrigin", "anonymous");
  img.onload = () => {
    ctx.drawImage(img, 0, 0);

    if (!initialLoad) {
      // copy canvas into output in one step
      const output = document.getElementById("output") as HTMLCanvasElement;
      const outCtx = output.getContext("2d");
      outCtx.canvas.width = DSCOVR_WIDTH;
      outCtx.canvas.height = DSCOVR_WIDTH;
      outCtx.drawImage(canvas, 0, 0);
    }

    updateStateAndUI(latest.date, imageType);

    // put date and image data in cache
    const imageData = canvas.toDataURL("image/jpeg", IMAGE_QUALITY);
    localStorage.setItem(IMAGE_DATA_KEY, imageData);
    localStorage.setItem(CACHED_DATE_KEY, latest.date.toDateString());
    localStorage.setItem(CACHED_IMAGE_TYPE_KEY, imageType);
  };

  const type = imageType === DSCOVR_EPIC_ENHANCED ? "enhanced" : "natural";
  const month = pad(latest.date.getMonth() + 1, 2);
  const date = pad(latest.date.getDate(), 2);
  img.src = getCachedUrl(`${DSCOVR_BASE_URL}${type}/${latest.date.getFullYear()}/${month}/${date}/png/${latest.image}.png`);
}

function setGoesImage(imageType: ImageType) {
  // if we haven't loaded images before, we want to show progress
  const key = localStorage.getItem(CACHED_IMAGE_TYPE_KEY);
  const initialLoad = !key || (key !== GOES_EAST && key !== GOES_WEST);

  // immediately set the type and body class because we are not loading in the background
  if (initialLoad) {
    updateStateAndUI(UNKNOWN, imageType);
  }

  const canvas = initialLoad ? document.getElementById("output") as HTMLCanvasElement : document.createElement("canvas");
  const ctx = canvas.getContext("2d");
  ctx.canvas.width = GOES_WIDTH;
  ctx.canvas.height = GOES_WIDTH;

  const img = new Image();
  img.setAttribute("crossOrigin", "anonymous");
  img.onload = () => {
    ctx.drawImage(img, 0, 0);

    if (!initialLoad) {
      // copy canvas into output in one step
      const output = document.getElementById("output") as HTMLCanvasElement;
      const outCtx = output.getContext("2d");
      outCtx.canvas.width = GOES_WIDTH;
      outCtx.canvas.height = GOES_WIDTH;
      outCtx.drawImage(canvas, 0, 0);
    }

    updateStateAndUI(UNKNOWN, imageType);

    // put date and image data in cache
    const imageData = canvas.toDataURL("image/jpeg", IMAGE_QUALITY);
    localStorage.setItem(IMAGE_DATA_KEY, imageData);
    localStorage.setItem(CACHED_DATE_KEY, String(UNKNOWN));
    localStorage.setItem(CACHED_IMAGE_TYPE_KEY, imageType);
  };

  img.src = getCachedUrl(imageType === GOES_WEST ? GOES_WEST_URL : GOES_EAST_URL, 60 * 60);
}

function setSliderImages(date: Date, imageType: ImageType) {
  // no need to set images if we have up to date images and the image type has not changed
  if (loadedDate && date.getTime() === loadedDate.getTime() && loadedType === imageType) {
    return;
  }

  // if we haven't loaded images before, we want to show progress
  const initialLoad = !localStorage.getItem(CACHED_DATE_KEY);

  // immediately set the type and body class because we are not loading in the background
  if (initialLoad) {
    updateStateAndUI(date, imageType);
  }

  // get the URLs for all tiles
  const result = sliderURLs({
    date,
    ...getOptimalNumberOfBlocks(SLIDER_WIDTH, SLIDER_BLOCK_SIZES),
  });

  const pixels = result.blocks * HIMAWARI_WIDTH;

  const canvas = initialLoad ? document.getElementById("output") as HTMLCanvasElement : document.createElement("canvas");
  const ctx = canvas.getContext("2d")!;
  ctx.canvas.width = pixels;
  ctx.canvas.height = pixels;

  const q = queue();

  // add image to canvas and call callback when done
  function addImage(tile: ITile, callback: () => void) {
    const img = new Image();
    img.setAttribute("crossOrigin", "anonymous");
    img.onload = () => {
      ctx.drawImage(img, tile.x * HIMAWARI_WIDTH, tile.y * HIMAWARI_WIDTH, HIMAWARI_WIDTH, HIMAWARI_WIDTH);
      callback();
    };
    img.src = tile.url;
  }

  result.tiles.forEach(tile => {
    q.defer(addImage, tile);
  });

  // wait for all images to be drawn on canvas
  q.awaitAll(error => {
    if (error) { throw error; }

    if (!initialLoad) {
      // copy canvas into output in one step
      const output = document.getElementById("output") as HTMLCanvasElement;
      const outCtx = output.getContext("2d");
      outCtx.canvas.width = pixels;
      outCtx.canvas.height = pixels;
      outCtx.drawImage(canvas, 0, 0);
    }

    updateStateAndUI(date, imageType);

    // put date and image data in cache
    const imageData = canvas.toDataURL("image/jpeg", IMAGE_QUALITY);
    localStorage.setItem(IMAGE_DATA_KEY, imageData);
    localStorage.setItem(CACHED_DATE_KEY, date.toDateString());
    localStorage.setItem(CACHED_IMAGE_TYPE_KEY, imageType);
  });
}

/** Wrapper around browser extension API. */
function getBrowserOptions(callback: (options: {imageType: ImageType, animated: boolean}) => void) {
  const query = {
    animated: false,
    imageType: VISIBLE_LIGHT,
  };

  if ("browser" in window) {
    // Firefox uses a promise based API.
    (window as any).browser.storage.sync.get(query).then(callback);
  } else {
    // Chrome uses callbacks.
    (window as any).chrome.storage.sync.get(query, callback);
  }
}

/* Asynchronously load latest image(s) date and images for that date */
function setLatestImage() {
  if (!navigator.onLine) {
    // browser is offline, no need to do this
    return;
  }

  function himawariCallback(imageType: ImageType) {
    getLatestHimawariDate(imageType, (latest: Date) => {
      setHimawariImages(latest, imageType);
    });
  }

  function dscovrCallback(imageType: ImageType) {
    getLatestDscovrDate(imageType, (latest: {date: Date, image: string}) => {
      setDscovrImage(latest, imageType);
    });
  }

  function sliderCallback(imageType: ImageType) {
    getLatestSliderDate((latest: Date) => {
      setSliderImages(latest, imageType);
    });
  }

  if (isExtension) {
    getBrowserOptions(options => {
      switch (options.imageType) {
        case DSCOVR_EPIC:
        case DSCOVR_EPIC_ENHANCED:
          dscovrCallback(options.imageType);
          break;
        case GOES_EAST:
        case GOES_WEST:
          setGoesImage(options.imageType);
          break;
        case GOES_16:
          sliderCallback(options.imageType);
          break;
        case INFRARED:
        case VISIBLE_LIGHT:
        default:
          himawariCallback(options.imageType);
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
  const canvas = document.getElementById("output") as HTMLCanvasElement;
  const ctx = canvas.getContext("2d");
  const date = new Date(localStorage.getItem(CACHED_DATE_KEY));

  const img = new Image();
  img.onload = () => {
    ctx.canvas.width = img.width;
    ctx.canvas.height = img.height;
    ctx.drawImage(img, 0, 0);

    updateStateAndUI(date, localStorage.getItem(CACHED_IMAGE_TYPE_KEY) as ImageType);
  };
  img.src = localStorage.getItem(IMAGE_DATA_KEY);
}

// check if there are new images form time to time
window.setInterval(setLatestImage, RELOAD_INTERVAL);

// also load a new image when we come back online
window.addEventListener("online", setLatestImage);

function init() {
  // initial loading
  if (localStorage.getItem(CACHED_DATE_KEY)) {
    setCachedImage();
  }
  setLatestImage();
}

// enable or disable animation
if (isExtension) {
  getBrowserOptions(options => {
    if (options.animated) {
      document.body.classList.add("animated");
    } else {
      document.body.classList.remove("animated");
    }
    init();
  });
} else {
  init();
}

// update the time ago
window.setInterval(() => {
  if (loadedDate) {
    updateTimeAgo(loadedDate);
  }
}, RELOAD_TIME_INTERVAL);

// hide some things if we are not an extension
if (isExtension) {
  // when we are in an extension and the storage updates, try to load the new image
  (window as any).chrome.storage.onChanged.addListener(setLatestImage);

  document.body.classList.add("extension");
  document.getElementById("go-to-options").addEventListener("click", () => {
    (window as any).chrome.runtime.openOptionsPage();
  });
}

document.getElementById("explore").addEventListener("click", () => {
  switch (loadedType) {
    case DSCOVR_EPIC:
      window.open(DSCOVR_EXPLORER, "_self");
    case DSCOVR_EPIC_ENHANCED:
      window.open(DSCOVR_EXPLORER_ENHANCED, "_self");
      break;
    case GOES_16:
      window.open(SLIDER_EXPLORER, "_self");
      break;
    case INFRARED:
    case VISIBLE_LIGHT:
      window.open(HIMAWARI_EXPLORER, "_self");
      break;
    default:
      window.alert("No explorer found.");
      break;
  }
});
