var BASE_URL = "http://himawari8-dl.nict.go.jp/himawari8/img/";
var INFRARED = "INFRARED_FULL";
var VISIBLE_LIGHT = "D531106";
var WIDTH = 550;
var BLOCK_SIZES = [1, 4, 8, 16, 20];

/**
 * Returns an array of objects containing URLs and metadata
 * for Himawari 8 image tiles based on a given date.
 * Options:
 * - date: Date object, Date string (YYYY-MM-DD HH:MM:SSZ), or "latest"
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
  var baseUrl = getBaseURL(infrared);
  var req = new XMLHttpRequest();
  req.onload = function() {
    var data = JSON.parse(req.responseText);
    var latest = data.query.results.json.date;
    cb(latest + "Z");
  };

  // proxy through yahoo because of same origin restrictions
  var query = "select * from json where url=\"" + baseUrl + "/latest.json\"";
  req.open("GET", "https://query.yahooapis.com/v1/public/yql?q=" + query + "&format=json", true);
  req.send();
}

/**
 * Looks at the screen resolution and figures out a zoom level that returns images at a sufficient resolution.
 */
function getOptimalNumberOfBlocks() {
  var height = window.innerHeight * window.devicePixelRatio;
  var minNumber = height/WIDTH;

  for (var i = 0; i < BLOCK_SIZES.length; i++) {
    var l = BLOCK_SIZES[i];
    if (l > minNumber) {
      return l;
    }
  }

  return BLOCK_SIZES[BLOCK_SIZES.length - 1];
}

/**
 * Creates an image composed of tiles.
 */
function setImages() {
  getLatestDate(false, function(latest) {
    var result = himawariURLs({
      date: latest, //"2016-02-11 2:30:00",
      blocks: getOptimalNumberOfBlocks()
    });

    var el = document.getElementById("wrapper");

    el.setAttribute("class", "wrapper-" + result.blocks);

    el.innerHTML = "";
    for (var i = 0; i < result.tiles.length; i++) {
      var image = document.createElement("img");
      image.setAttribute("src", result.tiles[i].url);
      el.appendChild(image);
    }

    var ago = (Date.now() - result.date.getTime()) / (1000 * 60);
    document.getElementById("time").innerHTML = "<abbr title=\"" + result.date + "\">" + Math.floor(ago) + " minutes</abbr> ago";
  });
}

// Refresh every 5 minutes
window.setInterval(setImages, 1000*60*5);
setImages();
