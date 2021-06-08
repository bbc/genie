/**
 * @copyright BBC 2020
 * @author BBC Children's D+E
 * @license Apache-2.0
 */
import { gmi } from "../gmi/gmi.js";
var spineDefaults = {
  x: 0,
  y: 0,
  animationName: "default",
  loop: true
};
export var isSpine = function isSpine(scene) {
  return function (config) {
    return scene.cache.custom.spine.exists(config.key);
  };
};
export var addSpine = function addSpine(scene) {
  return function (animConfig) {
    var config = Object.assign({}, spineDefaults, animConfig);
    var animation = scene.add.spine(config.x, config.y, config.key, config.animationName, config.loop);
    config.props && Object.assign(animation, config.props);
    animation.active = gmi.getAllSettings().motion;
    return animation;
  };
};