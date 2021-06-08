function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

/**
 * @copyright BBC 2020
 * @author BBC Children's D+E
 * @license Apache-2.0
 */
import { getLauncherScreen } from "../../debug/debug-screens.js";
import * as debugMode from "../../debug/debug-mode.js";
import { Loader } from "../loader.js";
import { Boot } from "../boot.js";
import { getBrowser } from "../../browser.js";
import { getBaseDefaults } from "./base-defaults.js";
import { getDefaultPlugins } from "./get-default-plugins.js";
import { getContainerDiv } from "../container.js";

var getScenes = function getScenes(conf) {
  return Object.keys(conf).map(function (key) {
    return new conf[key].scene(_objectSpread({
      key: key
    }, conf[key].settings));
  });
};

export var getPhaserDefaults = function getPhaserDefaults(config) {
  var _config$gameOptions;

  var browser = getBrowser();
  var scene = getScenes(Object.assign(config.screens, getLauncherScreen(debugMode.isDebug())));
  scene.unshift(new Loader());
  scene.unshift(new Boot(config.screens));
  var plugins = getDefaultPlugins(config.gameOptions);
  config === null || config === void 0 ? true : (_config$gameOptions = config.gameOptions) === null || _config$gameOptions === void 0 ? true : delete _config$gameOptions.plugins;
  return _objectSpread(_objectSpread(_objectSpread({}, getBaseDefaults()), {
    type: browser.forceCanvas ? Phaser.CANVAS : Phaser.AUTO,
    transparent: browser.isSilk,
    // Fixes silk browser flickering
    parent: getContainerDiv(),
    scene: scene,
    plugins: plugins
  }), config.gameOptions);
};