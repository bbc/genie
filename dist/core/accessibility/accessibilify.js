function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

/**
 * @module accessibility/accessibilify
 * @copyright BBC 2018
 * @author BBC Children's D+E
 * @license Apache-2.0
 */
import fp from "../../../lib/lodash/fp/fp.js";
import { onScaleChange, getMetrics } from "../scaler.js";
import { accessibleDomElement } from "./accessible-dom-element.js";
import * as a11y from "./accessibility-layer.js";
import { CAMERA_X, CAMERA_Y } from "../layout/metrics.js";

var getHitAreaBounds = function getHitAreaBounds(button) {
  var sys = button.scene.sys;
  var marginLeft = parseInt(sys.game.canvas.style.marginLeft, 10);
  var marginTop = parseInt(sys.game.canvas.style.marginTop, 10);
  var bounds = button.getHitAreaBounds ? button.getHitAreaBounds() : button.getBounds();
  var metrics = getMetrics();
  return {
    x: (bounds.x + CAMERA_X) * metrics.scale + marginLeft,
    y: (bounds.y + CAMERA_Y) * metrics.scale + marginTop,
    width: bounds.width * metrics.scale,
    height: bounds.height * metrics.scale
  };
};

var assignEvents = function assignEvents(accessibleElement, button) {
  var setElementSizeAndPosition = function setElementSizeAndPosition() {
    if (!button.active) return;
    accessibleElement.position(getHitAreaBounds(button));
  };

  var resizeAndRepositionElement = fp.debounce(200, setElementSizeAndPosition);
  var event = onScaleChange.add(resizeAndRepositionElement);
  var _destroy = button.destroy;

  button.destroy = function () {
    event.unsubscribe();
    return _destroy.apply(button);
  };

  resizeAndRepositionElement();
};

var defaults = {
  class: "gel-button",
  onClick: function onClick() {},
  onMouseOver: function onMouseOver() {},
  onMouseOut: function onMouseOut() {},
  interactive: false
};
export function accessibilify(button) {
  var gameButton = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;
  var interactive = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : true;
  var sys = button.scene.sys;
  var scene = button.scene;
  var id = [scene.scene.key, button.config.id].join("__");
  var options = {
    id: id,
    button: button,
    "aria-label": button.config.ariaLabel
  };

  if (interactive === true) {
    var buttonAction = function buttonAction() {
      if (!button.input.enabled) return;
      button.emit(Phaser.Input.Events.POINTER_UP, button, sys.input.activePointer, false);
    };

    var onMouseOver = function onMouseOver() {
      return button.emit(Phaser.Input.Events.POINTER_OVER, button, sys.input.activePointer, false);
    };

    var onMouseOut = function onMouseOut() {
      return button.emit(Phaser.Input.Events.POINTER_OUT, button, sys.input.activePointer, false);
    };

    options = _objectSpread(_objectSpread({}, options), {
      parent: sys.scale.parent,
      onClick: buttonAction,
      onMouseOver: onMouseOver,
      onMouseOut: onMouseOut,
      interactive: true
    });
  }

  options = _objectSpread(_objectSpread({}, defaults), options);
  var accessibleElement = accessibleDomElement(options);

  if (gameButton) {
    sys.accessibleButtons.push(button);
  }

  assignEvents(accessibleElement, button);
  button.accessibleElement = accessibleElement;
  a11y.addButton(button);
  a11y.reset();
  return button;
}