/**
 * @copyright BBC 2018
 * @author BBC Children's D+E
 * @license Apache-2.0
 */
import fp from "../../../lib/lodash/fp/fp.js";

export const getConfig = (screen, path) => {
    const configFile = screen.cache.json.get(path).config;
    const keys = configFile.files.map(file => configFile.prefix + file.key);
    const entries = keys.map(key => screen.cache.json.get(key));

    return entries.reduce((acc, entry) => fp.merge(acc, entry), {});
};
