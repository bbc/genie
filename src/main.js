/**
 * @copyright BBC 2018
 * @author BBC Children's D+E
 * @license Apache-2.0
 */
import { Home } from "./components/home.js";
import { Loadscreen } from "./components/loadscreen.js";
import { Results } from "./components/results.js";
import { Select } from "./components/select.js";
import { phaserTestHarnessConfig } from "./components/test-harness/test-harness-main.js";
import { GameTest } from "./components/test-harness/test-screens/game.js";
import { parseUrlParams } from "./core/parseUrlParams.js";
import { settingsChannel } from "./core/settings.js";
import * as signal from "./core/signal-bus.js";
import { startup } from "./core/startup.js";

const settingsConfig = {
    pages: [
        {
            title: "Custom Settings",
            settings: [
                {
                    key: "custom1",
                    type: "toggle",
                    title: "Custom setting",
                    description: "Description of custom setting",
                },
            ],
        },
    ],
};

signal.bus.subscribe({
    channel: settingsChannel,
    name: "custom1",
    callback: value => {
        console.log("Custom 1 setting changed to " + value); // eslint-disable-line no-console
    },
});

const navigationConfig = goToScreen => {
    if (parseUrlParams(window.location.search).sanityCheck === true) {
        return phaserTestHarnessConfig(goToScreen);
    }

    const home = data => goToScreen("home", data);
    const characterSelect = data => goToScreen("character-select", data);
    const levelSelect = data => goToScreen("level-select", data);
    const game = data => goToScreen("game", data);
    const results = data => goToScreen("results", data);
    const achievements = data => { //eslint-disable-line
        //TODO re-enable line below / remove eslint disable on line above once achievements screen is available
        //goToScreen("achievements", data);
    };

    return {
        loadscreen: {
            state: Loadscreen,
            routes: {
                next: home,
            },
        },
        home: {
            state: Home,
            routes: {
                next: characterSelect,
                achievements: achievements,
            },
        },
        "character-select": {
            state: Select,
            routes: {
                next: levelSelect,
                home: home,
                restart: home,
                achievements: achievements,
            },
        },
        "level-select": {
            state: Select,
            routes: {
                next: game,
                home: home,
                restart: home,
                achievements: achievements,
            },
        },
        game: {
            state: GameTest,
            routes: {
                next: results,
                home: home,
                restart: game,
            },
        },
        results: {
            state: Results,
            routes: {
                next: home,
                game: game,
                restart: game,
                home: home,
                achievements: achievements,
            },
        },
    };
};

startup(settingsConfig, navigationConfig);
