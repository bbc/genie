/**
 * Pause is an overlay screen created every time the pause button is pressed.
 *
 * @module components/overlays/pause
 * @copyright BBC 2019
 * @author BBC Children's D+E
 * @license Apache-2.0
 */
import { createTestHarnessDisplay } from "../../core/qa/layout-harness.js";
import { Screen } from "../../core/screen.js";

export class Pause extends Screen {
    preload() {
        this.sound.pauseAll();
        this.events.once("onscreenexit", this.sound.resumeAll.bind(this.sound));
    }

    create() {
        this.theme = this.context.config.theme[this.scene.key];
        this.add.image(0, 0, `${this.scene.key}.pauseBackground`);
        const buttons = ["home", "audio", "settings", "pausePlay", "howToPlay"];
        const replayButton = this.theme.showReplayButton ? ["pauseReplay"] : [];

        this.setLayout(buttons.concat(replayButton));
        this.add.image(0, -170, `${this.scene.key}.title`);

        createTestHarnessDisplay(this);
    }
}
