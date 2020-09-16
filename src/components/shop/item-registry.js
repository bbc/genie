/**
 * @copyright BBC 2020
 * @author BBC Children's D+E
 * @license Apache-2.0
 */

import fp from "../../../lib/lodash/fp/fp.js";

export const initRegistry = itemsArray => {
    const items = fp.clone(itemsArray);

    const getResult = result => {
        return result ? Object.assign({}, result) : undefined;
    };

    const get = (id, categories = []) => {
        if (!id) return fp.clone(items);
        let result;
        if (!categories.length) {
            result = items.find(item => id === item.id);
            return getResult(result);
        }
        categories.forEach(category => {
            result = items.find(item => id === item.id && item.category.includes(category));
        });
        return getResult(result);
    };

    const getCategory = category => items.filter(item => item.category.includes(category));

    const set = item => {
        const itemIndex = items.findIndex(storedItem => item.id === storedItem.id);
        if (itemIndex >= 0) {
            items[itemIndex] = item;
            return true;
        }
        return false;
    };

    const registry = {
        items,
        get,
        getCategory,
        set,
    };

    return registry;
};
