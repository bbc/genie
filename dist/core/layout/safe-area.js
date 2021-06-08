function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _iterableToArray(iter) { if (typeof Symbol !== "undefined" && Symbol.iterator in Object(iter)) return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) return _arrayLikeToArray(arr); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

/**
 * Generates a safe frame that can be used to place elements
 *
 * @module layout/layout
 * @copyright BBC 2020
 * @author BBC Children's D+E
 * @license Apache-2.0
 */
import fp from "../../../lib/lodash/fp/fp.js";
import { getMetrics } from "../scaler.js";
var defaultSafeAreaGroups = {
  top: "topLeft",
  left: [{
    id: "middleLeftSafe"
  }, {
    id: "topLeft",
    fixedWidth: 64
  }],
  bottom: "bottomCenter",
  right: [{
    id: "middleRightSafe"
  }, {
    id: "topRight",
    fixedWidth: 64
  }]
};
export var getSafeAreaFn = function getSafeAreaFn(groups) {
  return function () {
    var groupOverrides = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
    var metrics = getMetrics();

    var safe = _objectSpread(_objectSpread({}, defaultSafeAreaGroups), groupOverrides);

    var pad = metrics.isMobile ? {
      x: 0,
      y: 0
    } : fp.mapValues(metrics.screenToCanvas, {
      x: 20,
      y: 10
    });

    var getWidth = function getWidth(group) {
      return group.fixedWidth ? metrics.screenToCanvas(group.fixedWidth) : groups[group.id].width;
    };

    var getRightSide = function getRightSide(group) {
      return groups[group.id].x + getWidth(group);
    };

    var getLeftSide = function getLeftSide(group) {
      return groups[group.id].x - getWidth(group) + groups[group.id].width;
    };

    var left = Math.max.apply(Math, _toConsumableArray(safe.left.map(getRightSide))) + pad.x;
    var top = safe.top ? groups[safe.top].y + groups[safe.top].height : metrics.borderPad - metrics.stageHeight / 2;
    var width = Math.min.apply(Math, _toConsumableArray(safe.right.map(getLeftSide))) - pad.x - left;
    var height = Math.min(groups[safe.bottom].y - pad.y, -top) - top;
    return new Phaser.Geom.Rectangle(left, top, width, height);
  };
};