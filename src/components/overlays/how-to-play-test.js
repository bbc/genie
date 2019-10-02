/**
 * How To Play Screen.
 * @module components/overlays/how-to-play
 * @copyright BBC 2019
 * @author BBC Children's D+E
 * @license Apache-2.0
 */

import { Screen } from "../../core/screen.js";

export class HowToPlay extends Screen {
    create() {
        console.log("Loaded How to Play");
        this.cameras.main.scrollX = -700;
        this.cameras.main.scrollY = -300;
        this.add.image(0, 0, "home.background");
        this.addLayout(["home", "audio", "settings", "pausePlay", "howToPlay"]);
    }
}
