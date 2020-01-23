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
        this.add.image(0, 0, `${this.scene.key}.pauseBackground`);
        const buttons = ["home", "audio", "settings", "pausePlay", "howToPlay"];

        const parentKey = this.context.parentScreens.slice(-1)[0].scene.key;
        const showReplay = Boolean(this.context.navigation[parentKey].routes.restart);

        const replayButton = showReplay ? ["pauseReplay"] : [];

        this.setLayout(buttons.concat(replayButton));
        this.add.image(0, -170, `${this.scene.key}.title`);
    }
}
