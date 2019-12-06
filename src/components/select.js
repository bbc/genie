/**
 * Select gives a choice of different items, which can be configured in main.js.
 *
 * @module components/select
 * @copyright BBC 2018
 * @author BBC Children's D+E
 * @license Apache-2.0
 */

import { Screen } from "../core/screen.js";
import { eventBus } from "../core/event-bus.js";
import { buttonsChannel } from "../core/layout/gel-defaults.js";
import { getMetrics, onScaleChange } from "../core/scaler.js";
import { positionElement, getItemBounds } from "../core/helpers/element-bounding.js";

import fp from "../../lib/lodash/fp/fp.js";
import { createTestHarnessDisplay } from "../core/qa/layout-harness.js";

const styleDefaults = {
    fontSize: "24px",
    fontFamily: "Arial",
    align: "center",
};
const baseX = 0;
const baseY = -270;

export class Select extends Screen {
    create() {
        this.add.image(0, 0, `${this.scene.key}.background`);
        this.theme = this.context.config.theme[this.scene.key];
        this.buttonLayout = this.setLayout(["home", "audio", "pause", "previous", "next", "continue"]);

        this.addEventSubscriptions();
        this.setTitleElements();

        onScaleChange.add(this.repositionTitleElements.bind(this));

        createTestHarnessDisplay(this);
    }

    repositionTitleElements() {
        const metrics = getMetrics();
        const safeArea = this.getSafeArea(metrics);

        if (fp.get("text", this.title) && this.titleConfig) {
            const titleTextPosition = this.calculateOffset(baseX, baseY, this.titleConfig.text);
            positionElement(this.title.text, titleTextPosition, safeArea, metrics);
        }

        if (fp.get("text", this.subtitle) && this.subtitleConfig) {
            const subtitleTextPosition = this.calculateOffset(baseX, baseY, this.subtitleConfig.text);
            positionElement(this.subtitle.text, subtitleTextPosition, safeArea, metrics);
        }
    }

    setTitleElements() {
        this.titleConfig = this.theme.title;
        this.subtitleConfig = this.theme.subtitle;

        this.title = this.setVisualElement(this.titleConfig);
        this.subtitle = this.setVisualElement(this.subtitleConfig);
    }

    getSafeArea(metrics) {
        const homeButton = this.buttonLayout.buttons["home"];
        const secondaryButton = this.buttonLayout.buttons["audio"];

        const homeButtonBounds = getItemBounds(homeButton, metrics);
        const secondaryButtonBounds = getItemBounds(secondaryButton, metrics);

        return {
            top: homeButtonBounds.top,
            bottom: homeButtonBounds.bottom,
            left: homeButtonBounds.right,
            right: secondaryButtonBounds.left,
        };
    }

    setVisualElement(config) {
        if (config && config.visible) {
            return this.constructVisualElement(baseX, baseY, config);
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
            image:
                config.image && config.image.imageId
                    ? this.add.image(imagePosition.x, imagePosition.y, `${this.scene.key}.${config.image.imageId}`)
                    : undefined,
            text:
                config.text && config.text.value
                    ? this.add.text(
                          textPosition.x,
                          textPosition.y,
                          config.text.value,
                          config.text.styles || styleDefaults,
                      )
                    : undefined,
        };
        const metrics = getMetrics();
        const safeArea = this.getSafeArea(metrics);

        positionElement(visualElements.text, textPosition, safeArea, metrics);

        return visualElements;
    }

    startGame() {
        // Stats Stuff will need adding back in, once we have the carousel back
        this.navigation.next();
    }

    addEventSubscriptions() {
        eventBus.subscribe({
            channel: buttonsChannel(this),
            name: "continue",
            callback: this.startGame.bind(this),
        });
    }
}
