/**
 * @copyright BBC 2020
 * @author BBC Children's D+E
 * @license Apache-2.0
 */
export var isAudio = function isAudio(scene) {
  return function (name) {
    return Boolean(scene.config.background.audio.find(function (a) {
      return a.name === name;
    }));
  };
};
export var createAudio = function createAudio(scene) {
  return function (name) {
    var config = scene.config.background.audio.find(function (a) {
      return a.name === name;
    });
    var sound = scene.sound.add(config.key, config);
    sound.play(config);
    return sound;
  };
};