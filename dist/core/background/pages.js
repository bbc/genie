function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _iterableToArray(iter) { if (typeof Symbol !== "undefined" && Symbol.iterator in Object(iter)) return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) return _arrayLikeToArray(arr); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

/**
 * @copyright BBC 2020
 * @author BBC Children's D+E
 * @license Apache-2.0
 */
import fp from "../../../lib/lodash/fp/fp.js";
import { createTween, isTween } from "./tweens.js";
import { createAudio, isAudio } from "./audio.js";

var createItems = function createItems(scene) {
  var checks = [];
  var background = scene.config.background;
  background && background.audio && checks.push([isAudio(scene), createAudio(scene)]);
  background && background.tweens && checks.push([isTween(scene), createTween(scene)]);
  return fp.cond(checks);
};

var getAllItems = function getAllItems(background) {
  return [].concat(_toConsumableArray(background.tweens || []), _toConsumableArray(background.audio || [])).map(function (i) {
    return i.name;
  });
};

var getTimedItems = function getTimedItems(scene) {
  var pages = fp.get("config.background.pages", scene);
  var timedItems = pages ? pages[scene.pageIdx] : getAllItems(scene.config.background || {});
  return timedItems.map(createItems(scene));
};

export var skip = function skip(timedItems) {
  return timedItems.forEach(function (item) {
    return item.stop(1);
  });
};
export var nextPage = function nextPage(scene) {
  return function () {
    skip(scene.timedItems);
    scene.pageIdx++;
    var pages = fp.get("config.background.pages", scene);
    var lastPage = pages ? scene.pageIdx >= pages.length : false;
    lastPage ? scene.navigation.next() : scene.timedItems = getTimedItems(scene);
  };
};