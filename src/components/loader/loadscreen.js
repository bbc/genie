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

export class Loadscreen extends Screen {
    /**
     * Placeholder Loadscreen for development
     * Example Usage
     */
    constructor() {
        loadscreenPack.path = gmi.gameDir + gmi.embedVars.configPath;
        super({ key: "loadscreen", autostart: false, pack: loadscreenPack });
    }

    getMissingPacks() {
        //TODO P3 To make this work the json has to be loaded in startup. It is also loaded as part of the asset load
        //TODO P3 Potentially this could be moved so it is only loaded once NT
        const masterPack = this.cache.json.get("asset-master-pack");

        const missingKeys = Object.keys(this.scene.manager.keys)
            .filter(key => key !== "default")
            .filter(key => key !== "startup")
            .filter(key => !masterPack.hasOwnProperty(key));

        return missingKeys;
    }

    preload() {
        const theme = gmi.embedVars.configPath;
        const path = theme.split(/([^/]+$)/, 2)[0];
        this.load.setBaseURL(gmi.gameDir);

        this.load.setPath(path); //config dir

        const masterPack = this.cache.json.get("asset-master-pack");
        const gamePacksToLoad = ["gel/gel-pack"].concat(this.getMissingPacks());

        //TODO P3 delete once complete NT
        console.log("gamePacksToLoad", gamePacksToLoad);

        this.load.addPack(masterPack);
        gamePacksToLoad.forEach(pack => this.load.pack(pack));

        this.add.image(0, 0, "loadscreen.background");
        this.add.image(0, -150, "loadscreen.title");
        this.createLoadBar();
        this.createBrandLogo();
        this.load.on("progress", this.update);

        this.load.on(
            "complete",
            function() {
                console.log("LOAD COMPLETE");

                // P3 TODO is this needed anymore? KeyLookup are not a thing now...
                //if (window.__qaMode) {
                //   dumpToConsole(keyLookups);
                //}
                //GameSound.setButtonClickSound(this.game, "loadscreen.buttonClick");

                //this.scene.start("home", {})  // navigation.next?
                //this.switchScene("home");

                //P3 TODO most of navigation can go - passing in "this" usually illustrates we can add this as a method
                // We can probably trim navigation down to just the config and pass it around.
                //this.navigation.next(this, this.scene.settings.data);

                ////////TODO
                //this.switchScene("next");
                this.switchScene("home");

                //gmi.gameLoaded();
                //sendStats("game_loaded");
            }.bind(this),
        );

        //TODO P3 this is the old preload. Here for ref until we are happy then can be deleted NT
        //loadAssets(
        //    this.game,
        //    gamePacksToLoad,
        //    loadscreenPack,
        //    this.updateLoadProgress.bind(this),
        //    this.context.config.theme,
        //).then(keyLookups => {
        //    if (window.__qaMode) {
        //        dumpToConsole(keyLookups);
        //    }
        //    GameSound.setButtonClickSound(this.game, "loadscreen.buttonClick");
        //
        //    if (this.context.config.theme.game && this.context.config.theme.game.achievements === true) {
        //        gmi.achievements.init(this.game.cache.getJSON("achievementsData"));
        //    }
        //    gmi.sendStatsEvent("gameloaded", "true");
        //    gmi.gameLoaded();
        //    this.navigation.next();
        //});
    }

    createBackground() {
        this.layoutManager.addToBackground(this.game.add.image(0, 0, "loadscreenBackground"));
    }

    createTitle() {
        this.layoutManager.addToBackground(this.game.add.image(0, -150, "loadscreenTitle"));
    }

    createLoadBar() {
        // create bar background
        this.add.image(0, 0, "loadscreen.loadbarBackground");
        const loadbar = this.add.image(0, 0, "loadscreen.loadbar");
        const loadbarWidth = loadbar.width;

        //TODO P3 Should potentially be a class method?
        this.update = function(progress) {
            loadbar.frame.cutWidth = loadbarWidth * progress;
            loadbar.frame.updateUVs();
        }.bind(this);

        this.update(0);
    }

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
