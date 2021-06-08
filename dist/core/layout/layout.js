/**
 * A container for gel buttons with built in resizing and button break points
 *
 * @module layout/layout
 * @copyright BBC 2018
 * @author BBC Children's D+E
 * @license Apache-2.0
 */
import { onScaleChange } from "../scaler.js";
import fp from "../../../lib/lodash/fp/fp.js";
import * as settingsIcons from "./settings-icons.js";
import * as gel from "./gel-defaults.js";
import { groupLayouts } from "./group-layouts.js";
import { GelGroup } from "./gel-group.js";
import { gmi } from "../gmi/gmi.js";
import { getSafeAreaFn } from "./safe-area.js";
var getOrder = fp.curry(function (object, name) {
  return object[name].order;
});
var tabSort = fp.sortBy(getOrder(gel.config()));
var checkGMIFlags = fp.cond([[function (name) {
  return name === "audio";
}, function () {
  return gmi.shouldDisplayMuteButton;
}], [function (name) {
  return name === "exit";
}, function () {
  return gmi.shouldShowExitButton;
}], [fp.stubTrue, fp.stubTrue]]);
var copyFirstChildren = fp.mapValues(function (key) {
  return Object.assign({}, key);
});

var assignProperties = function assignProperties(object, overrides) {
  fp.mapKeys(function (key) {
    return Object.assign(object[key], overrides[key]);
  }, overrides);
  return object;
}; // Copy gel config with only objects / functions as a reference.


var shallowMergeOverrides = function shallowMergeOverrides(config, overrides) {
  return assignProperties(copyFirstChildren(config), overrides);
};
/**
 * Creates a new layout. Called by screen.addLayout for each screen component
 *
 * @param {Phaser.Scene} scene - Phaser Scene Instance
 * @param {Object} metrics - viewport metrics
 * @param {Array.<string>} buttonIds
 * @param {Array.<string>} accessible buttonIds
 */


export function create(scene, metrics, buttonIds, accessibleButtonIds) {
  var _this = this;

  buttonIds = buttonIds.filter(checkGMIFlags);
  accessibleButtonIds = accessibleButtonIds ? accessibleButtonIds.filter(function (id) {
    return buttonIds.includes(id);
  }) : buttonIds;
  var overrides = scene.context.config.theme[scene.scene.key]["button-overrides"];
  var config = shallowMergeOverrides(gel.config(scene), overrides);
  var root = new Phaser.GameObjects.Container(scene, 0, 0);

  var addCustomGroup = function addCustomGroup(key, group) {
    var pos = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 0;
    root.addAt(group, pos);
    groups[key] = group;
    return group;
  };

  var addToGroup = function addToGroup(groupName, item, position) {
    return groups[groupName].addToGroup(item, position);
  };

  var groups = fp.zipObject(groupLayouts.map(function (layout) {
    return fp.camelCase([layout.vPos, layout.hPos, layout.safe ? "safe" : "", layout.arrangeV ? "v" : ""].join(" "));
  }), groupLayouts.map(function (layout) {
    var group = new GelGroup(scene, root, layout.vPos, layout.hPos, metrics, layout.safe, layout.arrangeV);
    root.add(group);
    return group;
  }));
  var buttons = fp.zipObject(tabSort(buttonIds), tabSort(buttonIds).map(function (name) {
    var buttonConfig = config[name];
    buttonConfig.accessibilityEnabled = accessibleButtonIds.includes(name);
    return groups[buttonConfig.group].addButton(buttonConfig);
  }));
  var iconEvents = settingsIcons.create(groups.topRight, buttonIds);
  /**
   * Attach a callback to the onInputUp event of a given Gel button
   *
   * @param button - gel button identifier
   * @param callback - callback function to attach
   */

  var setAction = function setAction(button, callback) {
    return buttons[button].onInputUp.add(callback, _this);
  };

  var makeAccessible = function makeAccessible() {
    return fp.forOwn(function (group) {
      return group.makeAccessible();
    }, groups);
  };

  var resize = function resize(metrics) {
    return fp.forOwn(function (group) {
      return group.reset(metrics);
    }, groups);
  };

  resize(metrics);
  var event = onScaleChange.add(resize);

  var removeEvents = function removeEvents() {
    event.unsubscribe();
    iconEvents.unsubscribe();
  };

  var destroy = function destroy() {
    removeEvents();
    root.destroy();
  };

  var groupHasChildren = function groupHasChildren(group) {
    return Boolean(group.list.length);
  };

  var drawGroups = function drawGroups(graphics) {
    graphics.lineStyle(2, 0x33ff33, 1);
    fp.mapValues(function (group) {
      graphics.strokeRectShape(group.getBoundingRect());
    }, groups);
  };

  var drawButtons = function drawButtons(graphics) {
    graphics.lineStyle(1, 0x3333ff, 1);
    fp.mapValues(function (group) {
      group.list.filter(function (gameObject) {
        return Boolean(gameObject.getHitAreaBounds);
      }).map(function (button) {
        return graphics.strokeRectShape(button.getHitAreaBounds());
      });
    }, fp.pickBy(groupHasChildren, groups));
  };

  var debug = {
    groups: drawGroups,
    buttons: drawButtons
  };
  return {
    addCustomGroup: addCustomGroup,
    addToGroup: addToGroup,
    buttons: buttons,
    debug: debug,
    getSafeArea: getSafeAreaFn(groups),
    destroy: destroy,
    makeAccessible: makeAccessible,
    resize: resize,
    root: root,
    removeEvents: removeEvents,
    setAction: setAction
  };
}