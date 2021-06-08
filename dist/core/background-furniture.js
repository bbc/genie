function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

/**
 * @copyright BBC 2019
 * @author BBC Children's D+E
 * @license Apache-2.0
 */
import { gmi } from "./gmi/gmi.js";
import fp from "../../lib/lodash/fp/fp.js";
var spineDefaults = {
  x: 0,
  y: 0,
  animationName: "default",
  loop: true
};
var imageDefaults = {
  x: 0,
  y: 0
};
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

var addSpine = function addSpine(scene) {
  return function (animConfig) {
    var config = Object.assign({}, spineDefaults, animConfig);
    var animation = scene.add.spine(config.x, config.y, config.key, config.animationName, config.loop);
    config.props && Object.assign(animation, config.props);
    animation.active = gmi.getAllSettings().motion;
  };
};

var addSprite = function addSprite(scene) {
  return function (animConfig) {
    var config = _objectSpread(_objectSpread(_objectSpread({}, spriteDefaults), animConfig), {
      frames: _objectSpread(_objectSpread({}, spriteDefaults.frames), animConfig.frames)
    });

    var animation = scene.add.sprite(config.x, config.y, config.key, config.frames.default);
    config.props && Object.assign(animation, config.props);
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
      animation.play(config.frames.key);
    }
  };
};

var addImage = function addImage(scene) {
  return function (imageConfig) {
    var config = Object.assign({}, imageDefaults, imageConfig);
    var image = scene.add.image(config.x, config.y, config.key);
    config.props && Object.assign(image, config.props);
  };
};

var addParticles = function addParticles(scene) {
  return function (config) {
    if (!gmi.getAllSettings().motion) return;
    var particles = scene.add.particles(config.assetKey);
    var props = config.props || {};

    var emitterConfig = _objectSpread(_objectSpread({}, scene.cache.json.get(config.key)), props);

    particles.createEmitter(emitterConfig);
  };
};

var isSpine = function isSpine(scene) {
  return function (config) {
    return scene.cache.custom.spine.exists(config.key);
  };
};

var isImage = function isImage(scene) {
  return function (config) {
    return scene.textures.exists(config.key) && !config.frames;
  };
};

var isSprite = function isSprite(scene) {
  return function (config) {
    return scene.textures.exists(config.key) && Boolean(config.frames);
  };
};

var isParticles = function isParticles(scene) {
  return function (config) {
    return scene.cache.json.exists(config.key);
  };
}; //TODO should particles use a custom cache?


export var furnish = function furnish(scene) {
  return function () {
    var configs = scene.context.theme.furniture || [];
    var conditionPairs = [[isSpine(scene), addSpine(scene)], [isImage(scene), addImage(scene)], [isSprite(scene), addSprite(scene)], [isParticles(scene), addParticles(scene)]];
    var dispatcher = fp.cond(conditionPairs);
    configs.forEach(dispatcher);
  };
};