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
        //TODO P3 fix config being passed through [NT].
        //const achievements = this.context.config.theme.game.achievements ? ["achievements"] : [];
        const achievements = ["achievements"];

        console.log("HOME CONTEXT", this.context);

        this.add.image(0, 0, "home.background");
        this.add.image(0, 0, "home.title");

        const buttons = ["exit", "howToPlay", "play", "audio", "settings"];

        //TODO P3 fix layoutmanager being added, test harness and signal bus [NT]
        this.addLayout(buttons.concat(achievements));

        //createTestHarnessDisplay(this.game, this.context, this.layoutManager);

        //signal.bus.subscribe({
        //    channel: buttonsChannel,
        //    name: "play",
        //    callback: this.navigation.next,
        //});
    }
}
