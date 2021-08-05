/**
 * @copyright BBC 2020
 * @author BBC Children's D+E
 * @license Apache-2.0
 */
import { getNamed } from "./get-named.js";

const getTargetByName = scene => name => scene.children.list.reduce(getNamed(name), false);

export const createTween = scene => name => {
	const config = { ...scene.config.background.tweens.find(a => a.name === name) };
	delete config.name; //if name is present tween will mangle it on the gameObject
	config.targets = config.targets.map(getTargetByName(scene));

	return scene.tweens.add(config);
};

export const isTween = scene => name => Boolean(scene.config.background.tweens.find(a => a.name === name));
