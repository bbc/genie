/**
 * @copyright BBC 2020
 * @author BBC Children's D+E
 * @license Apache-2.0
 */
import { initCollection } from "../collections.js";
import fp from "../../../lib/lodash/fp/fp.js";

const getKey = item => item.collection;
const loadToCache = (screen, path) => key =>
    screen.load.json5({ key: `${path}items/${key}`, url: `${path}items/${key}.json5` });
const getKeys = config => Object.values(config).map(getKey).filter(Boolean);

export const loadCollections = (screen, config, path = "") => {
    const keys = getKeys(config).flat();
    keys.forEach(loadToCache(screen, path));

    return new Promise(resolve => {
        const cataloguesLoaded = () => {
            keys.forEach(initCollection(screen, path));
            resolve();
        };

        const collectionsLoaded = () => {
            const catalogueKeys = fp
                .uniq(keys.map(key => screen.cache.json.get(`${path}items/${key}`).catalogue))
                .filter(fp.isString);
            catalogueKeys.forEach(loadToCache(screen, path));
            screen.load.once("complete", cataloguesLoaded);
            screen.load.start();
        };
        screen.load.once("complete", collectionsLoaded);
        screen.load.start();
    });
};
