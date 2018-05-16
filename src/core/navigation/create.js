import { loadGenieScreens } from "./load-genie-screens.js";
import { gotoScreenWithData } from "./goto-screen-with-data.js";
import { loadNavigation } from "../navigation.js";

export const create = (gameState, context, layoutFactory) => {
    const gotoScreen = (name, transientData) => {
        gotoScreenWithData(name, transientData, gameState, layoutFactory, context, navigation);
    }
    const home       = transientData => gotoScreen("home", transientData);
    const select     = transientData => gotoScreen("character-select", transientData);
    const gamescreen = transientData => gotoScreen("game", transientData);
    const results    = transientData => gotoScreen("results", transientData);
    const navigation = loadNavigation(home, select, gamescreen, results);

    loadGenieScreens(navigation, gameState);

    gotoScreen("loadscreen");
};
