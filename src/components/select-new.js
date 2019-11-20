/**
 * Select gives a choice of different items, which can be configured in main.js.
 *
 * @module components/select
 * @copyright BBC 2018
 * @author BBC Children's D+E
 * @license Apache-2.0
 */

import { Screen } from "../core/screen.js";
import * as event from "../core/event-bus.js";
import { buttonsChannel } from "../core/layout/gel-defaults.js";

import { createTestHarnessDisplay } from "../core/qa/layout-harness.js";

export class Select extends Screen {
    create() {
        this.add.image(0, 0, `${this.scene.key}.background`);

        this.theme = this.context.config.theme[this.scene.key];
        if (this.theme.showTitle) {
            const title = this.theme.howToPlay // eslint-disable-line no-unused-vars
                ? this.add.image(0, -230, `${this.scene.key}.title`)
                : this.add.image(0, -170, `${this.scene.key}.title`);
        }

        this.buttonLayout = this.theme.howToPlay
            ? this.setLayout(["overlayBack", "audio", "settings", "previous", "next"])
            : this.setLayout(["home", "audio", "pause", "previous", "next", "continue"]);

        this.addEventSubscritions();
        createTestHarnessDisplay(this);
    }

    startGame() {
        // Stats Stuff will need adding back in, once we have the carousel back
        this.navigation.next();
    }
    addEventSubscritions() {
        event.bus.subscribe({
            channel: buttonsChannel(this),
            name: "continue",
            callback: this.startGame.bind(this),
        });
    }
}
