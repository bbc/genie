function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

/**
 * @copyright BBC 2020
 * @author BBC Children's D+E
 * @license Apache-2.0
 */
import { gmi } from "../gmi/gmi.js";
var spriteDefaults = {
  x: 0,
  y: 0,
  scale: 1,
  frames: {
    default: 0,
    repeat: -1,
    rate: 10
  }
};
export var isSprite = function isSprite(scene) {
  return function (config) {
    return scene.textures.exists(config.key) && Boolean(config.frames);
  };
};
export var addSprite = function addSprite(scene) {
  return function (animConfig) {
    var config = _objectSpread(_objectSpread(_objectSpread({}, spriteDefaults), animConfig), {
      frames: _objectSpread(_objectSpread({}, spriteDefaults.frames), animConfig.frames)
    });

    var sprite = scene.add.sprite(config.x, config.y, config.key, config.frames.default);
    config.props && Object.assign(sprite, config.props);
    scene.anims.create({
      key: config.frames.key,
      frames: scene.anims.generateFrameNumbers(config.key, {
        start: config.frames.start,
        end: config.frames.end
      }),
      frameRate: config.frames.rate,
      repeat: config.frames.repeat
    });

    if (gmi.getAllSettings().motion) {
      sprite.play(config.frames.key);
    }

    return sprite;
  };
};