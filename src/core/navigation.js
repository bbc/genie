/**
 *
 * @module core/navigation
 */
import { buttonsChannel } from "./layout/gel-defaults.js";
import * as signal from "./signal-bus.js";

export const create = (gameState, context, scene, navigationConfig) => {
    const goToScreen = (name, transientData) => {
        signal.bus.removeChannel(buttonsChannel);
        scene.removeAll();
        gameState.game.canvas.focus();
        gameState.start(name, true, false, transientData, scene, context, navigation);
    };

    const navigation = navigationConfig(goToScreen);

    loadGenieScreens(navigation, gameState);

    goToScreen("loadscreen");
};

const loadGenieScreens = (navigationConfig, gameState) => {
    Object.keys(navigationConfig).forEach(screen => {
        gameState.add(screen, navigationConfig[screen].state);
    });
};
