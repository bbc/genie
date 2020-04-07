/**
 * @copyright BBC 2018
 * @author BBC Children's D+E
 * @license Apache-2.0
 */
import { parseUrlParams } from "../parseUrlParams.js";
import { gmi } from "../gmi/gmi.js";

const urlParams = window => parseUrlParams(window.location.search);
const testURL = window => window.location.hostname.includes("www.test.bbc.");

const create = window => {
    if (isDebug() || testURL(window)) {
        window.__debug = { gmi };
    }
};

const isDebug = () => Boolean(urlParams(window).debug);

export { isDebug, create };
