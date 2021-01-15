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
        const debug = isDebug() ? ["debug"] : [];
        this.addBackgroundItems();
        const buttons = gmi.achievements.get().length
            ? ["exit", "audio", "settings", "play", "achievements", "howToPlay"]
            : ["exit", "audio", "settings", "play", "howToPlay"];
        this.setLayout(buttons.concat(debug));

        eventBus.subscribe({
            channel: buttonsChannel(this),
            name: "play",
            callback: this.navigation.next,
        });
    }
}
