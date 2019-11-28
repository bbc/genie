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
import { getMetrics, onScaleChange } from "../core/scaler.js";

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
        this.buttonLayout = this.setLayout(["home", "audio", "pause", "previous", "next", "continue"]);

        this.addEventSubscriptions();
        this.setTitleElements();

        onScaleChange.add(this.scaleTitleElements.bind(this));

        createTestHarnessDisplay(this);
    }

    scaleTitleElements() {
        if (this.title && this.title.text && this.titleConfig) {
            const titleTextPosition = this.calculateOffset(0, -270, this.titleConfig.text);
            this.positionText(this.title.text, titleTextPosition);
        }

        if (this.subtitle && this.subtitle.text && this.subtitleConfig) {
            const subtitleTextPosition = this.calculateOffset(0, -270, this.subtitleConfig.text);
            this.positionText(this.subtitle.text, subtitleTextPosition);
        }
    }

    setTitleElements() {
        this.titleConfig = this.theme.title;
        this.subtitleConfig = this.theme.subtitle;

        this.title = this.setVisualElement(this.titleConfig);
        this.subtitle = this.setVisualElement(this.subtitleConfig);
    }

    restrictBounds(textElement, homeButton, secondaryButton) {
        const metrics = getMetrics();
        const textBounds = this.getItemBounds(textElement, metrics);

        const homeButtonBounds = this.getItemBounds(homeButton, metrics);
        const secondaryButtonBounds = this.getItemBounds(secondaryButton, metrics);
        const safeArea = {
            top: homeButtonBounds.top,
            bottom: homeButtonBounds.bottom,
            left: homeButtonBounds.right,
            right: secondaryButtonBounds.left,
        };

        if (textBounds.top < safeArea.top) {
            textElement.setPosition(textElement.x, textElement.y - (textBounds.top - safeArea.top));
        }
        if (textBounds.bottom > safeArea.bottom) {
            textElement.setPosition(textElement.x, textElement.y - (textBounds.bottom - safeArea.bottom));
        }
        if (textBounds.left < safeArea.left) {
            textElement.setPosition(textElement.x - (textBounds.left - safeArea.left), textElement.y);
        }
        if (textBounds.right > safeArea.right) {
            textElement.setPosition(textElement.x - (textBounds.right - safeArea.right), textElement.y);
        }
    }

    getItemBounds(item, metrics) {
        const bounds = item.getBounds();
        const padding = metrics.isMobile && item.type === "Sprite" ? metrics.buttonPad : 0;
        return {
            top: bounds.y - padding,
            bottom: bounds.y + bounds.height + padding,
            left: bounds.x - padding,
            right: bounds.x + bounds.width + padding,
        };
    }

    setVisualElement(config) {
        if (config && config.visible) {
            return this.constructVisualElement(0, -270, config);
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
                          config.text.styles || this.styleDefaults,
                      )
                    : undefined,
        };

        this.positionText(visualElements.text, textPosition);

        return visualElements;
    }
    positionText(text, textPosition) {
        if (text) {
            text.setPosition(textPosition.x, textPosition.y);
            text.setOrigin(0.5);
            this.restrictBounds(text, this.buttonLayout.buttons["home"], this.buttonLayout.buttons["audio"]);
        }
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
