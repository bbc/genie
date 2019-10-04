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
    create() {
        this.theme = this.context.config.theme[this.scene.key];
        this.add.image(0, 0, `${this.scene.key}.pauseBackground`);
        const buttons = ["home", "audio", "settings", "pausePlay", "howToPlay"];
        if (this.theme.showReplayButton) {
            this.addLayout(buttons.concat(["pauseReplay"]));
        } else {
            this.addLayout(buttons);
        }
        this.add.image(0, -170, `${this.scene.key}.title`);
    }
}
