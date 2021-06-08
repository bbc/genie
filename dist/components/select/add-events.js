/**
 * @copyright BBC 2020
 * @author BBC Children's D+E
 * @license Apache-2.0
 */
import { eventBus } from "../../core/event-bus.js";
import { buttonsChannel } from "../../core/layout/gel-defaults.js";
export var addEvents = function addEvents(scene) {
  var grid = scene.grid;
  grid.choices().map(function (choice) {
    eventBus.subscribe({
      channel: buttonsChannel(scene),
      name: choice.id,
      callback: scene.next(function () {
        return choice;
      })
    });
  });
  eventBus.subscribe({
    channel: buttonsChannel(scene),
    name: "continue",
    callback: scene.next(scene.grid.getCurrentSelection)
  });
  eventBus.subscribe({
    channel: buttonsChannel(scene),
    name: "next",
    callback: function callback() {
      return grid.showPage(grid.page + 1);
    }
  });
  eventBus.subscribe({
    channel: buttonsChannel(scene),
    name: "previous",
    callback: function callback() {
      return grid.showPage(grid.page - 1);
    }
  });
};