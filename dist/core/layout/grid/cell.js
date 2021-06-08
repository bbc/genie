function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

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
import fp from "../../../../lib/lodash/fp/fp.js";
import { accessibilify } from "../../accessibility/accessibilify.js";
import { gmi } from "../../gmi/gmi.js";
import * as state from "../../state.js";
var alignmentFactor = {
  left: 0,
  center: 1,
  right: 2
};
var defaults = {
  gameButton: true,
  group: "grid",
  order: 0
};

var transitionOnTab = function transitionOnTab(grid, button) {
  return function () {
    if (grid.getCurrentPageKey() === button.config.id) return;
    var nextIdx = grid.cellIds().indexOf(button.config.id);
    grid.showPage(nextIdx);
  };
};

export var setSize = function setSize(grid, button) {
  var size = _toConsumableArray(grid._cellSize);

  var spriteAspect = button.sprite.width / button.sprite.height;
  var cellAspect = size[0] / size[1];
  var axisScale = spriteAspect < cellAspect ? 0 : 1;
  var aspectRatioRatio = spriteAspect / cellAspect;
  size[axisScale] *= axisScale === 0 ? aspectRatioRatio : 1 / aspectRatioRatio;
  button.setDisplaySize.apply(button, _toConsumableArray(size)); // TODO This calculation should be retained for possible inclusion of hit area adjustment,
  // currently being skipped due to unexplained behaviour with the scaling calculations.
  //
  // const hitSize = this.calculateCellSize(1 / this._cells[cellIndex].scaleX, 1 / this._cells[cellIndex].scaleY);
  // this._cells[cellIndex].input.hitArea = new Phaser.Geom.Rectangle(0, 0, hitSize[0], hitSize[1]);
};

var getBlankCellCount = function getBlankCellCount(grid, row, page) {
  return Math.max(grid._config.columns * (row + 1) - grid.getPageCells(page).length, 0);
};

var setPosition = function setPosition(grid, button, idx) {
  var pageIdx = idx % grid.cellsPerPage;
  var page = Math.floor(idx / grid.cellsPerPage);
  var col = pageIdx % grid._config.columns;
  var row = Math.floor(pageIdx / grid._config.columns);
  var positionFactorX = col - (grid._config.columns - 1) / 2;
  var positionFactorY = row - (grid._config.rows - 1) / 2;

  var alignmentX = (button.displayWidth + grid._cellPadding) * 0.5 * getBlankCellCount(grid, row, page) * alignmentFactor[grid._config.align];

  button.x = positionFactorX * button.displayWidth + positionFactorX * grid._cellPadding + alignmentX;
  button.y = button.displayHeight * positionFactorY + grid._cellPadding * positionFactorY;
};

var getStates = function getStates(theme) {
  var stateConfig = theme.choices.map(function (_ref) {
    var id = _ref.id,
        state = _ref.state;
    return {
      id: id,
      state: state
    };
  });
  return state.create(theme.storageKey, stateConfig);
};

var getStylingForState = function getStylingForState(btn, states, styling) {
  return styling[fp.get("state", states.get(btn.key))] || {};
};

var getStyles = function getStyles(btn, theme) {
  var states = getStates(theme);
  var defaultStyles = theme.choicesStyling.default;
  var stylesOverride = getStylingForState(btn, states, theme.choicesStyling);
  return fp.merge(defaultStyles, stylesOverride);
};

var addTextToScene = function addTextToScene(scene, styles, text, btn, key) {
  var textOnScene = scene.add.text(styles.position.x, styles.position.y, text, styles.style);
  textOnScene.setOrigin(0.5, 0.5);
  btn.overlays.set(key, textOnScene);
};

var addTextToButton = function addTextToButton(scene, config, btn, theme) {
  var styles = getStyles(btn, theme);
  addTextToScene(scene, styles.title, config.title, btn, "titleText");

  if (config.subtitle && styles.subtitle) {
    addTextToScene(scene, styles.subtitle, config.subtitle, btn, "subtitleText");
  }
};

export var createCell = function createCell(grid, choice, idx, theme) {
  var config = _objectSpread(_objectSpread({}, choice), {}, {
    scene: grid.scene.assetPrefix,
    channel: grid.eventChannel,
    tabbable: false
  });

  var button = grid.scene.add.gelButton(0, 0, _objectSpread(_objectSpread({}, defaults), config));
  grid.cellsPerPage === 1 && button.on(Phaser.Input.Events.POINTER_OVER, transitionOnTab(grid, button));
  grid.cellsPerPage > 1 && (button.visible = Boolean(!idx));
  button.key = config.key;

  if (fp.get("choicesStyling.default", theme)) {
    addTextToButton(grid.scene, config, button, theme);
  }

  grid.add(button);

  var makeAccessible = function makeAccessible() {
    accessibilify(button, true);
  };

  var reset = function reset() {
    setSize(grid, button);
    setPosition(grid, button, idx);
    button.visible = false;
    button.accessibleElement.update();
  };

  var addTweens = function addTweens(config) {
    var edge = config.goForwards ? grid._safeArea.width : -grid._safeArea.width;
    var x = {
      from: config.tweenIn ? button.x + edge : button.x,
      to: config.tweenIn ? button.x : button.x - edge
    };
    var alpha = {
      from: config.tweenIn ? 0 : 1,
      to: config.tweenIn ? 1 : 0
    };
    var duration = !gmi.getAllSettings().motion ? 0 : config.duration;
    grid.scene.add.tween({
      targets: button,
      ease: config.ease,
      x: x,
      alpha: alpha,
      duration: duration
    });
  };

  return {
    button: button,
    reset: reset,
    addTweens: addTweens,
    makeAccessible: makeAccessible
  };
};