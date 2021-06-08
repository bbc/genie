/**
 * @copyright BBC 2018
 * @author BBC Children's D+E
 * @license Apache-2.0
 */
import fp from "../../../lib/lodash/fp/fp.js";
var MOBILE_BREAK_WIDTH = 770;
export var BORDER_PAD_RATIO = 0.02;
export var GEL_MIN_ASPECT_RATIO = 4 / 3;
export var GEL_MAX_ASPECT_RATIO = 7 / 3;
export var CANVAS_WIDTH = 1400;
export var CANVAS_HEIGHT = 600;
export var CAMERA_X = CANVAS_WIDTH / 2;
export var CAMERA_Y = CANVAS_HEIGHT / 2;
var getScale = fp.curry(function (stageHeight, width, height) {
  return fp.cond([[function () {
    return width / height >= GEL_MIN_ASPECT_RATIO;
  }, function () {
    return height / stageHeight;
  }], [function () {
    return width / height < GEL_MIN_ASPECT_RATIO;
  }, function () {
    return width / (stageHeight * GEL_MIN_ASPECT_RATIO);
  }]])();
});
export var calculateMetrics = fp.curry(function (stageHeight, _ref) {
  var width = _ref.width,
      height = _ref.height;
  var scale = getScale(stageHeight, width, height);
  var aspectRatio = fp.clamp(GEL_MIN_ASPECT_RATIO, GEL_MAX_ASPECT_RATIO, width / height);
  var stageWidth = aspectRatio * stageHeight;
  var isMobile = width < MOBILE_BREAK_WIDTH;
  var safeWidth = stageHeight * GEL_MIN_ASPECT_RATIO;

  var screenToCanvas = function screenToCanvas(x) {
    return x / scale;
  };

  return {
    width: width,
    height: height,
    scale: scale,
    screenToCanvas: screenToCanvas,
    stageWidth: stageWidth,
    stageHeight: stageHeight,
    borderPad: fp.floor(fp.max([stageWidth, stageHeight]) * BORDER_PAD_RATIO),
    isMobile: isMobile,
    buttonPad: isMobile ? 22 : 24,
    buttonMin: isMobile ? 42 : 64,
    hitMin: isMobile ? 64 : 70,
    horizontals: {
      left: -stageWidth / 2,
      center: 0,
      right: stageWidth / 2
    },
    safeHorizontals: {
      left: -safeWidth / 2,
      center: 0,
      right: safeWidth / 2
    },
    verticals: {
      top: -stageHeight / 2,
      middle: 0,
      bottom: stageHeight / 2
    }
  };
});