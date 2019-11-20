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
    styleDefaults = {
        fontSize: "24px",
        fontFamily: "Arial",
        align: "center",
    };

    create() {
        this.add.image(0, 0, `${this.scene.key}.background`);

        this.theme = this.context.config.theme[this.scene.key];
        this.titleConfig = this.theme.title;
        this.subtitleConfig = this.theme.subtitle;

        this.title = this.setVisualElement(this.titleConfig);
        this.subtitle = this.setVisualElement(this.subtitleConfig);

        this.buttonLayout = this.theme.howToPlay
            ? this.setLayout(["overlayBack", "audio", "settings", "previous", "next"])
            : this.setLayout(["home", "audio", "pause", "previous", "next", "continue"]);

        this.addEventSubscritions();
        createTestHarnessDisplay(this);
    }

    setVisualElement(config) {
        if (config.visible) {
            return this.theme.howToPlay
                ? this.constructVisualElement(0, -230, config)
                : this.constructVisualElement(0, -170, config);
        }
    }

    constructVisualElement(x, y, config) {
        const visualElements = {
            image: config.image ? this.add.image(x, y, `${this.scene.key}.${config.image}`) : undefined,
            text: config.text.value
                ? this.add.text(x, y, config.text.value, config.text.styles || this.styleDefaults)
                : undefined,
        };
        visualElements.text.setOrigin(0.5);
        return visualElements;
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
