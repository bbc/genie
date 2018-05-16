import { Loadscreen } from "../components/loadscreen.js";
import { Home } from "../components/home.js";
import { Select } from "../components/select.js";
import { GameTest } from "../components/test-harness/test-screens/game.js";
import { Results } from "../components/results.js";
import * as signal from "./signal-bus.js";

export const create = initialScreensData => {
    const loadscreen = transientData => gotoScreen("loadscreen", transientData);
    const home       = transientData => gotoScreen("home", transientData);
    const select     = transientData => gotoScreen("character-select", transientData);
    const game       = transientData => gotoScreen("game", transientData);
    const results    = transientData => gotoScreen("results", transientData);

    initialScreensData.screens = {
        "init": {
            next: loadscreen,
        },
        "loadscreen": {
            next: home,
        },
        "home": {
            next: select,
        },
        "character-select": {
            next: game,
            home: home,
            restart: home,
        },
        "game": {
            next: results,
            home: home,
            restart: game,
        },
        "results": {
            next: home,
            game: game,
            restart: game,
            home: home,
        },
    };

    const states = {
        "loadscreen": Loadscreen,
        "home": Home,
        "character-select": Select,
        "game": GameTest,
        "results": Results,
    };

    // only add screens that are in screens object
    Object.keys(initialScreensData.screens).forEach(screen => {
        if (screen === "init") {
            return false;
        }

        initialScreensData.game.state.add(screen, states[screen]);
    });

    const gotoScreen = (name, transientData) => {
        signal.bus.removeChannel("gel-buttons");
        initialScreensData.layoutFactory.removeAll();
        initialScreensData.game.state.start(name, true, false, initialScreensData, transientData);
    };

    return { screens: initialScreensData.screens };
};
