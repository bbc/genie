/**
 * Loadscreen loads in the game's assets.
 *
 * @module components/loadscreen
 */

import _ from "../lib/lodash/lodash.js";

import { loadAssets } from "../core/asset-loader.js";
import { Screen } from "../core/screen.js";
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
            setTimeout(() => {
                this.next();
            }, 7000);
        });
    }

    create() {
        this.layoutFactory.addToBackground(this.game.add.image(0, 0, "loadscreenBackground"));
        this.layoutFactory.addToBackground(this.game.add.image(0, -150, "loadscreenTitle"));

        this.loadingBar = new PreloadBar(this.game, "loadbarBackground", "loadbarFill");
        this.loadingBar.position.set(0, 110);
        this.layoutFactory.addToBackground(this.loadingBar);

        // TODO: Find a way to make the brand logo play nice with the scaler and position it correctly
        const size = this.layoutFactory.getSize();
        const metrics = calculateMetrics(size.width, size.height, size.scale, size.stageHeightPx);
        const padding = metrics.borderPad * size.scale;
        const horizontal = metrics.horizontals["right"];
        const vertical = metrics.verticals["bottom"];
        const x = horizontal - this.game.width - padding;
        const y = vertical - (this.game.height + padding);

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

/** Prototype code below */

class PreloadBar extends Phaser.Group {
    constructor(game, barBgKey, barFillKey) {
        super(game);
        this._createBarBackground(barBgKey);
        this._createProgressBar(barFillKey);
    }

    setFillPercent(percent) {
        const cropRect = new Phaser.Rectangle(0, 0, this.barWidth * percent / 100, this.barFill.height);
        this.barFill.crop(cropRect);
    }

    _createBarBackground(barBgKey) {
        const barBg = this.game.add.image(0, 0, barBgKey);
        barBg.anchor.add(0.5, 0.5);
        this.addChild(barBg);
    }

    _createProgressBar(barFillKey) {
        this.barFill = this.game.add.image(0, 0, barFillKey);
        this.barWidth = this.barFill.width;
        this.barFill.x = -this.barFill.width / 2;
        this.barFill.anchor.add(0, 0.5);
        const cropRect = new Phaser.Rectangle(0, 0, this.barWidth, this.barFill.height);
        this.barFill.crop(cropRect, false);
        this.setFillPercent(0);
        this.addChild(this.barFill);
    }
}
