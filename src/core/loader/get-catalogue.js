/**
 * @copyright BBC 2020
 * @author BBC Children's D+E
 * @license Apache-2.0
 */
import { catalogue, initCatalogue } from "../../components/shop/item-catalogue.js";

export const loadCatalogue = (screen, config) => {
    const catalogueKeys = getCatalogueKeys(config);

    catalogueKeys.forEach(loadToCache(screen));

    screen.load.on("complete", () => {
        catalogueKeys.forEach(key => {
            initCatalogue(key, screen.cache.json.get(`registry-${key}`));
        });
        console.log("BEEBUG: catalogue", catalogue);
    });

    screen.load.start();
};

const getCatalogueKeys = config => {
    const catalogueKey = item => item[1].catalogueKey;

    return Object.entries(config).map(catalogueKey).filter(Boolean);
};

const loadToCache = screen => key => {
    screen.load.json5({
        key: `registry-${key}`,
        url: `items/${key}.json5`,
    });
};
