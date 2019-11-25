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

        this.buttonLayout = this.setLayout(["home", "audio", "pause", "previous", "next", "continue"]);

        this.addEventSubscriptions();
        createTestHarnessDisplay(this);
    }

    setVisualElement(config) {
        if (config && config.visible) {
            return this.constructVisualElement(0, -170, config);
        }
    }

    calculateOffset(x, y, config) {
        return {
            x: x + (parseInt(config.xOffset) || 0),
            y: y + (parseInt(config.yOffset) || 0),
        };
    }

    constructVisualElement(x, y, config) {
        const imagePosition = this.calculateOffset(x, y, config.image);
        const textPosition = this.calculateOffset(x, y, config.text);

        const visualElements = {
            image: config.image.imageId
                ? this.add.image(imagePosition.x, imagePosition.y, `${this.scene.key}.${config.image.imageId}`)
                : undefined,
            text: config.text.value
                ? this.add.text(
                      textPosition.x,
                      textPosition.y,
                      config.text.value,
                      config.text.styles || this.styleDefaults,
                  )
                : undefined,
        };
        if (visualElements.text) {
            visualElements.text.setOrigin(0.5);
        }

        return visualElements;
    }

    startGame() {
        // Stats Stuff will need adding back in, once we have the carousel back
        this.navigation.next();
    }

    addEventSubscriptions() {
        event.bus.subscribe({
            channel: buttonsChannel(this),
            name: "continue",
            callback: this.startGame.bind(this),
        });
    }
}
