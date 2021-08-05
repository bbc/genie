/**
 * @copyright BBC 2018
 * @author BBC Children's D+E
 * @license Apache-2.0
 */
import { gmi } from "./gmi/gmi.js";
import { parseUrlParams } from "./parse-url-params.js";

const getTheme = () => {
	const urlParams = parseUrlParams(window.location.search);
	return urlParams.theme ? `themes/${urlParams.theme}/` : gmi.embedVars.configPath;
};

export { getTheme };
