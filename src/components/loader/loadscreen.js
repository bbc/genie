/**
 * Loadscreen loads in the game's assets.
 *
 * @module components/loadscreen
 * @copyright BBC 2018
 * @author BBC Children's D+E
 * @license Apache-2.0
 */

import _ from "../../../lib/lodash/lodash.js";
import { Screen } from "../../core/screen.js";
import { createLoadBar } from "./loadbar.js";
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
        const config = this.cache.json.get("config");

        //sets the context as setter
        this.context = {
            config,
            popupScreens: [],
            gameMuted: true,
        };

        const masterPack = this.cache.json.get("asset-master-pack");
        const gamePacksToLoad = ["gel/gel-pack"].concat(getMissingPacks(masterPack, this.scene.manager.keys));

        //TODO P3 delete once complete [NT]
        console.log("gamePacksToLoad", gamePacksToLoad);

        this.load.addPack(masterPack);
        gamePacksToLoad.forEach(pack => this.load.pack(pack));

        this.add.image(0, 0, "loadscreen.background");
        this.add.image(0, -150, "loadscreen.title");
        this.createLoadBar();
        this.createBrandLogo();

        this.load.on("progress", this.updateLoadBar.bind(this));
        this.load.on("complete", this.loadComplete);
    }

    loadComplete = () => {
        // P3 TODO is this needed anymore? KeyLookup are not a thing now...
        //if (window.__qaMode) {
        //   dumpToConsole(keyLookups);
        //}
        //GameSound.setButtonClickSound(this.game, "loadscreen.buttonClick");

        this.switchScene("home");

        gmi.gameLoaded();
        //sendStats("game_loaded");
    };

    createLoadBar() {
        this.add.image(0, 0, "loadscreen.loadbarBackground");
        this.#loadbar = this.add.image(0, 0, "loadscreen.loadbar");
        this.updateLoadBar(0);
    }

    updateLoadBar = progress => {
        this.#loadbar.frame.cutWidth = this.#loadbar.width * progress;
        this.#loadbar.frame.updateUVs();
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
    create() {}

    //create() {
    //    this.createBackground();
    //    this.createTitle();
    //    this.createLoadingBar();
    //    this.createBrandLogo();
    //}

    updateLoadProgress(progress) {
        if (this.hasOwnProperty("loadingBar")) this.loadingBar.fillPercent = progress;
        if (window.__qaMode) {
            console.log("Loader progress:", progress); // eslint-disable-line no-console
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
