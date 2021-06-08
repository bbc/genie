/**
 * @copyright BBC 2020
 * @author BBC Children's D+E
 * @license Apache-2.0
 */
import { getMode } from "./mode.js";
var style = {
  color: "#FFF",
  backgroundColor: "#000",
  fontSize: "10px",
  fontFamily: "Arial",
  strokeThickness: 1,
  resolution: 2,
  padding: {
    left: 4,
    right: 4,
    top: 1,
    bottom: 4
  }
};

var updateCoordsFn = function updateCoordsFn(coords, handle) {
  return function (rect) {
    var mode = getMode();
    var x = mode.x(rect);
    var y = mode.y(rect);
    var width = mode.width(rect);
    var height = mode.height(rect);
    coords.text = "X: ".concat(x, "\nY: ").concat(y, "\nW ").concat(width, "\nH: ").concat(height, "\n").concat(mode.type);
    coords.x = rect.x;
    coords.y = rect.y;
    handle.x = rect.x - 5 + rect.width;
    handle.y = rect.y - 5 + rect.height;
  };
};

export var createElements = function createElements(scene) {
  var rect = scene.add.rectangle(0, 0, 100, 100, 0x000000, 0x000000).setStrokeStyle(1, 0x000000).setInteractive({
    draggable: true,
    useHandCursor: true
  }).setOrigin(0, 0);
  var handle = scene.add.rectangle(45, 45, 10, 10, 0x000000).setInteractive({
    draggable: true,
    useHandCursor: true
  });
  var coords = scene.add.text(0, 0, " ", style);
  var legend = scene.add.text(0, 100, "CURSOR KEYS: MOVE\n+X: SIZE\n+Z: SLOWER\nC: MODE", style).setOrigin(0.5, 0);
  var updateCoords = updateCoordsFn(coords, handle);

  var toggleUi = function toggleUi() {
    var visible = !rect.visible;
    [rect, coords, legend, handle].forEach(function (o) {
      return o.visible = visible;
    });
    return visible;
  };

  toggleUi();
  return {
    rect: rect,
    coords: coords,
    legend: legend,
    handle: handle,
    updateCoords: updateCoords,
    toggleUi: toggleUi
  };
};