/**
 * @copyright BBC 2020
 * @author BBC Children's D+E
 * @license Apache-2.0
 */

import { gmi } from "./gmi/gmi.js";
import fp from "../../lib/lodash/fp/fp.js";

const getGenieStore = () => gmi.getAllSettings().gameData.genie || {};

export let states = new Map();
export const create = (stateKey, config) => {
    if (window.__debug) {
        window.__debug.states = states;
    }

    const getMerged = stored => config.map(item => Object.assign(item, stored[item.id]));
    //const get = key => Object.assign({}, config.find(conf => conf.id === key), getGenieStore()[stateKey][key]);
    const get = key =>
        Object.assign({}, config.find(conf => conf.id === key), fp.get(`${stateKey}.${key}`, getGenieStore()));
    const getStored = () => getGenieStore()[stateKey] || {};

    const getAll = fp.flow(
        getStored,
        getMerged,
    );

    const set = (id, state) => {
        gmi.setGameData("genie", fp.set([stateKey, id], { state }, getGenieStore()));
    };

    const state = {
        config,
        get,
        getAll,
        set,
    };

    states.set(stateKey, state);

    return state;
};
