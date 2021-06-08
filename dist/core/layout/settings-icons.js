/**
 * @copyright BBC 2018
 * @author BBC Children's D+E
 * @license Apache-2.0
 */
import { settingsChannel } from "../settings.js";
import { gmi } from "../gmi/gmi.js";
import fp from "../../../lib/lodash/fp/fp.js";
import { eventBus } from "../event-bus.js";
var fxConfig = {
  title: "FX Off",
  key: "fx-off-icon",
  id: "fx-off",
  eventName: "motion",
  icon: true
};
var audioConfig = {
  title: "Audio Off",
  key: "audio-off-icon",
  id: "audio-off",
  eventName: "audio",
  icon: true
};

var createEvents = function createEvents(group, config) {
  var icon;

  var callback = function callback(bool) {
    if (!bool && !icon) {
      var position = config.eventName === "audio" ? group.length - 1 : 0;
      icon = group.addButton(config, position);
    } else if (bool && icon) {
      group.removeButton(icon);
      icon = undefined;
    }

    group.reset();
  };

  return eventBus.subscribe({
    channel: settingsChannel,
    name: config.eventName,
    callback: callback
  });
};

var publish = fp.curry(function (settings, key) {
  eventBus.publish({
    channel: settingsChannel,
    name: key,
    data: settings[key]
  });
});
/**
 * Subscribes two callbacks to the settings events which show / hide the fx and audio icons
 *
 * @param {String} group - group name e.g: "top-right"
 * @param {Array.<string>} buttonIds - Array of gel button identifiers
 * @returns {{unsubscribe: Function}}
 */

export var create = function create(group, buttonIds) {
  var iconEvents = [createEvents(group, fxConfig)];

  if (!buttonIds.includes("audio")) {
    iconEvents.push(createEvents(group, audioConfig));
  }

  var settings = gmi.getAllSettings();
  ["motion", "audio"].forEach(publish(settings));
  return {
    unsubscribe: function unsubscribe() {
      iconEvents.forEach(function (iconsEvent) {
        return iconsEvent.unsubscribe();
      });
    }
  };
};