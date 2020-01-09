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
import { GelGrid } from "../core/layout/gel-grid.js";
import { debugMode } from "../core/qa/qa-mode.js";

import fp from "../../lib/lodash/fp/fp.js";
import { createTestHarnessDisplay } from "../core/qa/layout-harness.js";

const styleDefaults = {
    fontSize: "24px",
    fontFamily: "ReithSans",
    align: "center",
};
const baseX = 0;
const baseY = -270;

export class Select extends Screen {
    create() {
        this.add.image(0, 0, `${this.scene.key}.background`);
        this.addAnimations();
        this.theme = this.context.config.theme[this.scene.key];
        this.setTitleElements();
        this.setLayout(["home", "audio", "pause", "previous", "next", "continue"]);

        createTestHarnessDisplay(this);

        this.safeArea = new Phaser.Geom.Rectangle(50, 50, 300, 200);
        this.grid = new GelGrid(this, getMetrics(), this.safeArea);
        this.grid.addGridCells();
        this.layout.addCustomGroup("grid", this.grid);

        this._scaleEvent = onScaleChange.add(this.resize.bind(this));
        this.scene.scene.events.on("shutdown", this._scaleEvent.unsubscribe, this);

        this.resize();

        this.addEventSubscriptions();
        if (debugMode()) {
            this.graphics = this.add.graphics();
        }
    }

    resize() {
        const metrics = getMetrics();
        this.updateSafeArea(metrics);
        this.grid.resize(metrics, this.safeArea);
        this.repositionTitleElements(metrics);
    }

    repositionTitleElements(metrics) {
        const titleArea = this.getTitleSafeArea(metrics);

        if (fp.get("title.text", this.titleElements) && this.titleConfig) {
            const titleTextPosition = this.calculateOffset(baseX, baseY, this.titleConfig.text);
            positionElement(this.titleElements.title.text, titleTextPosition, titleArea, metrics);
        }

        if (fp.get("subtitle.text", this.titleElements) && this.subtitleConfig) {
            const subtitleTextPosition = this.calculateOffset(baseX, baseY, this.subtitleConfig.text);
            positionElement(this.titleElements.subtitle.text, subtitleTextPosition, titleArea, metrics);
        }
    }

    setTitleElements() {
        this.titleConfig = this.theme.title;
        this.subtitleConfig = this.theme.subtitle;
        this.titleElements = {
            title: this.setVisualElement(this.titleConfig),
            subtitle: this.setVisualElement(this.subtitleConfig),
        };
    }

    getTitleSafeArea(metrics) {
        const homeButton = this.layout.buttons["home"];
        const secondaryButton = this.layout.buttons["audio"];

        const homeButtonBounds = getItemBounds(metrics, homeButton);
        const secondaryButtonBounds = getItemBounds(metrics, secondaryButton);

        return {
            top: homeButtonBounds.top,
            bottom: homeButtonBounds.bottom,
            left: homeButtonBounds.right,
            right: secondaryButtonBounds.left,
        };
    }

    update() {
        if (!debugMode()) {
            return;
        }

        this.graphics.clear();
        this.graphics.fillStyle(0xff3333, 0.3);
        this.graphics.fillRectShape(this.safeArea);
    }

    updateSafeArea(metrics) {
        const bounds = ["home", "previous", "next", "continue"]
            .map(key => this.layout.buttons[key])
            .map(getItemBounds(metrics));

        const lefts = bounds.map(bound => bound.right).filter(x => x < 0);
        const rights = bounds.map(bound => bound.left).filter(x => x > 0);
        const tops = bounds.map(bound => bound.bottom).filter(y => y < 0);
        const bottoms = bounds.map(bound => bound.top).filter(y => y > 0);

        const pad = metrics.isMobile ? 0 : metrics.screenToCanvas(20);

        this.safeArea.left = Math.max(...lefts) + pad;
        this.safeArea.right = Math.min(...rights) - pad;
        this.safeArea.top = Math.max(...tops);
        this.safeArea.bottom = Math.min(...bottoms);
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

        const textStyle = {
            ...styleDefaults,
            ...fp.get("text.styles", config),
        };

        const visualElements = {
            image:
                config.image && config.image.imageId
                    ? this.add.image(imagePosition.x, imagePosition.y, `${this.scene.key}.${config.image.imageId}`)
                    : undefined,
            text:
                config.text && config.text.value
                    ? this.add.text(textPosition.x, textPosition.y, config.text.value, textStyle)
                    : undefined,
        };

        if (visualElements.text) visualElements.text.defaultStyle = textStyle;

        return visualElements;
    }

    next(title) {
        this._scaleEvent.unsubscribe();
        //TODO  Stats Stuff will need adding back in, once we have the carousel back
        //TODO work out the correct key if "continue" is passed here when continue button used vs grid button
        this.transientData[this.scene.key] = { choice: { title } };
        this.navigation.next();
    }

    addEventSubscriptions() {
        this.grid
            .cellKeys()
            .concat(["continue"])
            .map(key => {
                eventBus.subscribe({
                    channel: buttonsChannel(this),
                    name: key,
                    callback: () => {
                        this.next(key);
                    },
                });
            });
    }
}
