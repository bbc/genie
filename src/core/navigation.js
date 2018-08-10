/**
 *
 * @module core/navigation
 */
import { buttonsChannel } from "./layout/gel-defaults.js";
import * as signal from "./signal-bus.js";

export const create = (gameState, context, scene, navigationConfig) => {
    const goToScreen = (name, transientData) => {
        gameState.game.paused = false; // fixes IE11 and Edge "focus loss" bug when navigating screens
        signal.bus.removeChannel(buttonsChannel);
        scene.removeAll();
        gameState.start(name, true, false, transientData, scene, context, navigation);
    };

    const navigation = navigationConfig(goToScreen);

    loadGenieScreens(navigation, gameState);

    goToScreen("loadscreen");

    return goToScreen;
};

const loadGenieScreens = (navigationConfig, gameState) => {
    Object.keys(navigationConfig).forEach(screen => {
        gameState.add(screen, navigationConfig[screen].state);
    });
};
