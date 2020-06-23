/**
 * @copyright BBC 2018
 * @author BBC Children's D+E
 * @license Apache-2.0
 */
import fp from "../../../lib/lodash/fp/fp.js";
import JSON5 from "/node_modules/json5/dist/index.mjs";

export const getConfig = (assets, path) => {
    const configFile = JSON.parse(
        assets
            .filter(asset => asset.name === `./${path}.json`)
            .pop()
            .readAsString(),
    ).config;
    const keys = configFile.files.map(file => file.key);
    const entries = keys.map(key =>
        JSON5.parse(
            assets
                .filter(asset => asset.name === `./config/${key}.json5`)
                .pop()
                .readAsString(),
        ),
    );

    return entries.reduce((acc, entry) => fp.merge(acc, entry), {});
};
