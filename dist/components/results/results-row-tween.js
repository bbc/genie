function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

/**
 * @copyright BBC 2020
 * @author BBC Children's D+E
 * @license Apache-2.0
 */
import { gmi } from "../../core/gmi/gmi.js";

var tween = function tween(scene, targets, containers) {
  containers.forEach(function (container, index) {
    var config = container.rowConfig;

    if (config.transition) {
      if (!gmi.getAllSettings().motion) {
        config.transition.duration = 0;
      }

      scene.add.tween(_objectSpread({
        targets: targets[index]
      }, config.transition));
    }
  });
};

export var tweenRows = function tweenRows(scene, containers) {
  return tween(scene, containers, containers);
};
export var tweenRowBackdrops = function tweenRowBackdrops(scene, targets, containers) {
  return tween(scene, targets, containers);
};