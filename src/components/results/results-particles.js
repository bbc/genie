/**
 * @copyright BBC 2020
 * @author BBC Children's D+E
 * @license Apache-2.0
 */
import { gmi } from "../../core/gmi/gmi.js";

const startEmitter = (scene, config, emitter) => {
	const delay = config.delay || 0;
	scene.time.addEvent({
		delay,
		callback: () => emitter.start(),
	});
	config.duration &&
		scene.time.addEvent({
			delay: delay + config.duration,
			callback: () => emitter.stop(),
		});
};

const addParticlesToRow = (scene, container) => {
	gmi.getAllSettings().motion &&
		container.rowConfig.particles &&
		container.rowConfig.particles.forEach(config =>
			startEmitter(
				scene,
				config,
				scene.add
					.particles(config.assetKey)
					.setDepth(config.onTop ? 1 : 0)
					.createEmitter(scene.cache.json.get(config.emitterConfigKey))
					.setPosition(container.x + (config.offsetX || 0), container.y + (config.offsetY || 0))
					.stop(),
			),
		);
};

export const addParticlesToRows = (scene, containers) =>
	containers.forEach(container => addParticlesToRow(scene, container));
