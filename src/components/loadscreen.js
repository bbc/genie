/**
 * Loadscreen loads in the game's assets.
 *
 * @module components/loadscreen
 */

import _ from "../lib/lodash/lodash.js";

import { loadAssets } from "../core/asset-loader.js";
import { Screen } from "../core/screen.js";
import { createLoadBar } from "./loadbar.js";
import { initGameAssets, GameAssets } from "../core/game-assets.js";
import { calculateMetrics } from "../core/layout/calculate-metrics.js";

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

    create() {
        this.layoutFactory.addToBackground(this.game.add.image(0, 0, "loadscreenBackground"));
        this.layoutFactory.addToBackground(this.game.add.image(0, -150, "loadscreenTitle"));

        this.loadingBar = createLoadBar(this.game, "loadbarBackground", "loadbarFill");
        this.loadingBar.position.set(0, 110);
        this.layoutFactory.addToBackground(this.loadingBar);

        // TODO: Find a way to make the brand logo play nice with the scaler and position it correctly
        const size = this.layoutFactory.getSize();
        const metrics = calculateMetrics(size.width, size.height, size.scale, size.stageHeightPx);
        const padding = metrics.borderPad * size.scale;
        const x = metrics.horizontals["right"] - this.game.width - padding;
        const y = metrics.verticals["bottom"] - (this.game.height + padding);

        this.brandLogo = this.layoutFactory.addToBackground(this.game.add.image(0, 0, "brandLogo"));
        this.brandLogo.anchor.set(1, 1);
        this.brandLogo.position.set(x, y);
    }

    updateLoadProgress(progress) {
        if (this.hasOwnProperty("loadingBar")) this.loadingBar.setFillPercent(progress);

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
