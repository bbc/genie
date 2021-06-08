function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

/**
 * @copyright BBC 2018
 * @author BBC Children's D+E
 * @license Apache-2.0
 */
import crel from "../../../lib/crel.es.js";
import fp from "../../../lib/lodash/fp/fp.js";

var keyUp = function keyUp(options) {
  return function (event) {
    var enterKey = event.key === "Enter";
    var spaceKey = event.key === " ";

    if (enterKey || spaceKey) {
      options.onClick();
    }
  };
};

var defaultAttributes = {
  tabindex: 0,
  role: "button"
};

var assignEvents = function assignEvents(el, options) {
  var keyup = keyUp(options);
  el.addEventListener("keyup", keyup);
  el.addEventListener("mouseover", options.onMouseOver);
  el.addEventListener("mouseleave", options.onMouseOut);
  el.addEventListener("focus", options.onMouseOver);
  el.addEventListener("blur", options.onMouseOut);
  el.addEventListener("touchmove", function (e) {
    return e.preventDefault();
  });

  if (options.interactive === false) {
    el.setAttribute("tabindex", "-1");
    defaultAttributes.role = "label";
  }

  return {
    keyup: keyup,
    click: options.onClick
  };
};

var style = {
  position: "absolute",
  cursor: "pointer",
  touchAction: "manipulation",
  "pointer-events": "none"
};

var visible = function visible(el) {
  return el.style.visibility !== "hidden";
};

var show = function show(el) {
  el.setAttribute("aria-hidden", false);
  el.setAttribute("tabindex", "0");
  el.style.display = "block";
  el.style.visibility = "visible";
};

var hide = function hide(el) {
  el.setAttribute("aria-hidden", true);
  el.setAttribute("tabindex", "-1");
  el.style.display = "none";
  el.style.visibility = "hidden";
};

export var accessibleDomElement = function accessibleDomElement(options) {
  var button = options.button;
  var el = crel("div", _objectSpread(_objectSpread({}, defaultAttributes), fp.pick(["id", "class", "aria-label", "aria-hidden"], options)), options.text || "");
  Object.assign(el.style, style);
  var events = assignEvents(el, options);

  var position = function position(pos) {
    el.style.left = pos.x.toString() + "px";
    el.style.top = pos.y.toString() + "px";
    el.style.width = pos.width.toString() + "px";
    el.style.height = pos.height.toString() + "px";
  };

  var update = function update() {
    if (el.getAttribute("aria-label") !== button.config.ariaLabel) {
      el.setAttribute("aria-label", button.config.ariaLabel);
    }

    if (!button.config.tabbable && (button.input && !button.input.enabled || !button.visible)) {
      visible(el) && hide(el);
    } else if (!visible(el)) {
      show(el);
    }
  };

  return {
    el: el,
    button: button,
    position: position,
    update: update,
    events: events
  };
};