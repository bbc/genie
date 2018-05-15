import { Loadscreen } from "../components/loadscreen.js";
import { Home } from "../components/home.js";
import { Select } from "../components/select.js";
import { GameTest } from "../components/test-harness/test-screens/game.js";
import { Results } from "../components/results.js";
import * as signal from "./signal-bus.js";

export const create = data => {
    const loadscreen = () => gotoScreen("loadscreen");
    const home = () => gotoScreen("home");
    const select = () => gotoScreen("character-select");
    const game = () => gotoScreen("game");
    const results = () => gotoScreen("results");

    data.screens = {
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
    Object.keys(data.screens).forEach(screen => {
        if (screen === "init") {
            return false;
        }

        data.game.state.add(screen, states[screen]);
    });

    const gotoScreen = (name) => {
        signal.bus.removeChannel("gel-buttons");
        data.layoutFactory.removeAll();
        data.game.state.start(name, true, false, data);
    };

    return { screens: data.screens };
};
