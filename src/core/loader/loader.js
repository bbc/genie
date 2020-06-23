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
import * as Assets from "./assets.js";
import JSON5 from "/node_modules/json5/dist/index.mjs";

const getMissingPacks = (masterPack, keys) =>
    Object.keys(keys)
        .filter(key => ["default", "boot", "loader", "debug"].indexOf(key) === -1)
        .filter(key => !masterPack.hasOwnProperty(key))
        .map(key => `asset-packs/${key}`);

export class Loader extends Screen {
    constructor() {
        loadPack.path = gmi.gameDir + gmi.embedVars.configPath;
        super({ key: "loader", pack: loadPack });
        this._loadbar = undefined;
        this._progress = 0;
    }

    preload() {
        this.load.setBaseURL(gmi.gameDir);
        this.load.setPath(gmi.embedVars.configPath);

        const config = getConfig(this, "config/files");
        this.setConfig(config);

        const masterPack = this.cache.json.get("asset-master-pack");
        const debugPack = isDebug() ? ["../../debug/debug-pack"] : [];
        const gamePacksToLoad = ["gel/gel-pack"].concat(
            getMissingPacks(masterPack, this.scene.manager.keys),
            debugPack,
        );

        gamePacksToLoad.forEach(pack => this.load.pack(pack));
        this.load.addPack(masterPack);

        this.add.image(0, 0, "loader.background");
        this.add.image(0, -120, "loader.title");

        this.createLoadBar();
        this.createBrandLogo();

        Assets.download().then(assets => {
            const achievementConfig = assets
                .filter(asset => asset.name === "./achievements/config.json5")[0]
                .readAsString();
            GameSound.setButtonClickSound(this.scene.scene, "loader.buttonClick");
            if (this.context.config.theme.game && this.context.config.theme.game.achievements === true) {
                gmi.achievements.init(JSON5.parse(achievementConfig));
            }
            gmi.sendStatsEvent("gameloaded", "true");
            gmi.gameLoaded();
            this.transientData.getAsset = path => assets.filter(asset => asset.name === path).pop();
            this.navigation.next();
        });
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
