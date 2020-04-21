/**
 * @copyright BBC 2020
 * @author BBC Children's D+E
 * @license Apache-2.0
 */
import { gmi } from "../../core/gmi/gmi.js";

const onPointerOut = (emitter, button) => button.on(Phaser.Input.Events.POINTER_OUT, () => emitter.stop());

const createEmitter = (scene, button, config) => {
    const emitter = scene.add
        .particles(config.assetKey)
        .createEmitter(scene.cache.json.get(config.emitterConfigKey))
        .setPosition(button.x, button.y);
    onPointerOut(emitter, button);
};

const createEmitters = (scene, button, configs) => configs.forEach(config => createEmitter(scene, button, config));

export const addHoverParticlesToCells = (scene, cells, configs) => {
    gmi.getAllSettings().motion &&
        cells
            .map(cell => cell.button)
            .forEach(button =>
                button.on(Phaser.Input.Events.POINTER_OVER, () => createEmitters(scene, button, configs)),
            );
};
