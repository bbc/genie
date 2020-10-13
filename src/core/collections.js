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
const tagIn = config => tag => config.tags.includes(tag);
const include = config => item => !config.tags.length || config.ids.includes(item.id) || item.tags?.some(tagIn(config));
const addQty = qty => item => ({ ...item, qty }); //TODO this should be add global defaults. qty might not even be present? needed for shop
const getStored = key => getGenieStore()[key] || {};
const addStored = stored => item => ({ ...item, ...stored[item.id] });

export const initCollection = screen => key => {
    const config = screen.cache.json.get(`items/${key}`);
    const catalogue = fp.isString(config.catalogue)
        ? screen.cache.json.get(`items/${config.catalogue}`)
        : config.catalogue;

    const getAll = () =>
        catalogue
            .filter(include(getFilterParams(config)))
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
