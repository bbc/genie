import { startup } from "./core/startup.js";
import { settings } from "./core/settings.js";
import { Loadscreen } from "./components/loadscreen.js";
import { Home } from "./components/home.js";
import { Select } from "./components/select.js";
import { GameTest } from "./components/test-harness/test-screens/game.js";
import { Results } from "./components/results.js";

settings.setCloseCallback(() => {
    //Called when settings screen has been closed
    console.log("Settings Closed");
});

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

settings.add("custom1", value => {
    //Example of custom setting callback
    console.log("custom 1 setting changed to: " + value);
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
