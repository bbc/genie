/**
 * @copyright BBC 2020
 * @author BBC Children's D+E
 * @license Apache-2.0
 */
import { gmi } from "./gmi/gmi.js";
import fp from "../../lib/lodash/fp/fp.js";

const getGenieStore = () => gmi.getAllSettings().gameData.genie || {};

export let collections = new Map();

const mergeDefaults = itemDefaults => item => ({ ...item, ...itemDefaults?.find(def => def.id === item.id) });
const getFilterParams = config => ({ ids: config.defaults?.map(x => x.id) ?? [], tags: config.include ?? [] });
const filterItems = config => item => config.ids.includes(item.id) || item.tags.some(tag => config.tags.includes(tag));
const addQty = qty => item => ({ ...item, qty });
const getStored = key => getGenieStore()[key] || {};
const addStored = stored => item => ({ ...item, ...stored[item.id] });

export const initCollection = screen => key => {
    const config = screen.cache.json.get(key);
    const catalogue = screen.cache.json.get(config.catalogue);

    const getAll = () =>
        catalogue
            .filter(filterItems(getFilterParams(config)))
            .map(addQty(config.defaultQty ?? 1))
            .map(mergeDefaults(config.defaults))
            .map(addStored(getStored(key)));

    const get = key => getAll().find(item => item.id === key);

    const set = (id, config = null) => {
        gmi.setGameData("genie", fp.setWith(Object, [key, id], config, getGenieStore()));
    };

    const collection = {
        config,
        get,
        getAll,
        set,
    };

    collections.set(key, collection);

    return collection;
};
