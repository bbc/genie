import { Loadscreen } from "../../components/loadscreen.js";
import { Home } from "../../components/home.js";
import { Select } from "../../components/select.js";
import { GameTest } from "../../components/test-harness/test-screens/game.js";
import { Results } from "../../components/results.js";

const allPossibleStates = {
    "loadscreen": Loadscreen,
    "home": Home,
    "character-select": Select,
    "game": GameTest,
    "results": Results,
};

export const loadGenieScreens = (navigation, gameState) => {
    Object.keys(navigation).forEach(screen => {
        gameState.add(screen, allPossibleStates[screen]);
    });
}
