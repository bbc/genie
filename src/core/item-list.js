/**
 * @copyright BBC 2020
 * @author BBC Children's D+E
 * @license Apache-2.0
 */
import { gmi } from "./gmi/gmi.js";
import fp from "../../lib/lodash/fp/fp.js";
import { catalogue } from "../components/shop/item-catalogue.js";

const getGenieStore = () => gmi.getAllSettings().gameData.genie || {};

export let itemLists = new Map();

const addDefaults = itemDefaults => item => ({ ...item, ...itemDefaults.find(def => def.id === item.id) });
const filterTags = filters => item => item.tags.some(tag => !filters.includes(tag));
const addQty = qty => item => ({ ...item, qty });
const addStored = stored => item => ({ ...item, ...stored[item.id] });
const getStored = key => getGenieStore()[key] || {};


//TODO need to handle no includes being set
const getTags = catalogue => fp.uniq(catalogue.flatMap(entry => entry.tags))

export const initList = (key, config, catalogue) => {
    window.__debug && (window.__debug.itemLists = itemLists);

    const inverseTags = fp.difference(getTags(catalogue), config.include)

    const getAll = () => catalogue
        .filter(filterTags(inverseTags))
        .map(addQty(config.defaultQty ?? 1))
        .map(addDefaults(config.defaults))
        .map(addStored(getStored(key)));



    //TODO the inverse idea didn't work.

    debugger

    const get = getAll().find(item => item.id === key)

    const set = (id, itemList = null) => {
        gmi.setGameData("genie", fp.setWith(Object, [key, id], itemList, getGenieStore()));
    };

    const itemList = {
        config,
        get,
        getAll,
        set,
    };

    itemLists.set(key, itemList);

    return itemList;
};
