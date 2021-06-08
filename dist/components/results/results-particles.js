/**
 * @copyright BBC 2020
 * @author BBC Children's D+E
 * @license Apache-2.0
 */
import { gmi } from "../../core/gmi/gmi.js";

var startEmitter = function startEmitter(scene, config, emitter) {
  var delay = config.delay || 0;
  scene.time.addEvent({
    delay: delay,
    callback: function callback() {
      return emitter.start();
    }
  });
  config.duration && scene.time.addEvent({
    delay: delay + config.duration,
    callback: function callback() {
      return emitter.stop();
    }
  });
};

var addParticlesToRow = function addParticlesToRow(scene, container) {
  gmi.getAllSettings().motion && container.rowConfig.particles && container.rowConfig.particles.forEach(function (config) {
    return startEmitter(scene, config, scene.add.particles(config.assetKey).setDepth(config.onTop ? 1 : 0).createEmitter(scene.cache.json.get(config.emitterConfigKey)).setPosition(container.x + (config.offsetX || 0), container.y + (config.offsetY || 0)).stop());
  });
};

export var addParticlesToRows = function addParticlesToRows(scene, containers) {
  return containers.forEach(function (container) {
    return addParticlesToRow(scene, container);
  });
};