/**
 * Home is the main title screen for the game.
 *
 * @module components/home
 */

import { Screen } from "../core/screen.js";
import * as signal from "../core/signal-bus.js";
import { createTestHarnessDisplay } from "./test-harness/layout-harness.js";

export class Home extends Screen {
    constructor() {
        super();
    }

    create() {
        this.layoutFactory.addToBackground(this.game.add.image(0, 0, this.assets.background));
        this.layoutFactory.addToBackground(this.game.add.image(0, -150, this.assets.title));
        this.layoutFactory.addLayout(["exit", "howToPlay", "play", "audioOff", "settings"]);
        createTestHarnessDisplay(this.game, this.context, this.layoutFactory);

        signal.bus.subscribe({
            channel: "gel-buttons",
            name: "play",
            callback: () => {
                this.next();
            },
        });
    }
}
