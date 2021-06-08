/**
 * @copyright BBC 2020
 * @author BBC Children's D+E
 * @license Apache-2.0
 */
import { createMeasureUi } from "./ui.js";
import fp from "../../../../lib/lodash/fp/fp.js";
export var createMeasure = function createMeasure(parent) {
  var _createMeasureUi = createMeasureUi(parent),
      update = _createMeasureUi.update,
      toggleUi = _createMeasureUi.toggleUi;

  var scene = parent.scene;

  var shutdown = function shutdown() {
    return scene.events.off("update", update, scene);
  };

  var addEvents = function addEvents() {
    scene.events.on("update", update, scene);
    scene.events.once("shutdown", shutdown, scene);
  };

  var toggleEvents = function toggleEvents(visible) {
    return visible ? addEvents() : shutdown();
  };

  return fp.flow(toggleUi, toggleEvents);
};