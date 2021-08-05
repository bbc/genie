/**
 * @copyright BBC 2020
 * @author BBC Children's D+E
 * @license Apache-2.0
 */
import fp from "../../../lib/lodash/fp/fp.js";
import { createTween, isTween } from "./tweens.js";
import { createAudio, isAudio } from "./audio.js";

const createItems = scene => {
	const checks = [];
	const background = scene.config.background;
	background && background.audio && checks.push([isAudio(scene), createAudio(scene)]);
	background && background.tweens && checks.push([isTween(scene), createTween(scene)]);

	return fp.cond(checks);
};

const getAllItems = background => [...(background.tweens || []), ...(background.audio || [])].map(i => i.name);

const getTimedItems = scene => {
	const pages = fp.get("config.background.pages", scene);
	const timedItems = pages ? pages[scene.pageIdx] : getAllItems(scene.config.background || {});
	return timedItems.map(createItems(scene));
};

export const skip = timedItems => timedItems.forEach(item => item.stop(1));

export const nextPage = scene => () => {
	skip(scene.timedItems);
	scene.pageIdx++;
	const pages = fp.get("config.background.pages", scene);
	const lastPage = pages ? scene.pageIdx >= pages.length : false;
	lastPage ? scene.navigation.next() : (scene.timedItems = getTimedItems(scene));
};
