/**
 * @copyright BBC 2020
 * @author BBC Children's D+E
 * @license Apache-2.0
 */
import { gmi } from "../../core/gmi/gmi.js";

const onPointerOut = (emitter, button) => button.on(Phaser.Input.Events.POINTER_OUT, () => emitter.stop());

const isButtonEnabled = button => button.listeners(Phaser.Input.Events.POINTER_UP).length === 0;

const createEmitter = (scene, button, config) => {
	if (isButtonEnabled(button)) return;

	const emitterConfig = scene.cache.json.get(config.emitterConfigKey);

	const emitter = scene.add.particles(0, 0, config.assetKey, emitterConfig).setPosition(button.x, button.y);
	onPointerOut(emitter, button);
};

export const addHoverParticlesToCells = (scene, cells, config, layoutRoot) => {
	if (!config) return;
	gmi.getAllSettings().motion &&
		cells
			.map(cell => cell.button)
			.forEach(button => button.on(Phaser.Input.Events.POINTER_OVER, () => createEmitter(scene, button, config)));
	config.onTop ? layoutRoot.setDepth(0) : layoutRoot.setDepth(1);
};
