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
import fp from "../../../lib/lodash/fp/fp.js";

const getMissingPacks = (masterPack, keys) =>
    Object.keys(keys)
        .filter(key => key !== "default")
        .filter(key => key !== "boot")
        .filter(key => key !== "loader")
        .filter(key => !masterPack.hasOwnProperty(key))
        .map(key => `asset-packs/${key}`);

export class Loader extends Screen {
    constructor() {
        loadPack.path = gmi.gameDir + gmi.embedVars.configPath;
        super({ key: "loader", pack: loadPack });
        this._loadbar = undefined;
        this._progress = 0;
    }

    getConfig() {
        const configFile = this.cache.json.get("config/files").config;
        const keys = configFile.files.map(file => configFile.prefix + file.key);
        const entries = keys.map(key => this.cache.json.get(key));

        return entries.reduce((acc, entry) => fp.merge(acc, entry), {});
    }

    preload() {
        this.load.setBaseURL(gmi.gameDir);
        this.load.setPath(gmi.embedVars.configPath);

        const config = this.getConfig();
        this.setConfig(config);

        if (config.theme.game && config.theme.game.achievements === true) {
            this.load.json5({
                key: "achievements-data",
                url: "achievements/config.json5",
            });
        }

        const masterPack = this.cache.json.get("asset-master-pack");
        const gamePacksToLoad = ["gel/gel-pack"].concat(getMissingPacks(masterPack, this.scene.manager.keys));

        gamePacksToLoad.forEach(pack => this.load.pack(pack));
        this.load.addPack(masterPack);

        this.add.image(0, 0, "loader.background");
        this.add.image(0, -120, "loader.title");

        this.createLoadBar();
        this.createBrandLogo();

        this.load.on("progress", this.updateLoadBar.bind(this));
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
        const x = metrics.horizontals.right - metrics.borderPad / metrics.scale;
        const y = metrics.verticals.bottom - metrics.borderPad / metrics.scale;
        this.brandLogo = this.add.image(x, y, "loader.brandLogo");
        this.brandLogo.setOrigin(1, 1);
    }

    create() {
        GameSound.setButtonClickSound(this.scene.scene, "loader.buttonClick");
        if (this.context.config.theme.game && this.context.config.theme.game.achievements === true) {
            gmi.achievements.init(this.cache.json.get("achievements-data"));
        }
        this.navigation.next();
        gmi.sendStatsEvent("gameloaded", "true");
        gmi.gameLoaded();
    }
}
