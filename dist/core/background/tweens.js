function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

/**
 * @copyright BBC 2020
 * @author BBC Children's D+E
 * @license Apache-2.0
 */
import { getNamed } from "./get-named.js";

var getTargetByName = function getTargetByName(scene) {
  return function (name) {
    return scene.children.list.reduce(getNamed(name), false);
  };
};

export var createTween = function createTween(scene) {
  return function (name) {
    var config = _objectSpread({}, scene.config.background.tweens.find(function (a) {
      return a.name === name;
    }));

    delete config.name; //if name is present tween will mangle it on the gameObject

    config.targets = config.targets.map(getTargetByName(scene));
    return scene.tweens.add(config);
  };
};
export var isTween = function isTween(scene) {
  return function (name) {
    return Boolean(scene.config.background.tweens.find(function (a) {
      return a.name === name;
    }));
  };
};