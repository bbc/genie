import { Home } from "./components/home.js";
import { Loadscreen } from "./components/loadscreen.js";
import { Results } from "./components/results.js";
import { Select } from "./components/select.js";
import { GameTest } from "./components/test-harness/test-screens/game.js";
import { settingsChannel } from "./core/settings.js";
import * as signal from "./core/signal-bus.js";
import { startup } from "./core/startup.js";

const settingsConfig = {
    pages: [
        {
            title: "Global Settings",
            settings: [
                {
                    key: "audio",
                    type: "toggle",
                    title: "Audio",
                    description: "Turn off/on sound and music",
                },
                {
                    key: "custom1",
                    type: "toggle",
                    title: "Custom 1",
                    description: "Switch custom message",
                },
            ],
        },
    ],
};

signal.bus.subscribe({
    channel: settingsChannel,
    name: "custom1",
    callback: value => {
        console.log("Custom 1 setting changed to " + value);
    },
});

const navigationConfig = goToScreen => {
    const home = data => goToScreen("home", data);
    const characterSelect = data => goToScreen("character-select", data);
    const game = data => goToScreen("game", data);
    const results = data => goToScreen("results", data);

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
            },
        },
        "character-select": {
            state: Select,
            routes: {
                next: game,
                home: home,
                restart: home,
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
            },
        },
    };
};

startup(settingsConfig, navigationConfig);
