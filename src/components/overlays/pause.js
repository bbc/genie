/**
 * Pause is an overlay screen created every time the pause button is pressed.
 * It tears itself down again on close.
 *
 * @module components/overlays/pause
 */
import fp from "../../../lib/lodash/fp/fp.js";

import * as signal from "../../core/signal-bus.js";
import { GameAssets } from "../../core/game-assets.js";
import * as OverlayLayout from "../../components/overlays/overlay-layout.js";

/**
 * @param {Phaser.Game} game - The Phaser Game instance
 */
export function create({ game }, hideReplayButton) {
    const screen = game.state.states[game.state.current];
    const channel = "pause-gel-buttons";

    pauseGame();

    const overlayLayout = OverlayLayout.create(screen);
    const backgroundImage = game.add.image(0, 0, "pause.pauseBackground");
    const background = overlayLayout.addBackground(backgroundImage);
    const gelButtons = addGelButtons();

    addSignals();

    function pauseGame() {
        game.paused = true;
        GameAssets.sounds.backgroundMusic.pause();
        screen.context.popupScreens.push("pause");
    }

    function addGelButtons() {
        const gelButtonList = ["pauseHome", "audioOff", "settings", "pausePlay", "howToPlay"];
        if (!hideReplayButton) {
            gelButtonList.unshift("pauseReplay");
        }

        const gelLayout = screen.scene.addLayout(gelButtonList);
        overlayLayout.moveGelButtonsToTop(gelLayout);
        return gelLayout;
    }

    function addSignals() {
        signal.bus.subscribe({ channel, name: "play", callback: destroy });
        signal.bus.subscribe({ channel, name: "home", callback: goHome });
        if (!hideReplayButton) {
            signal.bus.subscribe({ channel, name: "replay", callback: restartGame });
        }
    }

    function destroy() {
        game.paused = false;
        signal.bus.removeChannel(channel);
        gelButtons.destroy();
        overlayLayout.restoreDisabledButtons();
        background.destroy();
        game.canvas.focus();
        GameAssets.sounds.backgroundMusic.resume();
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
