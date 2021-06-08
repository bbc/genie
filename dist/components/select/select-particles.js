/**
 * @copyright BBC 2020
 * @author BBC Children's D+E
 * @license Apache-2.0
 */
import { gmi } from "../../core/gmi/gmi.js";

var onPointerOut = function onPointerOut(emitter, button) {
  return button.on(Phaser.Input.Events.POINTER_OUT, function () {
    return emitter.stop();
  });
};

var createEmitter = function createEmitter(scene, button, config) {
  var emitter = scene.add.particles(config.assetKey).createEmitter(scene.cache.json.get(config.emitterConfigKey)).setPosition(button.x, button.y);
  onPointerOut(emitter, button);
};

export var addHoverParticlesToCells = function addHoverParticlesToCells(scene, cells, config, layoutRoot) {
  if (!config) return;
  gmi.getAllSettings().motion && cells.map(function (cell) {
    return cell.button;
  }).forEach(function (button) {
    return button.on(Phaser.Input.Events.POINTER_OVER, function () {
      return createEmitter(scene, button, config);
    });
  });
  config.onTop ? layoutRoot.setDepth(0) : layoutRoot.setDepth(1);
};