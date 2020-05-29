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
    scene.context.theme.background.audio && checks.push([isAudio(scene), createAudio(scene)]);
    scene.context.theme.background.tweens && checks.push([isTween(scene), createTween(scene)]);

    return fp.cond(checks);
};

const getAllItems = background => [...(background.tweens || []), ...(background.audio || [])].map(i => i.name);

const getTimedItems = scene => {
    const pages = scene.context.theme.background.pages;
    const timedItems = pages ? pages[scene.pageIdx] : getAllItems(scene.context.theme.background);
    return timedItems.map(createItems(scene));
};

const skip = timedItems => timedItems.forEach(item => item.stop(1));

export const nextPage = scene => () => {
    skip(scene.timedItems);
    scene.pageIdx++;
    const pages = scene.context.theme.background.pages;
    const lastPage = pages ? scene.pageIdx >= pages.length : false;
    lastPage ? scene.navigation.next() : (scene.timedItems = getTimedItems(scene));
};
