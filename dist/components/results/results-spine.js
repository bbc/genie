function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * @copyright BBC 2020
 * @author BBC Children's D+E
 * @license Apache-2.0
 */
import { gmi } from "../../core/gmi/gmi.js";
export var ResultsSpine = function ResultsSpine(scene, config) {
  _classCallCheck(this, ResultsSpine);

  this.config = config;
  var animation;
  animation = scene.add.spine(config.offsetX, config.offsetY, config.key, config.animationName, config.loop);
  scene.add.existing(animation);
  Object.assign(animation, config.props);
  animation.setSize(animation.width * animation.scale, animation.height * animation.scale);
  animation.active = gmi.getAllSettings().motion;
  return animation;
};