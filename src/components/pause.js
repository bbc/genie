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
 * @param {Screen} screen - The current screen (underneath the pause overlay)
 */

export function create(game, screen) {
    pauseGame();

    const background = addBackground();
    const gelButtons = addGelButtons();

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
            "home",
            "audioOff",
            "settings",
            "play",
            "restart",
            "howToPlay",
        ]);
        moveButtonsToTop(gelLayout);
        return gelLayout;
    }

    function addSignals() {
        signal.bus.subscribe({ name: "GEL-play", callback: destroy });
        signal.bus.subscribe({ name: "GEL-restart", callback: restartGame });
        signal.bus.subscribe({ name: "GEL-home", callback: goHome });
    }

    function destroy() {
        gelButtons.destroy();
        background.destroy();
        game.paused = false;
        game.sound.resumeAll();
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
