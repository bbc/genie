/**
 * Pause is an overlay screen created every time the pause button is pressed.
 * It tears itself down again on close.
 *
 * @module components/pause
 */
import fp from "../../lib/lodash/fp/fp.js";

import * as signal from "../core/signal-bus.js";
import { GameAssets } from "../core/game-assets.js";

/**
 * @param {Phaser.Game} game - The Phaser Game instance
 */
export function create({ game }) {
    const screen = game.state.states[game.state.current];
    const backgroundPriorityID = 999;
    const priorityID = backgroundPriorityID + screen.context.popupScreens.length;
    const channel = "pause-gel-buttons";
    pauseGame();

    const background = addBackground();
    const disabledButtons = disableExistingButtons();
    const gelButtons = addGelButtons();

    addSignals();

    function pauseGame() {
        game.paused = true;
        game.sound.unsetMute();
        GameAssets.sounds.backgroundMusic.mute = true;
        screen.context.popupScreens.push("pause");
    }

    function addBackground() {
        const keyLookup = screen.layoutFactory.keyLookups.pause;
        const backgroundImage = game.add.image(0, 0, keyLookup.pauseBackground);
        backgroundImage.inputEnabled = true;
        backgroundImage.input.priorityID = priorityID - 1;
        return screen.layoutFactory.addToBackground(backgroundImage);
    }

    function disableExistingButtons() {
        let disabledButtons = [];
        fp.forOwn(layout => {
            fp.forOwn(button => {
                if (button.input.enabled) {
                    button.input.enabled = false;
                    disabledButtons.push(button);
                    button.update();
                }
            }, layout.buttons);
        }, screen.layoutFactory.getLayouts());
        return disabledButtons;
    }

    function restoreDisabledButtons() {
        fp.forOwn(button => {
            button.input.enabled = true;
        }, disabledButtons);
    }

    function moveButtonsToTop(gelLayout) {
        fp.forOwn(button => {
            button.input.priorityID = priorityID;
            button.parent.updateTransform();
            button.parent.parent.updateTransform();
            button.update();
        }, gelLayout.buttons);
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
        moveButtonsToTop(gelLayout);
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
        restoreDisabledButtons();
        background.destroy();
        GameAssets.sounds.backgroundMusic.mute = false;
        screen.context.popupScreens = fp.pull("pause", screen.context.popupScreens);
    }

    function restartGame() {
        destroy();
        screen.next({ transient: { restart: true } });
    }

    function goHome() {
        destroy();
        screen.next({ transient: { home: true } });
    }
}
