/**
 * @copyright BBC 2018
 * @author BBC Children's D+E
 * @license Apache-2.0
 */
import fp from "../../../lib/lodash/fp/fp.js";

export const loadConfig = (screen, paths) => {
    paths.forEach(path =>
        screen.load.json5({
            key: `${path}/config`,
            url: `${path}/config.json5`,
        }),
    );
};

export const getConfig = (screen, paths) => {
    const entries = paths.map(path => screen.cache.json.get(`${path}/config`));
    return entries.reduce((acc, entry) => fp.merge(acc, entry), {});
};

export const getDebugConfig = (screen, paths) => {
    const entries = paths.map(path => screen.cache.json.get(`../../${path}`));
    return entries.reduce((acc, entry) => fp.merge(acc, entry), {});
};
