/**
 * @copyright BBC 2018
 * @author BBC Children's D+E
 * @license Apache-2.0
 */
import { eventBus } from "../core/event-bus.js";
import { gmi } from "./gmi/gmi.js";
export var settingsChannel = "genie-settings";
export var create = function create() {
  var onSettingChanged = function onSettingChanged(key, value) {
    eventBus.publish({
      channel: settingsChannel,
      name: key,
      data: value
    });
  };

  var onSettingsClosed = function onSettingsClosed() {
    eventBus.publish({
      channel: settingsChannel,
      name: "settings-closed"
    });
  };

  return {
    show: function show() {
      return gmi.showSettings(onSettingChanged, onSettingsClosed);
    },
    getAllSettings: function getAllSettings() {
      return gmi.getAllSettings();
    }
  };
}; // Singleton used by games

export var settings = create();