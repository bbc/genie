/**
 * Home is the main title screen for the game.
 *
 * @module components/home
 * @copyright BBC 2018
 * @author BBC Children's D+E
 * @license Apache-2.0
 */
import { buttonsChannel } from "../core/layout/gel-defaults.js";
import { Screen } from "../core/screen.js";
import * as signal from "../core/signal-bus.js";
import { createTestHarnessDisplay } from "../core/qa/layout-harness.js";

export class Home extends Screen {
    create() {
        const achievements = this.context.config.theme.game.achievements ? ["achievements"] : [];
        this.add.image(0, 0, `${this.scene.key}.background`);
        this.add.image(0, -150, `${this.scene.key}.title`);

        const buttons = ["exit", "howToPlay", "play", "audio", "settings"];
        this.addLayout(buttons.concat(achievements));

        createTestHarnessDisplay(this);

        signal.bus.subscribe({
            channel: buttonsChannel(this),
            name: "play",
            callback: this.navigation.next,
        });
    }
}
