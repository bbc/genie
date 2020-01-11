/**
 * @copyright BBC 2018
 * @author BBC Children's D+E
 * @license Apache-2.0
 */
import { parseUrlParams } from "../parseUrlParams.js";

const urlParams = window => parseUrlParams(window.location.search);

const testURL = window => window.location.hostname.includes("www.test.bbc.");

const __qaMode = game => ({
    testHarnessLayoutDisplayed: false,
    game,
});

const create = (window, game) => {
    if (debugMode() || testURL(window)) {
        window.__qaMode = __qaMode(game);
    }
};

const debugMode = () => Boolean(urlParams(window).debug);

export { debugMode, create };
