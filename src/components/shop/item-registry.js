/**
 * @copyright BBC 2020
 * @author BBC Children's D+E
 * @license Apache-2.0
 */
export let itemsRegistry = new Map();

export const initRegistry = (key, items) => {
    if (window.__debug) {
        window.__debug.items = itemsRegistry;
    }

    const get = id => items.find(item => id === item.id);

    const getCategory = category => items.filter(item => item.category.includes(category));

    const set = item => {
        const itemIndex = items.findIndex(storedItem => item.id === storedItem.id);
        if (itemIndex !== -1) {
            items[itemIndex] = item;
            return true;
        }
        return false;
    };

    const itemList = {
        itemsArray: items,
        get,
        getCategory,
        set,
    };

    itemsRegistry.set(key, itemList);

    return itemList;
};
