/**
 * Pause is an overlay screen created every time the pause button is pressed.
 * It tears itself down again on close.
 *
 * @module components/overlays/pause
 */
import fp from "../../lib/lodash/fp/fp.js";

import * as signal from "../../core/signal-bus.js";
import { GameAssets } from "../../core/game-assets.js";
import * as OverlayLayout from "../../components/overlays/overlay-layout.js";

/**
 * @param {Phaser.Game} game - The Phaser Game instance
 */
export function create({ game }) {
    const screen = game.state.states[game.state.current];
    const keyLookup = screen.layoutFactory.keyLookups.pause;
    const channel = "pause-gel-buttons";

    pauseGame();

    const overlayLayout = OverlayLayout.create(screen);
    const backgroundImage = game.add.image(0, 0, keyLookup.pauseBackground);
    const background = overlayLayout.addBackground(backgroundImage);
    const gelButtons = addGelButtons();

    addSignals();

    function pauseGame() {
        game.paused = true;
        game.sound.unsetMute();
        GameAssets.sounds.backgroundMusic.mute = true;
        screen.context.popupScreens.push("pause");
    }

    function addGelButtons() {
        const gelLayout = screen.layoutFactory.addLayout([
            "pauseHome",
            "audioOff",
            "settings",
            "pauseReplay",
            "pausePlay",
            "howToPlay",
        ]);
        overlayLayout.moveGelButtonsToTop(gelLayout);
        return gelLayout;
    }

    function addSignals() {
        signal.bus.subscribe({ channel, name: "play", callback: destroy });
        signal.bus.subscribe({ channel, name: "replay", callback: restartGame });
        signal.bus.subscribe({ channel, name: "home", callback: goHome });
    }

    function destroy() {
        game.paused = false;
        signal.bus.removeChannel(channel);
        gelButtons.destroy();
        overlayLayout.restoreDisabledButtons();
        background.destroy();
        GameAssets.sounds.backgroundMusic.mute = false;
        screen.context.popupScreens = fp.pull("pause", screen.context.popupScreens);
    }

    function restartGame() {
        destroy();
        screen.navigation.restart(screen.transientData);
    }

    function goHome() {
        destroy();
        screen.navigation.home();
    }
}
