/**
 * @copyright BBC 2020
 * @author BBC Children's D+E
 * @license Apache-2.0
 */
import { initCollection } from "../collections.js";
import fp from "../../../lib/lodash/fp/fp.js";

const getKey = item => item.collection;
const loadToCache = screen => key => screen.load.json5({ key: `collections/${key}`, url: `collections/${key}.json5` });
const getKeys = config => Object.values(config).map(getKey).filter(Boolean);

export const loadCollections = (screen, config) => {
	const keys = getKeys(config).flat();
	keys.forEach(loadToCache(screen));

	return new Promise(resolve => {
		const cataloguesLoaded = () => {
			keys.forEach(initCollection(screen));
			resolve();
		};

		const collectionsLoaded = () => {
			const catalogueKeys = fp
				.uniq(keys.map(key => screen.cache.json.get(`collections/${key}`).catalogue))
				.filter(fp.isString);
			catalogueKeys.forEach(loadToCache(screen));
			screen.load.once("complete", cataloguesLoaded);
			screen.load.start();
		};
		screen.load.once("complete", collectionsLoaded);
		screen.load.start();
	});
};
