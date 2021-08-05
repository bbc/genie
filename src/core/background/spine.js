/**
 * @copyright BBC 2020
 * @author BBC Children's D+E
 * @license Apache-2.0
 */
import { gmi } from "../gmi/gmi.js";

const spineDefaults = {
	x: 0,
	y: 0,
	animationName: "default",
	loop: true,
};

export const isSpine = scene => config => scene.cache.custom.spine.exists(config.key);

export const addSpine = scene => animConfig => {
	const config = Object.assign({}, spineDefaults, animConfig);
	const animation = scene.add.spine(config.x, config.y, config.key, config.animationName, config.loop);

	config.props && Object.assign(animation, config.props);

	animation.active = gmi.getAllSettings().motion;

	return animation;
};
