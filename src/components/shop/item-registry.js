/**
 * @copyright BBC 2020
 * @author BBC Children's D+E
 * @license Apache-2.0
 */

import fp from "../../../lib/lodash/fp/fp.js";

export const initRegistry = itemsArray => {
    const getResult = result => (result ? Object.assign({}, result) : undefined);

    const get = (id, categories = []) => {
        if (id === undefined) return fp.clone(itemsArray);
        let result;
        if (!categories.length) {
            result = itemsArray.find(item => id === item.id);
            return getResult(result);
        }
        categories.forEach(category => {
            result = itemsArray.find(item => id === item.id && item.category.includes(category));
        });
        return getResult(result);
    };

    const getCategory = category => itemsArray.filter(item => item.category.includes(category));

    const set = item => {
        const itemIndex = itemsArray.findIndex(storedItem => item.id === storedItem.id);
        if (itemIndex !== -1) {
            itemsArray[itemIndex] = item;
            return true;
        }
        return false;
    };

    const registry = {
        itemsArray,
        get,
        getCategory,
        set,
    };

    return registry;
};
