/**
 * @copyright BBC 2018
 * @author BBC Children's D+E
 * @license Apache-2.0
 */
import { parseUrlParams } from "../parse-url-params.js";
import { gmi } from "../gmi/gmi.js";
import { collections } from "../collections.js";

const urlParams = window => parseUrlParams(window.location.search);
const testURL = window => window.location.hostname.includes("www.test.bbc.");

const create = window => {
    if (isDebug() || testURL(window)) {
        window.__debug = { gmi, collections };
    }
};

const isDebug = () => Boolean(urlParams(window).debug);

export { isDebug, create };
