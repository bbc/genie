/**
 * Loadscreen loads in the game's assets.
 *
 * @module components/loadscreen
 * @copyright BBC 2019
 * @author BBC Children's D+E
 * @license Apache-2.0
 */
import { Screen } from "../../core/screen.js";
import * as Scaler from "../../core/scaler.js";
import * as GameSound from "../../core/game-sound.js";
import { gmi } from "../../core/gmi/gmi.js";
import { loadscreenPack } from "./loadpack.js";

const getMissingPacks = (masterPack, keys) =>
    Object.keys(keys)
        .filter(key => key !== "default")
        .filter(key => key !== "boot")
        .filter(key => !masterPack.hasOwnProperty(key));

export class Loadscreen extends Screen {
    #loadbar;

    constructor() {
        loadscreenPack.path = gmi.gameDir + gmi.embedVars.configPath;
        super({ key: "loadscreen", autostart: false, pack: loadscreenPack });
    }

    preload() {
        this.load.setBaseURL(gmi.gameDir);
        this.load.setPath(gmi.embedVars.configPath);
        this.setConfig(this.cache.json.get("config"));

        const masterPack = this.cache.json.get("asset-master-pack");
        const gamePacksToLoad = ["gel/gel-pack"].concat(getMissingPacks(masterPack, this.scene.manager.keys));

        this.load.addPack(masterPack);
        gamePacksToLoad.forEach(pack => this.load.pack(pack));

        this.add.image(0, 0, "loadscreen.background");
        this.add.image(0, -150, "loadscreen.title");
        this.createLoadBar();
        this.createBrandLogo();

        this.load.on("progress", this.updateLoadBar.bind(this));
    }

    createLoadBar() {
        this.add.image(0, 0, "loadscreen.loadbarBackground");
        this.#loadbar = this.add.image(0, 0, "loadscreen.loadbar");
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
        //TODO P3 move logo to correct position NT
        //const metrics = Scaler.getMetrics();
        //
        //const x = metrics.horizontals.right - metrics.borderPad / metrics.scale;
        //const y = metrics.verticals.bottom - metrics.borderPad / metrics.scale;
        this.brandLogo = this.add.image(0, 0, "loadscreen.brandLogo");
        //this.brandLogo.right = x;
        //this.brandLogo.bottom = y;
    }

    //TODO P3 stubbed this for now NT
    create() {
        //GameSound.setButtonClickSound(this.game, "loadscreen.buttonClick");

        this.navigate("next");

        gmi.gameLoaded();
        //sendStats("game_loaded");
    }
}
