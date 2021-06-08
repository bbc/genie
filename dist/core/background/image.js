/**
 * @copyright BBC 2020
 * @author BBC Children's D+E
 * @license Apache-2.0
 */
var imageDefaults = {
  x: 0,
  y: 0
};
export var isImage = function isImage(scene) {
  return function (config) {
    return scene.textures.exists(config.key) && !config.frames;
  };
};
export var addImage = function addImage(scene) {
  return function (imageConfig) {
    var config = Object.assign({}, imageDefaults, imageConfig);
    var image = scene.add.image(config.x, config.y, config.key);
    config.props && Object.assign(image, config.props);
    return image;
  };
};