/**
 * @copyright BBC 2018
 * @author BBC Children's D+E
 * @license Apache-2.0
 */
export var playRowAudio = function playRowAudio(scene, containers) {
  containers.forEach(function (row) {
    var config = row.rowConfig;

    if (config.audio) {
      scene.time.addEvent({
        delay: config.audio.delay,
        callback: function callback() {
          return scene.sound.play(config.audio.key);
        }
      });
    }
  });
};