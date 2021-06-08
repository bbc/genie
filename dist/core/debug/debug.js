function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _iterableToArray(iter) { if (typeof Symbol !== "undefined" && Symbol.iterator in Object(iter)) return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) return _arrayLikeToArray(arr); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

/**
 * @copyright BBC 2018
 * @author BBC Children's D+E
 * @license Apache-2.0
 */
import fp from "../../../lib/lodash/fp/fp.js";
import * as debugLayout from "./layout-debug-draw.js";

var makeToggle = function makeToggle(val, fn, scene) {
  return function () {
    return scene.debug.draw[val] = scene.debug.draw[val] === fp.identity ? fn : fp.identity;
  };
};

export function update() {
  if (!this.debug) return;
  this.debug.graphics.clear();
  this.debug.draw.groups(this.debug.graphics);
  this.debug.draw.buttons(this.debug.graphics);
}

var toggleCSS = function toggleCSS() {
  return document.body.classList.toggle("debug");
};

var debugStyle = {
  fontFamily: '"Droid Sans Mono Dotted"',
  fontSize: 12,
  resolution: 2,
  backgroundColor: "rgba(0,0,0,0.5)",
  padding: {
    left: 6,
    right: 6,
    top: 4,
    bottom: 4
  }
};

var getConfigDefs = function getConfigDefs(cache, key, path) {
  return fp.map(function (def) {
    return _objectSpread(_objectSpread({}, def), {}, {
      path: path
    });
  }, fp.get("config.files", cache.get(key)));
};

function create() {
  var _this = this;

  this.debug = {
    graphics: this.add.graphics(),
    container: this.add.container(),
    draw: {
      groups: fp.identity,
      buttons: fp.identity
    }
  };
  this.debug.draw.layout = debugLayout.create(this.debug.container);
  this.debug.container.visible = false;
  var configDefs = [].concat(_toConsumableArray(getConfigDefs(this.cache.json, "example-files", "debug/examples/")), _toConsumableArray(getConfigDefs(this.cache.json, "config/files", "THEME/")));
  var fileDef = configDefs.find(function (def) {
    return def.key === _this.scene.key;
  });
  var fileLabel = fileDef ? {
    x: -400,
    y: -300,
    text: "config: ".concat(fileDef.path).concat(fileDef.url)
  } : [];
  var labels = this.context.theme.debugLabels || [];
  fp.map(function (label) {
    return _this.add.text(label.x || 0, label.y || 0, label.text, debugStyle);
  }, labels.concat(fileLabel));
  this.input.keyboard.addKey("q").on("up", function () {
    return _this.debug.container.visible = !_this.debug.container.visible;
  });
  this.layout && this.input.keyboard.addKey("w").on("up", makeToggle("groups", this.layout.debug.groups, this));
  this.layout && this.input.keyboard.addKey("e").on("up", makeToggle("buttons", this.layout.debug.buttons, this));
  this.input.keyboard.addKey("r").on("up", toggleCSS);
  this.navigation.debug && this.input.keyboard.addKey("t").on("up", this.navigation.debug.bind(this));
}

var shutdown = function shutdown(scene) {
  scene.input.keyboard.removeKey("q");
  scene.input.keyboard.removeKey("w");
  scene.input.keyboard.removeKey("e");
  scene.input.keyboard.removeKey("r");
  scene.input.keyboard.removeKey("t");
  scene.debug.draw.layout.shutdown();
};

export var addEvents = function addEvents(scene) {
  scene.events.on("create", create, scene);
  scene.events.on("update", update, scene);
  scene.events.once("shutdown", function () {
    scene.events.off("create", create, scene);
    scene.events.off("update", update, scene);
    shutdown(scene);
  });
};