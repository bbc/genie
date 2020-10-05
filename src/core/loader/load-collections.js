/**
 * @copyright BBC 2020
 * @author BBC Children's D+E
 * @license Apache-2.0
 */
const getKey = item => item.collection;
const loadToCache = screen => key => screen.load.json5({ key, url: `items/${key}.json5` });
const getKeys = config => Object.values(config).map(getKey).filter(Boolean);
import fp from "../../../lib/lodash/fp/fp.js";

export const loadCollections = (screen, config) => {
    const keys = getKeys(config);
    keys.forEach(loadToCache(screen)); //TODO we need to add this in a way that resolves conflicts. /items the key?

    return new Promise(resolve => {
        const collectionsLoaded = () => {
            const catalogueKeys = keys.map(key => screen.cache.json.get(key).catalogue);
            const catKeys = fp.uniq(catalogueKeys);
            catKeys.forEach(loadToCache(screen));
            screen.load.once("complete", resolve);
            screen.load.start();
        };
        screen.load.once("complete", collectionsLoaded);
        screen.load.start();
    });
};
