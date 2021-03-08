/**
 * @copyright BBC 2020
 * @author BBC Children's D+E
 * @license Apache-2.0
 */
import { gmi } from "./gmi/gmi.js";
import fp from "../../lib/lodash/fp/fp.js";

const getGenieStore = () => gmi.getAllSettings().gameData?.genie ?? {};
const mergeDefaults = itemDefaults => item => ({ ...item, ...itemDefaults?.find(def => def.id === item.id) });
const getFilterParams = config => ({ ids: config.defaults?.map(x => x.id) ?? [], tags: config.include ?? [] });
const tagIn = config => tag => config.tags.includes(tag);
const include = config => item => !config.tags.length || config.ids.includes(item.id) || item.tags?.some(tagIn(config));
const addQty = qty => item => ({ ...item, qty }); //TODO this should be add global defaults. qty might not even be present? needed for shop
const getStoredFn = key => () => getGenieStore()?.collections?.[key] ?? [];
const keyById = arr => Object.fromEntries(arr.map(x => [x.id, x]));
const mergeItems = (stored, item) => Object.values(fp.merge(keyById(stored), keyById(item)));

const warn = message => {
    console.warn(message); // eslint-disable-line no-console
    return false;
};

const validateFn = catalogue =>
    fp.cond([
        [
            config => typeof config !== "object",
            () => warn('config must be an object, e.g: {id: "hammer", state: "purchased", qty: 1}'),
        ],
        [config => catalogue.every(item => item.id !== config.id), () => warn("Item id does not exist in catalogue")],
        [fp.stubTrue, fp.stubTrue],
    ]);

export const initCollection = screen => key => {
    const getStored = getStoredFn(key);
    const config = screen.cache.json.get(`items/${key}`);

    const storagePath = ["collections", key];
    const catalogue = fp.isString(config.catalogue)
        ? screen.cache.json.get(`items/${config.catalogue}`)
        : config.catalogue;

    const valid = validateFn(catalogue);

    const getAll = () => {
        const base = catalogue
            .filter(include(getFilterParams(config)))
            .map(addQty(config.defaultQty ?? 1))
            .map(mergeDefaults(config.defaults));

        return mergeItems(base, getStored(key));
    };

    const get = key => getAll().find(item => item.id === key);

    const set = config => {
        if (!valid(config)) return;

        gmi.setGameData("genie", fp.setWith(Object, storagePath, mergeItems(getStored(), [config]), getGenieStore()));
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

export let collections = new Map();
