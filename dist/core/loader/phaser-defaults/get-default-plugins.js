function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _iterableToArray(iter) { if (typeof Symbol !== "undefined" && Symbol.iterator in Object(iter)) return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) return _arrayLikeToArray(arr); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

/**
 * @copyright BBC 2020
 * @author BBC Children's D+E
 * @license Apache-2.0
 */
import FontLoaderPlugin from "../font-loader/font-plugin.js";
import { JSON5Plugin } from "../json5-loader/json5-plugin.js";
import { ParticlesPlugin } from "../particles-loader/particles-plugin.js";
export var getDefaultPlugins = function getDefaultPlugins(options) {
  var _options$plugins$glob, _options$plugins, _options$plugins$scen, _options$plugins2;

  var defaultPlugins = {
    global: [{
      key: "FontLoader",
      plugin: FontLoaderPlugin,
      start: true
    }, {
      key: "JSON5Loader",
      plugin: JSON5Plugin,
      start: true
    }, {
      key: "ParticlesLoader",
      plugin: ParticlesPlugin,
      start: true
    }],
    scene: [{
      key: "SpinePlugin",
      plugin: window.SpinePlugin,
      mapping: "spine"
    }]
  };
  return {
    global: [].concat(_toConsumableArray(defaultPlugins.global), _toConsumableArray((_options$plugins$glob = options === null || options === void 0 ? void 0 : (_options$plugins = options.plugins) === null || _options$plugins === void 0 ? void 0 : _options$plugins.global) !== null && _options$plugins$glob !== void 0 ? _options$plugins$glob : [])),
    scene: [].concat(_toConsumableArray(defaultPlugins.scene), _toConsumableArray((_options$plugins$scen = options === null || options === void 0 ? void 0 : (_options$plugins2 = options.plugins) === null || _options$plugins2 === void 0 ? void 0 : _options$plugins2.scene) !== null && _options$plugins$scen !== void 0 ? _options$plugins$scen : []))
  };
};