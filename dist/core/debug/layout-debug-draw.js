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
import { BORDER_PAD_RATIO, GEL_MAX_ASPECT_RATIO, GEL_MIN_ASPECT_RATIO, CANVAS_HEIGHT } from "../layout/metrics.js";
import { getMetrics, onScaleChange } from "../scaler.js";
import { eventBus } from "../event-bus.js";

var getPaddingWidth = function getPaddingWidth(canvas) {
  return Math.max(canvas.width, canvas.height) * BORDER_PAD_RATIO;
};

var createOuterPadding = function createOuterPadding(parent) {
  var borders = [parent.scene.add.tileSprite(0, 0, 0, 0, "gelDebug.FF0030-hatch"), parent.scene.add.tileSprite(0, 0, 0, 0, "gelDebug.FF0030-hatch"), parent.scene.add.tileSprite(0, 0, 0, 0, "gelDebug.FF0030-hatch"), parent.scene.add.tileSprite(0, 0, 0, 0, "gelDebug.FF0030-hatch")];
  borders.map(function (border) {
    return parent.add(border);
  });
  return borders;
};

var create43Area = function create43Area(parent) {
  var area = parent.scene.add.tileSprite(0, 0, 0, 0, "gelDebug.FFCC00-hatch");
  parent.add(area);
  return [area];
};

var aspect43 = 4 / 3;
export var create = function create(parent) {
  var safeAreaDebugElements = [].concat(_toConsumableArray(create43Area(parent)), _toConsumableArray(createOuterPadding(parent)));

  var resize = function resize() {
    var metrics = getMetrics();
    var container = parent.scene.game.scale.parent;
    var viewAspectRatio = container.offsetWidth / container.offsetHeight;
    var aspectRatio = Math.min(GEL_MAX_ASPECT_RATIO, viewAspectRatio);
    var size = aspectRatio <= aspect43 ? {
      width: CANVAS_HEIGHT * aspect43,
      height: CANVAS_HEIGHT
    } : {
      width: aspectRatio * CANVAS_HEIGHT,
      height: CANVAS_HEIGHT
    };
    var pad = getPaddingWidth(size);
    var areaWidth = GEL_MIN_ASPECT_RATIO * parent.scene.game.canvas.height;
    var areaHeight = parent.scene.game.canvas.height;
    safeAreaDebugElements[0].setSize(areaWidth, areaHeight);
    safeAreaDebugElements[1].setPosition(0, (pad - size.height) / 2);
    safeAreaDebugElements[1].setSize(size.width, pad);
    safeAreaDebugElements[2].setPosition(0, (size.height - pad) / 2);
    safeAreaDebugElements[2].setSize(size.width, pad);
    safeAreaDebugElements[3].setPosition((pad - size.width) / 2, 0);
    safeAreaDebugElements[3].setSize(pad, size.height);
    safeAreaDebugElements[4].setPosition((size.width - pad) / 2, 0);
    safeAreaDebugElements[4].setSize(pad, size.height);
    safeAreaDebugElements.map(function (el) {
      return el.setTileScale(1 / metrics.scale);
    });
  };

  onScaleChange.add(resize);
  resize();

  var shutdown = function shutdown() {
    return eventBus.removeSubscription({
      channel: "scaler",
      name: "sizeChange",
      callback: resize
    });
  };

  return {
    shutdown: shutdown
  };
};