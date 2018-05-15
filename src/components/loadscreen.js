/**
 * Loadscreen loads in the game's assets.
 *
 * @module components/loadscreen
 */

import _ from "../../lib/lodash/lodash.js";

import { loadAssets } from "../core/asset-loader.js";
import { Screen } from "../core/screen.js";
import { initGameAssets, GameAssets } from "../core/game-assets.js";

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
            initGameAssets(this.game);
            this.startMusic();
            this.next();
        });
    }

    updateLoadProgress(progress) {
        // use progress to update loading bar
        if (this.context.qaMode.active) {
            console.log("Loader progress:", progress); // eslint-disable-line no-console
        }
    }

    startMusic() {
        GameAssets.sounds.backgroundMusic.loopFull();
    }
}

function dumpToConsole(keyLookups) {
    const lines = _.flattenDeep([
        "Loaded assets:",
        _.flatMap(keyLookups, (keyMap, screenId) => [
            `    ${screenId}:`,
            _.map(keyMap, (path, key) => `        ${key}: ${path}`),
        ]),
    ]);
    console.log(_.join(lines, "\n")); // eslint-disable-line no-console
}
