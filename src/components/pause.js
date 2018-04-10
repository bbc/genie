/**
 * Pause is an overlay screen created every time the pause button is pressed.
 * It tears itself down again on close.
 *
 * @module components/pause
 */
import fp from "../lib/lodash/fp/fp.js";

import * as signal from "../core/signal-bus.js";

/**
 * @param {Phaser.Game} game - The Phaser Game instance
 */
export function create({ game }) {
    const screen = game.state.states[game.state.current];
    pauseGame();

    const background = addBackground();
    const gelButtons = addGelButtons();
    const channel = "pause-gel-buttons";

    addSignals();

    function pauseGame() {
        game.sound.pauseAll();
        screen.context.popupScreens.push("pause");
        game.paused = true;
    }

    function addBackground() {
        const keyLookup = screen.layoutFactory.keyLookups.pause;
        const backgroundImage = game.add.image(0, 0, keyLookup.pauseBackground);
        return screen.layoutFactory.addToBackground(backgroundImage);
    }

    function moveButtonsToTop(gelLayout) {
        const priorityID = 999;
        fp.forOwn(button => {
            button.input.priorityID = priorityID + screen.context.popupScreens.length;
        }, gelLayout.buttons);
    }

    function addGelButtons() {
        const gelLayout = screen.layoutFactory.addLayout([
            "pauseHome",
            "audioOff",
            "settings",
            "play",
            "restart",
            "howToPlay",
        ], channel);
        moveButtonsToTop(gelLayout);
        return gelLayout;
    }

    function addSignals() {
        signal.bus.subscribe({ channel, name: "play", callback: destroy });
        signal.bus.subscribe({ channel, name: "restart", callback: restartGame });
        signal.bus.subscribe({ channel, name: "home", callback: goHome });
    }

    function destroy() {
        game.paused = false;
        signal.bus.removeChannel(channel);
        //gelButtons.destroy();
        background.destroy();
        game.sound.resumeAll();
        screen.context.popupScreens = fp.pull("pause", screen.context.popupScreens);
    }

    function restartGame() {
        destroy();
        screen.next({ transient: { restart: true } });
    }

    function goHome() {
        console.log("going home!!");
        destroy();
        screen.next({ transient: { home: true } });
    }
}
