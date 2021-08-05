/**
 * @copyright BBC 2020
 * @author BBC Children's D+E
 * @license Apache-2.0
 */
import { gmi } from "../gmi/gmi.js";

export const isParticles = scene => config => scene.cache.json.exists(config.key); //TODO should particles use a custom cache?

export const addParticles = scene => config => {
	if (!gmi.getAllSettings().motion) return;

	const particles = scene.add.particles(config.assetKey);
	const props = config.props || {};
	const emitterConfig = { ...scene.cache.json.get(config.key), ...props };

	return particles.createEmitter(emitterConfig);
};
