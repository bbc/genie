/**
 * Pause is an overlay screen created every time the pause button is pressed.
 *
 * @module components/overlays/pause
 * @copyright BBC 2019
 * @author BBC Children's D+E
 * @license Apache-2.0
 */
import { Screen } from "../../core/screen.js";

export class Pause extends Screen {
    preload() {
        this.sound.pauseAll();
        this.events.once("shutdown", this.sound.resumeAll.bind(this.sound));
    }

    create() {
        this.addBackgroundItems();
        const buttons = ["home", "audio", "settings", "pausePlay", "howToPlay"];

        const parentKey = this.context.parentScreens.slice(-1)[0].scene.key;
        const showReplay = Boolean(this.context.navigation[parentKey].routes.restart);
        const showSelect = Boolean(this.context.navigation["pause"].routes.select);

        const selectButton = ["levelSelect"];
        const replayButton = ["pauseReplay"];
        const replayAndSelectButton = ["levelSelect", "pauseReplay"];

        if (showReplay && !showSelect) {
            this.setLayout(buttons.concat(replayButton));
        } else if (!showReplay && showSelect) {
            this.setLayout(buttons.concat(selectButton));
        } else if (showReplay && showSelect) {
            this.setLayout(buttons.concat(replayAndSelectButton));
        } else {
            this.setLayout(buttons);
        }
    }
}
