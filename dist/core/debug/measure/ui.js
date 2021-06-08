/**
 * @copyright BBC 2020
 * @author BBC Children's D+E
 * @license Apache-2.0
 */
import { rectUpdateFn } from "./update-rect.js";
import { createElements } from "./elements.js";
import { cycleMode } from "./mode.js";
import { getInputFn } from "./get-input-fn.js";
import fp from "../../../../lib/lodash/fp/fp.js";
export var createMeasureUi = function createMeasureUi(parent) {
  var _createElements = createElements(parent.scene),
      rect = _createElements.rect,
      coords = _createElements.coords,
      legend = _createElements.legend,
      handle = _createElements.handle,
      updateCoords = _createElements.updateCoords,
      toggleUi = _createElements.toggleUi;

  var dragUpdate = function dragUpdate(pointer, dragX, dragY) {
    rect.x = parseInt(dragX);
    rect.y = parseInt(dragY);
    updateCoords(rect);
  };

  rect.on("drag", dragUpdate);

  var sizeDrag = function sizeDrag(pointer, dragX, dragY) {
    updateRect({
      x: 0,
      y: 0,
      width: parseInt(5 + dragX - rect.x - rect.width),
      height: parseInt(5 + dragY - rect.y - rect.height)
    });
    updateCoords(rect);
  };

  handle.on("drag", sizeDrag);
  var keys = parent.scene.input.keyboard.addKeys("z,x,c,up,down,left,right");
  keys.c.on("up", cycleMode);
  var updateRect = rectUpdateFn(rect, updateCoords);
  updateRect({
    x: 0,
    y: 0,
    width: 0,
    height: 0
  });
  [rect, coords, legend, handle].forEach(parent.add, parent);
  var update = fp.flow(getInputFn(keys), updateRect);
  return {
    update: update,
    toggleUi: toggleUi
  };
};