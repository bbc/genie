/**
 * @module core/scaler
 * @copyright BBC 2018
 * @author BBC Children's D+E
 * @license Apache-2.0
 */
import { calculateMetrics } from "./layout/metrics.js";
import fp from "../../lib/lodash/fp/fp.js";
import { eventBus } from "./event-bus.js";

var getBounds = function getBounds(game) {
  return function () {
    return game.scale.parentSize;
  };
};

var _onSizeChangeEventCreate = function _onSizeChangeEventCreate(channel, name) {
  return {
    dispatch: function dispatch(data) {
      return eventBus.publish({
        channel: channel,
        name: name,
        data: data
      });
    },
    add: function add(callback) {
      return eventBus.subscribe({
        channel: channel,
        name: name,
        callback: callback
      });
    }
  };
};

var _onSizeChange = _onSizeChangeEventCreate("scaler", "sizeChange");

var px = function px(val) {
  return Math.floor(val) + "px";
};

export var onScaleChange = {
  add: _onSizeChange.add
};
export var getMetrics;
export function init(stageHeight, game) {
  getMetrics = fp.flow(getBounds(game), fp.pick(["width", "height"]), calculateMetrics(stageHeight));

  var setSize = function setSize(metrics) {
    var under4by3 = game.scale.parent.offsetWidth / game.scale.parent.offsetHeight < 4 / 3;
    var viewHeight = under4by3 ? game.scale.parent.offsetWidth * (3 / 4) : game.scale.parent.offsetHeight;
    game.canvas.style.height = px(viewHeight);
    var bounds = game.canvas.getBoundingClientRect();
    var marginLeft = (game.scale.parent.offsetWidth - bounds.width) / 2;
    var marginTop = (game.scale.parent.offsetHeight - bounds.height) / 2;
    game.canvas.style.marginLeft = px(marginLeft);
    game.canvas.style.marginTop = px(marginTop);
    game.scale.refresh();

    _onSizeChange.dispatch(metrics);
  };

  var resize = fp.flow(getMetrics, setSize);
  resize();
  window.onresize = fp.debounce(500, resize);
}