/**
 * @copyright BBC 2018
 * @author BBC Children's D+E
 * @license Apache-2.0
 */
import { parseUrlParams } from "../parseUrlParams.js";
import { gmi } from "../gmi/gmi.js";

var urlParams = function urlParams(window) {
  return parseUrlParams(window.location.search);
};

var testURL = function testURL(window) {
  return window.location.hostname.includes("www.test.bbc.");
};

var create = function create(window) {
  if (isDebug() || testURL(window)) {
    window.__debug = {
      gmi: gmi
    };
  }
};

var isDebug = function isDebug() {
  return Boolean(urlParams(window).debug);
};

export { isDebug, create };