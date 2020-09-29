/**
 * @copyright BBC 2020
 * @author BBC Children's D+E
 * @license Apache-2.0
 */
import { initCatalogue } from "../../components/shop/item-catalogue.js";

const getKey = item => item.catalogueKey;
const loadToCache = screen => key => screen.load.json5({ key: `catalogue-${key}`, url: `items/${key}.json5` });
const getKeys = config => Object.values(config).map(getKey).filter(Boolean);

export const loadCatalogue = (screen, config) => {
    const keys = getKeys(config);

    keys.forEach(loadToCache(screen));

    const loadComplete = () => keys.forEach(initCatalogue(screen));
    screen.load.once("complete", loadComplete);
    screen.load.start();
};
