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
import * as state from "../core/state.js";

import fp from "../../lib/lodash/fp/fp.js";

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

        this.grid = new GelGrid(this, getMetrics(), this.layout.getSafeArea(), this.theme.rows, this.theme.columns);
        this._cells = this.grid.addGridCells(this.theme.choices);
        this.layout.addCustomGroup("grid", this.grid);

        this._scaleEvent = onScaleChange.add(this.resize.bind(this));
        this.scene.scene.events.on("shutdown", this._scaleEvent.unsubscribe, this);

        this.resize();

        this.addEventSubscriptions();

        const stateConfig = this.context.theme.choices.map(({ id, state }) => ({ id, state }));
        this.states = state.create(this.context.theme.storageKey, stateConfig);

        this.updateStates();
    }

    updateStates() {
        const states = this.states.getAll().filter(config => Boolean(config.state));
        const keyedCells = fp.keyBy(cell => cell.config.id, this._cells);

        states.forEach(state => {
            const config = this.context.theme.states[state.state];
            keyedCells[state.id].overlays.set("state", this.add.sprite(config.x, config.y, config.asset));

            keyedCells[state.id].input.enabled = Boolean(state.state !== "locked")
        }, this);
    }

    resize() {
        const metrics = getMetrics();
        this.grid.resize(metrics, this.layout.getSafeArea());
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
            .cellIds()
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
        eventBus.subscribe({
            channel: buttonsChannel(this),
            name: "next",
            callback: () => {
                this.grid.nextPage();
            },
        });
        eventBus.subscribe({
            channel: buttonsChannel(this),
            name: "previous",
            callback: () => {
                this.grid.previousPage();
            },
        });
    }
}
