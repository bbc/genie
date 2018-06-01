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
        this.scene.addToBackground(this.game.add.image(0, 0, "home.background"));
        this.scene.addToBackground(this.game.add.image(0, -150, "home.title"));
        this.scene.addLayout(["exit", "howToPlay", "play", "audioOff", "settings"]);
        createTestHarnessDisplay(this.game, this.context, this.scene);

        signal.bus.subscribe({
            channel: "gel-buttons",
            name: "play",
            callback: () => {
                this.navigation.next();
            },
        });
    }
}
