function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

/**
 * @copyright BBC 2020
 * @author BBC Children's D+E
 * @license Apache-2.0
 */
var styleDefaults = {
  fontSize: "24px",
  fontFamily: "ReithSans",
  align: "center"
};

var makeElements = function makeElements(makerFns) {
  return function (conf) {
    return makerFns[conf.type]({
      x: conf.xOffset,
      y: conf.yOffset
    }, conf).setOrigin(0.5);
  };
};

export var createTitles = function createTitles(scene) {
  var image = function image(pos, conf) {
    return scene.add.image(pos.x, pos.y, "".concat(scene.assetPrefix, ".").concat(conf.key));
  };

  var text = function text(pos, conf) {
    var textStyle = _objectSpread(_objectSpread({}, styleDefaults), conf.styles);

    var textSprite = scene.add.text(pos.x, pos.y, conf.value, textStyle);
    textSprite.defaultStyle = textStyle;
    return textSprite;
  };

  var configs = scene.context.theme.titles || [];
  return configs.map(makeElements({
    image: image,
    text: text
  }));
};