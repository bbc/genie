import { Loadscreen } from "../../components/loadscreen.js";
import { Home } from "../../components/home.js";
import { Select } from "../../components/select.js";
import { GameTest } from "../../components/test-harness/test-screens/game.js";
import { Results } from "../../components/results.js";

export const loadGenieScreens = (navigation, gameState) => {
    const states = {
        "loadscreen": Loadscreen,
        "home": Home,
        "character-select": Select,
        "game": GameTest,
        "results": Results,
    };

    Object.keys(navigation).forEach(screen => {
        if (screen === "init") {
            return false;
        }

        gameState.add(screen, states[screen]);
    });
}
