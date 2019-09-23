/**
 *
 * @module core/navigation
 * @copyright BBC 2018
 * @author BBC Children's D+E
 * @license Apache-2.0
 */
import { buttonsChannel } from "./layout/gel-defaults.js";
import * as signal from "./signal-bus.js";

export const create = (gameState, context, layoutManager, navigationConfig) => {
    const goToScreen = (name, transientData) => {
        //P3 TODO is this line needed anymore? if so we need to pause in a new way
        //gameState.game.paused = false; // fixes IE11 and Edge "focus loss" bug when navigating screens
        signal.bus.removeChannel(buttonsChannel);
        layoutManager.removeAll();

        //TODO P3 how much of this is still needed?
        //gameState.start(name, true, false, transientData, layoutManager, context, navigation);
    };

    const navigation = navigationConfig(goToScreen);

    //TODO P3 these might just now be returned to be added to the starting scenes array - see spike NT
    //loadGenieScreens(navigation, gameState);

    //TODO P3 starting screen set in phaser config now. This might need removing. NT
    // goToScreen("loadscreen");

    return goToScreen;
};

const loadGenieScreens = (navigationConfig, gameState) => {
    Object.keys(navigationConfig).forEach(screen => {
        gameState.add(screen, navigationConfig[screen].state);
    });
};
