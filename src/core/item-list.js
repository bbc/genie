/**
 * @copyright BBC 2020
 * @author BBC Children's D+E
 * @license Apache-2.0
 */
import { gmi } from "./gmi/gmi.js";
import fp from "../../lib/lodash/fp/fp.js";

const getGenieStore = () => gmi.getAllSettings().gameData.genie || {};

export let itemLists = new Map();
export const initList = (key, config) => {
    window.__debug && (window.__debug.itemLists = itemLists);

    const getMerged = stored => config.map(item => Object.assign(item, stored[item.id]));
    const get = key =>
        Object.assign(
            {},
            config.find(conf => conf.id === key),
            fp.get(`${key}.${key}`, getGenieStore()),
        );


    const getStored = () => getGenieStore()[key] || {};

    const getAll = fp.flow(getStored, getMerged);

    const set = (id, itemList = null) => {

        //TODO needs a merge here - previously "state" was being stored as a key and was only ever one string.


        gmi.setGameData("genie", fp.setWith(Object, [key, id], { itemList }, getGenieStore()));
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
