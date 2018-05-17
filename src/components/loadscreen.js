/**
 * Loadscreen loads in the game's assets.
 *
 * @module components/loadscreen
 */

import { loadAssets } from "../core/asset-loader.js";
import { GameAssets, initGameAssets } from "../core/game-assets.js";
import * as gel from "../core/layout/gel-defaults.js";
import { Screen } from "../core/screen.js";
import { settings, settingsChannel } from "../core/settings.js";
import * as signal from "../core/signal-bus.js";
import _ from "../lib/lodash/lodash.js";
import * as pause from "./pause.js";

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
            this.addSignalSubsciptions();
            this.next();
        });
    }

    addSignalSubsciptions() {
        signal.bus.subscribe({ channel: gel.buttonsChannel, name: "pause", callback: pause.create });
        signal.bus.subscribe({ channel: gel.buttonsChannel, name: "settings", callback: settings.show });
        signal.bus.subscribe({
            channel: settingsChannel,
            name: "audio",
            callback: value => {
                console.log("Audio setting changed to " + value);
            },
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
