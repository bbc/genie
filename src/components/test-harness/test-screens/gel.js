/**
 * @copyright BBC 2018
 * @author BBC Children's D+E
 * @license Apache-2.0
 */
import { Screen } from "../../../core/screen.js";

export class Home extends Screen {
    constructor() {
        super();
    }

    preload() {}

    create() {
        this.scene.addLayout([
            "exit",
            "home",
            "achievements",
            "howToPlay",
            "play",
            "settings",
            "audio",
            "previous",
            "next",
            "continue",
            "restart",
            "back",
            "pause",
        ]);
    }
}
