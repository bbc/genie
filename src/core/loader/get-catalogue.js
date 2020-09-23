/**
 * @copyright BBC 2020
 * @author BBC Children's D+E
 * @license Apache-2.0
 */
import { initCatalogue } from "../../components/shop/item-catalogue.js";

export const loadCatalogue = (screen, config) => {
    const catalogueKeys = getCatalogueKeys(config);

    catalogueKeys.forEach(loadToCache(screen));

    screen.load.once("complete", () =>
        catalogueKeys.forEach(key => initCatalogue(key, screen.cache.json.get(`catalogue-${key}`))),
    );

    screen.load.start();
};

export const getCatalogueKeys = config =>
    Object.values(config)
        .map(item => item.catalogueKey)
        .filter(Boolean);

export const loadToCache = screen => key => {
    screen.load.json5({
        key: `catalogue-${key}`,
        url: `items/${key}.json5`,
    });
};
