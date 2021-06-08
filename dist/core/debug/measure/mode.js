/**
 * @copyright BBC 2020
 * @author BBC Children's D+E
 * @license Apache-2.0
 */
import { getMetrics } from "../../scaler.js";
var mode = 0;
var modes = [{
  type: "ABS",
  x: function x(rect) {
    return parseInt(rect.x + Math.min(700, window.innerWidth / 2 / getMetrics().scale));
  },
  y: function y(rect) {
    return rect.y + 300;
  },
  width: function width(rect) {
    return rect.width;
  },
  height: function height(rect) {
    return rect.height;
  }
}, {
  type: "CEN",
  x: function x(rect) {
    return rect.x;
  },
  y: function y(rect) {
    return rect.y;
  },
  width: function width(rect) {
    return rect.width;
  },
  height: function height(rect) {
    return rect.height;
  }
}, {
  type: "WIN",
  x: function x(rect) {
    return parseInt(getMetrics().scale * rect.x + Math.min(window.innerWidth / 2, getMetrics().scale * 700));
  },
  y: function y(rect) {
    return parseInt(getMetrics().scale * (rect.y + 300));
  },
  width: function width(rect) {
    return parseInt(getMetrics().scale * rect.width);
  },
  height: function height(rect) {
    return parseInt(getMetrics().scale * rect.height);
  }
}];
export var getMode = function getMode() {
  return modes[mode];
};
export var cycleMode = function cycleMode() {
  return mode = ++mode % modes.length;
};