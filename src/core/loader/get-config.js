/**
 * @copyright BBC 2018
 * @author BBC Children's D+E
 * @license Apache-2.0
 */
import fp from "../../../lib/lodash/fp/fp.js";

const getKey = key => (key === "../../debug" ? "debug" : key);

export const loadConfig = (screen, keys) => {
	debugger
	keys.forEach(key =>
		screen.load.json5({
			key: `config-${getKey(key)}`,
			url: `${key}/config.json5`,
		}),
	);
};

export const getConfig = (screen, keys) => {
	debugger
	const entries = keys.map(key => ({
		[getKey(key)]: screen.cache.json.get(`config-${getKey(key)}`),
	}));
	return entries.reduce((acc, entry) => fp.merge(acc, entry), {});
};
