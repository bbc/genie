/**
 * How To Play Screen.
 * @module components/overlays/how-to-play
 */

import fp from "../../../lib/lodash/fp/fp.js";

import * as signal from "../../core/signal-bus.js";
import * as OverlayLayout from "../../components/overlays/overlay-layout.js";
import * as gel from "../../core/layout/gel-defaults.js";

/**
 * @param {Phaser.Game} game - The Phaser Game instance
 */
export function create({ game }) {
    const screen = game.state.states[game.state.current];
    const theme = screen.context.config.theme["how-to-play"];
    const channel = "how-to-play-gel-buttons";

    let panels = [];
    let currentIndex = 0;
    let numberOfPanels = Object.keys(theme.panels).length;

    screen.context.popupScreens.push("how-to-play");

    const overlayLayout = OverlayLayout.create(screen);
    const background = overlayLayout.addBackground(game.add.image(0, 0, "howToPlay.background"));
    const title = screen.scene.addToBackground(game.add.image(0, -230, "howToPlay.title"));
    const gelButtons = addGelButtons();
    addPanels();
    let pips = addPips();
    addSignals();

    function addGelButtons() {
        const gelLayout = screen.scene.addLayout([
            "howToPlayBack",
            "audioOff",
            "settings",
            "howToPlayPrevious",
            "howToPlayNext",
        ]);
        overlayLayout.moveGelButtonsToTop(gelLayout);
        return gelLayout;
    }

    function addPanels() {
        theme.panels.forEach((item, index) => {
            const panel = game.add.sprite(0, 30, "howToPlay." + theme.panels[index]);
            panel.visible = index === 0;
            screen.scene.addToBackground(panel);
            panels = panels.concat(panel);
        });
    }

    function previousButtonClick() {
        currentIndex -= 1;
        if (currentIndex === -1) {
            currentIndex = numberOfPanels - 1;
        }
        showCurrentPanel();
        updatePips();
    }

    function nextButtonClick() {
        currentIndex += 1;
        if (currentIndex === numberOfPanels) {
            currentIndex = 0;
        }
        showCurrentPanel();
        updatePips();
    }

    function showCurrentPanel() {
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

    function addPips() {
        let pipsGroup = game.add.group();
        const spacing = 15;
        const pipWidth = 16;
        const pipsLength = pipWidth * numberOfPanels + spacing * (numberOfPanels - 1);
        let currentPosition = -Math.abs(pipsLength / 2);

        panels.forEach(panel => {
            const pipImage = panel.visible ? "howToPlay.pipOn" : "howToPlay.pipOff";
            const pip = game.add.sprite(currentPosition, 240, pipImage);
            overlayLayout.moveToTop(pip);
            pipsGroup.add(pip);
            currentPosition += pipWidth + spacing;
        });
        screen.scene.addToBackground(pipsGroup);
        return pipsGroup;
    }

    function destroyPips() {
        pips.callAll("kill");
        pips.callAll("destroy");
    }

    function updatePips() {
        destroyPips();
        pips = addPips();
    }

    function addSignals() {
        signal.bus.subscribe({ channel, name: "back", callback: destroy });
        signal.bus.subscribe({ channel, name: "previous", callback: previousButtonClick });
        signal.bus.subscribe({ channel, name: "next", callback: nextButtonClick });
    }

    function destroy() {
        signal.bus.removeChannel(channel);
        gelButtons.destroy();
        overlayLayout.restoreDisabledButtons();
        document.getElementById(gel.config.howToPlay.id).focus();
        destroyPanels();
        destroyPips();
        title.destroy();
        background.destroy();
        screen.context.popupScreens = fp.pull("how-to-play", screen.context.popupScreens);
    }
}
