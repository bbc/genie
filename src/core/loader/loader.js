/**
 * Loadscreen loads in the game's assets.
 *
 * @module components/loadscreen
 * @copyright BBC 2019
 * @author BBC Children's D+E
 * @license Apache-2.0
 */
import { Screen } from "../screen.js";
import * as Scaler from "../scaler.js";
import * as GameSound from "../game-sound.js";
import { gmi } from "../gmi/gmi.js";
import { loadPack } from "./loadpack.js";
import { getConfig } from "./get-config.js";
import { isDebug } from "../debug/debug-mode.js";
import JSON5 from "/node_modules/json5/dist/index.mjs";

const getMissingPacks = (masterPack, keys) =>
    Object.keys(keys)
        .filter(key => ["default", "boot", "loader", "debug"].indexOf(key) === -1)
        .filter(key => !masterPack.hasOwnProperty(key))
        .map(key => `asset-packs/${key}`);

export class Loader extends Screen {
    constructor(assets) {
        super({ key: "loader", pack: loadPack(assets) });
        this._loadbar = undefined;
        this._progress = 0;
        this.assets = assets;
    }

    preload() {
        this.load.setBaseURL(gmi.gameDir);
        this.load.setPath(gmi.embedVars.configPath);

        const config = getConfig(this.assets, "config/files");
        this.setConfig(config);
        this.getAssets();
    }

    parsePack(pack, assets) {
        for (const key in pack) {
            pack[key].files &&
                (pack[key].files = pack[key].files.map(file => {
                    file.url &&
                        (file.url = assets
                            .filter(asset => asset.name === `./${file.url}`)
                            .pop()
                            .getBlobUrl());
                    file.jsonURL &&
                        (file.jsonURL = assets
                            .filter(asset => asset.name === `./${file.jsonURL}`)
                            .pop()
                            .getBlobUrl());
                    file.atlasURL &&
                        (file.atlasURL = assets
                            .filter(asset => asset.name === `./${file.atlasURL}`)
                            .pop()
                            .getBlobUrl());
                    return file;
                }));
        }
    }

    getAsset(path) {
        return this.assets.filter(asset => asset.name === `./${path}`).pop();
    }

    getAssets() {
        const getAsset = path => this.assets.filter(asset => asset.name === path).pop();
        const achievementConfig = getAsset("./achievements/config.json5").readAsString();
        if (this.context.config.theme.game && this.context.config.theme.game.achievements === true) {
            gmi.achievements.config = JSON5.parse(achievementConfig);
            gmi.achievements.init(gmi.achievements.config);
        }

        const masterPack = JSON.parse(getAsset("./asset-packs/asset-master-pack.json").readAsString());
        const debugPack = isDebug() ? ["../../debug/debug-pack"] : [];
        const gamePacksToLoad = ["gel/gel-pack"].concat(getMissingPacks(masterPack, this.scene.manager.keys));

        this.load.setBaseURL();
        this.load.setPath();

        const gamePacks = gamePacksToLoad.map(packName => JSON.parse(getAsset(`./${packName}.json`).readAsString()));
        gamePacks.forEach(pack => {
            this.parsePack(pack, this.assets);
            this.load.addPack(pack);
        });
        this.parsePack(masterPack, this.assets);
        this.load.addPack(masterPack);
        this.load.pack(debugPack);

        this.add.image(0, 0, "loader.background");
        this.add.image(0, -120, "loader.title");

        this.createLoadBar();
        this.createBrandLogo();
    }

    create() {
        GameSound.setButtonClickSound(this.scene.scene, "loader.buttonClick");
        gmi.sendStatsEvent("gameloaded", "true");
        gmi.gameLoaded();
        this.navigation.next();
    }

    createLoadBar() {
        this.add.image(0, 130, "loader.loadbarBackground");
        this._loadbar = this.add.image(0, 130, "loader.loadbar");
        this.updateLoadBar(0);
    }

    updateLoadBar = progress => {
        if (progress >= this._progress) {
            this._progress = progress;
            this._loadbar.frame.cutWidth = this._loadbar.width * progress;
            this._loadbar.frame.updateUVs();
        }
        if (window.__debug) {
            console.log("Loader progress:", progress); // eslint-disable-line no-console
        }
    };

    createBrandLogo() {
        const metrics = Scaler.getMetrics();
        const x = metrics.horizontals.right - metrics.horizontalBorderPad / metrics.scale;
        const y = metrics.verticals.bottom - metrics.verticalBorderPad / metrics.scale;
        this.brandLogo = this.add.image(x, y, "loader.brandLogo");
        this.brandLogo.setOrigin(1, 1);
    }
}
