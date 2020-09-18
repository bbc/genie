/**
 * @copyright BBC 2020
 * @author BBC Children's D+E
 * @license Apache-2.0
 */
import fp from "../../../lib/lodash/fp/fp.js";

export let catalogue = new Map();

export const initCatalogue = (key, items) => {
    if (window.__debug) {
        window.__debug.items = catalogue;
    }

    const get = id => items.find(item => id === item.id);

    const getCategory = category => items.filter(item => item.category.includes(category));

    const set = (id, diff) => {
        const itemIndex = items.findIndex(storedItem => id === storedItem.id);

        if (itemIndex !== -1) {
            items[itemIndex] = fp.merge(items[itemIndex], diff);
            return true;
        }
        return false;
    };

    const catalogueSection = {
        items,
        get,
        getCategory,
        set,
    };

    catalogue.set(key, catalogueSection);

    return catalogueSection;
};
