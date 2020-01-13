import { gmi } from "./gmi/gmi.js";
import fp from "../../lib/lodash/fp/fp.js";

const getGenieStore = () => gmi.getAllSettings().gameData.genie || {};

export let states = new Map();

export const create = (storageKey, config) => {
    if (window.__debug) {
        window.__debug.states = states;
    }

    const getMerged = stored => config.map(item => Object.assign(item, stored[item.id]));
    const get = key => getGenieStore()[storageKey][key];
    const getStored = () => getGenieStore()[storageKey] || {}; //TODO ".states" on this path?

    const getAll = fp.flow(
        getStored,
        getMerged,
    );

    const set = (id, state) => {
        gmi.setGameData("genie", fp.set([storageKey, id], { state }, getGenieStore()));
    };

    const state = {
        get,
        getAll,
        set,
    };

    states.set(storageKey, state);

    return state;
};
