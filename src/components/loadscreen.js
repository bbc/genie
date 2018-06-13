/**
 * Loadscreen loads in the game's assets.
 *
 * @module components/loadscreen
 */

import _ from "../../lib/lodash/lodash.js";
import { loadAssets } from "../core/asset-loader.js";
import { GameAssets, initGameAssets } from "../core/game-assets.js";
import { Screen } from "../core/screen.js";
import { createLoadBar } from "./loadbar.js";
import * as Scaler from "../core/scaler.js";

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
            if (this.context.qaMode.active) {
                dumpToConsole(keyLookups);
            }
            initGameAssets(this.game);
            this.startMusic();

            this.navigation.next();
        });
    }

    createBackground() {
        this.scene.addToBackground(this.game.add.image(0, 0, "loadscreenBackground"));
    }

    createTitle() {
        this.scene.addToBackground(this.game.add.image(0, -150, "loadscreenTitle"));
    }

    createLoadingBar() {
        this.loadingBar = createLoadBar(this.game, "loadbarBackground", "loadbarFill");
        this.loadingBar.position.set(0, 110);
        this.scene.addToBackground(this.loadingBar);
    }

    createBrandLogo() {
        const metrics = Scaler.getMetrics();

        const x = metrics.horizontals.right - metrics.borderPad / metrics.scale;
        const y = metrics.verticals.bottom - metrics.borderPad / metrics.scale;
        this.brandLogo = this.scene.addToBackground(this.game.add.image(0, 0, "brandLogo"));
        this.brandLogo.right = x;
        this.brandLogo.bottom = y;
    }

    create() {
        this.createBackground();
        this.createTitle();
        this.createLoadingBar();
        this.createBrandLogo();
    }

    updateLoadProgress(progress) {
        if (this.hasOwnProperty("loadingBar")) this.loadingBar.fillPercent = progress;
        if (this.context.qaMode.active) {
            console.log("Loader progress:", progress); // eslint-disable-line no-console
        }
    }

    startMusic() {
        GameAssets.sounds.backgroundMusic.loopFull();
        if (GameAssets.sounds.backgroundMusic.usingAudioTag) {
            GameAssets.sounds.backgroundMusic.mute = this.game.sound.mute;
        }
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
