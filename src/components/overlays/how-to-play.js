/**
 * How To Play Screen.
 * @module components/overlays/how-to-play
 */

import fp from "../../lib/lodash/fp/fp.js";

import * as signal from "../../core/signal-bus.js";
import * as OverlayLayout from "../../components/overlays/overlay-layout.js";

/**
 * @param {Phaser.Game} game - The Phaser Game instance
 */
export function create({ game }) {
    const screen = game.state.states[game.state.current];
    const theme = screen.context.config.theme["how-to-play"];
    const keyLookup = screen.layoutFactory.keyLookups.howToPlay;
    const channel = "how-to-play-gel-buttons";

    let panels = [];
    let currentIndex = 0;
    let numberOfPanels = Object.keys(theme.panels).length;

    screen.context.popupScreens.push("how-to-play");

    const overlayManager = OverlayLayout.create(screen);
    const backgroundImage = game.add.image(0, 0, keyLookup.background);
    const background = overlayManager.addBackground(backgroundImage);
    const disabledButtons = overlayManager.disableExistingButtons();
    const gelButtons = addGelButtons();
    addPanels();
    addSignals();

    function addGelButtons() {
        const gelLayout = screen.layoutFactory.addLayout([
            "howToPlayBack",
            "audioOff",
            "settings",
            "howToPlayPrevious",
            "howToPlayNext",
        ]);
        overlayManager.moveGelButtonsToTop(gelLayout);
        return gelLayout;
    }

    function addPanels() {
        theme.panels.forEach((item, index) => {
            const panel = game.add.sprite(0, 0, keyLookup[theme.panels[index]]);
            panel.visible = index === 0;
            screen.layoutFactory.addToBackground(panel);
            panels = panels.concat(panel);
        });
    }

    function previousButtonClick() {
        currentIndex -= 1;
        if (currentIndex === -1) {
            currentIndex = numberOfPanels - 1;
        }
        showPanel();
    }

    function nextButtonClick() {
        currentIndex += 1;
        if (currentIndex === numberOfPanels) {
            currentIndex = 0;
        }
        showPanel();
    }

    function showPanel() {
        panels.forEach(panel => {
            panel.visible = false;
        });
        panels[currentIndex].visible = true;
    }

    function destroyPanels() {
        panels.forEach(panel => {
            panel.destroy();
        });
    }

    function addSignals() {
        signal.bus.subscribe({ channel, name: "back", callback: destroy });
        signal.bus.subscribe({ channel, name: "previous", callback: previousButtonClick });
        signal.bus.subscribe({ channel, name: "next", callback: nextButtonClick });
    }

    function destroy() {
        signal.bus.removeChannel(channel);
        gelButtons.destroy();
        overlayManager.restoreDisabledButtons();
        destroyPanels();
        background.destroy();
        screen.context.popupScreens = fp.pull("how-to-play", screen.context.popupScreens);
    }
}
