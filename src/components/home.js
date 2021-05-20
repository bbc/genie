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
import { eventBus } from "../core/event-bus.js";
import { isDebug } from "../core/debug/debug-mode.js";
import { gmi } from "../core/gmi/gmi.js";

export class Home extends Screen {
    create() {
        const achievements = gmi.achievements.get().length ? ["achievements"] : [];
        const debug = isDebug() ? ["debug"] : [];
        this.addBackgroundItems();
        const buttons = ["exit", "howToPlay", "play", "audio", "settings"];
        this.setLayout(buttons.concat(achievements, debug));

        const style = {
            "background-color": "white",
            font: "32px Arial",
            "font-weight": "bold",

        };

        this.add.gelText("some text", style)


        eventBus.subscribe({
            channel: buttonsChannel(this),
            name: "play",
            callback: this.navigation.next,
        });
    }
}
