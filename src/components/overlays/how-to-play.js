/**
 * How To Play Screen.
 * @module components/how-to-play
 */

import fp from "../../lib/lodash/fp/fp.js";

import * as signal from "../../core/signal-bus.js";
import { GameAssets } from "../../core/game-assets.js";
import * as OverlayLayout from "../../lib/overlay-layout.js";

/**
 * @param {Phaser.Game} game - The Phaser Game instance
 */
export function create({ game }) {
    const screen = game.state.states[game.state.current];
    const keyLookup = screen.layoutFactory.keyLookups.howToPlay;
    const channel = "how-to-play-gel-buttons";

    screen.context.popupScreens.push("how-to-play");

    const overlayManager = OverlayLayout.create(screen);
    const backgroundImage = game.add.image(0, 0, keyLookup.background);
    const background = overlayManager.addBackground(backgroundImage);
    const disabledButtons = overlayManager.disableExistingButtons();
    const gelButtons = addGelButtons();
    addSignals();

    function addGelButtons() {
        const gelLayout = screen.layoutFactory.addLayout(["howToPlayBack", "audioOff", "settings"]);
        overlayManager.moveGelButtonsToTop(gelLayout);
        return gelLayout;
    }

    function addSignals() {
        signal.bus.subscribe({ channel, name: "back", callback: destroy });
    }

    function destroy() {
        signal.bus.removeChannel(channel);
        gelButtons.destroy();
        overlayManager.restoreDisabledButtons();
        background.destroy();
        screen.context.popupScreens = fp.pull("how-to-play", screen.context.popupScreens);
    }
}
