import _flattenDeep from "lodash/flattenDeep";
import _flatMap from "lodash/flatMap";
import _map from "lodash/map";
import _join from "lodash/join";

import { loadAssets } from "../core/asset-loader.js";
import { Screen } from "../core/screen.js";

const MASTER_PACK_KEY = "MasterAssetPack";
const GEL_PACK_KEY = "GelAssetPack";

const gamePacksToLoad = {
    [MASTER_PACK_KEY]: { url: "asset-master-pack.json" },
    [GEL_PACK_KEY]: { url: "gel/gel-pack.json" },
};
const loadscreenPack = {
    key: "loadscreen",
    url: "loader/loadscreen-pack.json",
};

export class Loadscreen extends Screen {
    /**
     * Placeholder Loadscreen for development
     * Example Usage
     */
    constructor() {
        super();
    }

    preload() {
        loadAssets(this.game, gamePacksToLoad, loadscreenPack, this.updateLoadProgress.bind(this)).then(keyLookups => {
            this.layoutFactory.addLookups(keyLookups);
            if (this.context.qaMode.active) {
                dumpToConsole(keyLookups);
            }
            this.next();
        });
    }

    create() {}

    updateLoadProgress(progress) {
        // use progress to update loading bar
        if (this.context.qaMode.active) {
            console.log("Loader progress:", progress); // eslint-disable-line no-console
        }
    }
}

function dumpToConsole(keyLookups) {
    const lines = _flattenDeep([
        "Loaded assets:",
        _flatMap(keyLookups, (keyMap, screenId) => [
            `    ${screenId}:`,
            _map(keyMap, (path, key) => `        ${key}: ${path}`),
        ]),
    ]);
    console.log(_join(lines, "\n")); // eslint-disable-line no-console
}
