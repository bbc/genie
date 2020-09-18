/**
 * @copyright BBC 2020
 * @author BBC Children's D+E
 * @license Apache-2.0
 */
import { itemsRegistry, initRegistry } from "../../components/shop/item-registry.js";

export const loadRegistry = (screen, config) => {
    const registryKeys = getRegistryKeys(config);
    if (!registryKeys.length) return;

    registryKeys.forEach(key => {
        loadToCache(screen, key);
    });

    screen.load.start();

    screen.load.on("complete", () => {
        registryKeys.forEach(key => {
            initRegistry(key, screen.cache.json.get(`registry-${key}`));
        });
        console.log("BEEBUG: itemsRegistry", itemsRegistry);
    });
};

const getRegistryKeys = config => {
    const registryKey = item => item[1].registryKey;

    return Object.entries(config).filter(registryKey).map(registryKey);
};

const loadToCache = (screen, key) => {
    screen.load.json5({
        key: `registry-${key}`,
        url: `items/${key}.json5`,
    });
};
