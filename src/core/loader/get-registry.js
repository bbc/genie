/**
 * @copyright BBC 2020
 * @author BBC Children's D+E
 * @license Apache-2.0
 */

import { itemsRegistry, initRegistry } from "../../components/shop/item-registry.js"

export const getRegistry = (screen, registryKeys) => {
    screen.registry = itemsRegistry;
    registryKeys.forEach(key => {
        loadRegistry(screen, key);
    });
    screen.load.start();
    screen.load.on("complete", () => {
        registryKeys.forEach(key => {
            initRegistry(key, screen.cache.json.get(`registry-${key}`));
        });
    });
    return itemsRegistry;
};

const loadRegistry = (screen, key) => {
    screen.load.json5({
        key: `registry-${key}`,
        url: `items/${key}.json5`,
    });
};
