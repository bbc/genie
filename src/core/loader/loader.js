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

const getMissingPacks = (masterPack, keys) =>
    Object.keys(keys)
        .filter(key => key !== "default")
        .filter(key => key !== "boot")
        .filter(key => key !== "loader")
        .filter(key => !masterPack.hasOwnProperty(key));

export class Loader extends Screen {
    #loadbar;

    constructor() {
        loadPack.path = gmi.gameDir + gmi.embedVars.configPath;
        super({ key: "loader", pack: loadPack });
    }

    preload() {
        this.load.setBaseURL(gmi.gameDir);
        this.load.setPath(gmi.embedVars.configPath);
        const config = this.cache.json.get("config");
        this.setConfig(config);

        if (config.theme.game && config.theme.game.achievements === true) {
            this.load.json("achievements-data", "achievements/config.json");
        }

        const masterPack = this.cache.json.get("asset-master-pack");
        const gamePacksToLoad = ["gel/gel-pack"].concat(getMissingPacks(masterPack, this.scene.manager.keys));

        gamePacksToLoad.forEach(pack => this.load.pack(pack));
        this.load.addPack(masterPack);

        this.add.image(0, 0, "loader.background");
        this.add.image(0, -150, "loader.title");
        this.createLoadBar();
        this.createBrandLogo();

        this.load.on("progress", this.updateLoadBar.bind(this));
    }

    createLoadBar() {
        this.add.image(0, 0, "loader.loadbarBackground");
        this.#loadbar = this.add.image(0, 0, "loader.loadbar");
        this.updateLoadBar(0);
    }

    updateLoadBar = progress => {
        this.#loadbar.frame.cutWidth = this.#loadbar.width * progress;
        this.#loadbar.frame.updateUVs();

        if (window.__qaMode) {
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
        //GameSound.setButtonClickSound(this.game, "loader.buttonClick");
        if (this.context.config.theme.game && this.context.config.theme.game.achievements === true) {
            gmi.achievements.init(this.cache.json.get("achievements-data"));
        }

        this.navigation.next();
        gmi.sendStatsEvent("gameloaded", "true");
        gmi.gameLoaded();
    }
}
