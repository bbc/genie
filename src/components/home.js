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
import { createTestHarnessDisplay } from "./test-harness/layout-harness.js";

export class Home extends Screen {
    constructor() {
        super({ key: "home" });
    }

    create() {
        const achievements = this.context.config.theme.game.achievements ? ["achievements"] : [];
        this.add.image(0, 0, "home.background");
        this.add.image(0, -150, "home.title");

        const buttons = ["exit", "howToPlay", "play", "audio", "settings"];

        this.addLayout(buttons.concat(achievements));

        //TODO P3 fix  test harness and signal bus [NT]
        //createTestHarnessDisplay(this.game, this.context, this.layoutManager);

        //signal.bus.subscribe({
        //    channel: buttonsChannel,
        //    name: "play",
        //    callback: this.navigation.next,
        //});
    }
}
