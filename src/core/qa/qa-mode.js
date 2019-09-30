/**
 * @copyright BBC 2018
 * @author BBC Children's D+E
 * @license Apache-2.0
 */
import { parseUrlParams } from "../parseUrlParams.js";

const urlParams = window => parseUrlParams(window.location.search);

const testURL = window => window.location.hostname.includes("www.test.bbc.");

const qaMode = (game, goToScreen) => ({
    testHarnessLayoutDisplayed: false,
    goToScreen,
    game,
});

const create = (window, game, goToScreen) => {
    if (urlParams(window).qaMode || testURL(window)) {
        window.__qaMode = qaMode(game, goToScreen);
    }
};

const debugMode = (() => !!urlParams(window).debugMode)();

export { debugMode, create };
