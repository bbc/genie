/**
 * Narrative screens are used to relay information to the player.
 *
 * @module components/narrative
 * @copyright BBC 2020
 * @author BBC Children's D+E
 * @license Apache-2.0
 */
import { buttonsChannel } from "../core/layout/gel-defaults.js";
import { Screen } from "../core/screen.js";
import { eventBus } from "../core/event-bus.js";
import { nextPage } from "../core/background/pages.js";

export class Narrative extends Screen {
    create() {
        this.addBackgroundItems();
        this.setLayout(["continue", "skip", "pause"]);

        eventBus.subscribe({
            channel: buttonsChannel(this),
            name: "continue",
            callback: nextPage(this),
        });
    }
}
