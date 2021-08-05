/**
 * @copyright BBC 2019
 * @author BBC Children's D+E
 * @license Apache-2.0
 */
import fp from "../../../lib/lodash/fp/fp.js";
import { isSprite, addSprite } from "./sprite.js";
import { isImage, addImage } from "./image.js";
import { isSpine, addSpine } from "./spine.js";
import { isText, addText } from "./text.js";
import { isParticles, addParticles } from "./particles.js";

const setName = createFn => config => {
	const item = createFn(config);
	item && config.name && (item.name = config.name);
};

export const furnish = scene => () => {
	const configs = fp.get("background.items", scene.config) || [];

	const conditionPairs = [
		[isSpine(scene), addSpine(scene)],
		[isImage(scene), addImage(scene)],
		[isSprite(scene), addSprite(scene)],
		[isParticles(scene), addParticles(scene)],
		[isText, addText(scene)],
	];

	configs.forEach(setName(fp.cond(conditionPairs)));
};
