import { gmi } from "./gmi/gmi.js";
import fp from "../../lib/lodash/fp/fp.js";

const getGenieStore = () => gmi.getAllSettings().genie || {};

export const create = storageKey => {

    const getState = key => getGenieStore()[storageKey][key];
    const getAll = () => getGenieStore()[storageKey];

    const setState = (key, value) =>
    {
        const genieStore = getGenieStore();

        fp.set([ storageKey, key ], value, genieStore);

        gmi.setGameData("genie", genieStore)
    }

    return {
        getState,
        getAll,
        setState
    }
}
