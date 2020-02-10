/**
 * Select gives a choice of different items, which can be configured in main.js.
 *
 * @module components/select
 * @copyright BBC 2018
 * @author BBC Children's D+E
 * @license Apache-2.0
 */
import fp from "../../lib/lodash/fp/fp.js";

import { Screen } from "../core/screen.js";
import { eventBus } from "../core/event-bus.js";
import { buttonsChannel } from "../core/layout/gel-defaults.js";
import { getMetrics, onScaleChange } from "../core/scaler.js";
import { positionElement } from "../core/helpers/element-bounding.js";
import { GelGrid } from "../core/layout/grid/grid.js";
import * as state from "../core/state.js";

const styleDefaults = {
    fontSize: "24px",
    fontFamily: "ReithSans",
    align: "center",
};
const baseX = 0;
const baseY = -270;

const gridDefaults = {
    tabIndex: 6,
};

export class Select extends Screen {
    create() {
        this.add.image(0, 0, `${this.scene.key}.background`);
        this.addAnimations();
        this.theme = this.context.config.theme[this.scene.key];
        this.setTitleElements();
        const continueBtn = this.theme.rows * this.theme.columns === 1 ? ["continue"] : [];
        const buttons = ["home", "pause", "previous", "next"];
        this.setLayout(buttons.concat(continueBtn));
        const metrics = getMetrics();
        const onTransitionStart = this.onTransitionStart.bind(this);
        this.grid = new GelGrid(this, metrics, Object.assign(this.theme, gridDefaults, { onTransitionStart }));
        this.resize();
        this._cells = this.grid.addGridCells(this.theme);
        this.layout.addCustomGroup("grid", this.grid, gridDefaults.tabIndex);

        this._scaleEvent = onScaleChange.add(this.resize.bind(this));
        this.scene.scene.events.on("shutdown", this._scaleEvent.unsubscribe, this);

        this.addEventSubscriptions();

        const stateConfig = this.context.theme.choices.map(({ id, state }) => ({ id, state }));
        this.states = state.create(this.context.theme.storageKey, stateConfig);

        this.updateStates();
    }

    updateStates() {
        const storedStates = this.states.getAll().filter(config => Boolean(config.state));
        const cells = fp.keyBy(cell => cell.button.config.id, this._cells);

        storedStates.forEach(stored => {
            const config = this.context.theme.states[stored.state];
            const button = cells[stored.id].button;

            button.overlays.set("state", this.add.sprite(config.x, config.y, config.overlayAsset));

            config.asset && button.setImage(config.asset);
            config.properties && Object.assign(button.sprite, config.properties);

            config.suffix && (button.config.ariaLabel = [button.config.ariaLabel, config.suffix].join(" "));
            button.input.enabled = Boolean(config.enabled !== false);
            button.accessibleElement.update();
        }, this);
    }

    resize() {
        const metrics = getMetrics();
        this.grid.resize(metrics, this.layout.getSafeArea(metrics));
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

    getTitleSafeArea() {
        const homeButton = this.layout.buttons["home"];
        const secondaryButton = this.layout.buttons["pause"];

        const homeButtonBounds = homeButton.getHitAreaBounds();
        const secondaryButtonBounds = secondaryButton.getHitAreaBounds();

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

    currentEnabled() {
        const currentState = this.states.get(this.grid.getCurrentPageKey()).state;
        const stateDefinition = this.context.theme.states[currentState];
        return stateDefinition === undefined || stateDefinition.enabled !== false;
    }

    onTransitionStart() {
        if (!this.layout.buttons.continue) return;

        const bool = this.currentEnabled();
        this.layout.buttons.continue.input.enabled = bool;
        this.layout.buttons.continue.alpha = bool ? 1 : 0.5;
        this.layout.buttons.continue.accessibleElement.update();
    }

    next = getTitle => () => {
        this._scaleEvent.unsubscribe();

        //TODO  Stats Stuff will need adding back in, once we have the carousel back
        //TODO work out the correct key if "continue" is passed here when continue button used vs grid button
        this.transientData[this.scene.key] = { choice: { title: getTitle.call(this.grid) } };
        this.navigation.next();
    };

    addEventSubscriptions() {
        const grid = this.grid;
        grid.cellIds().map(key => {
            eventBus.subscribe({
                channel: buttonsChannel(this),
                name: key,
                callback: this.next(() => key),
            });
        });
        eventBus.subscribe({
            channel: buttonsChannel(this),
            name: "continue",
            callback: this.next(this.grid.getCurrentPageKey),
        });
        eventBus.subscribe({
            channel: buttonsChannel(this),
            name: "next",
            callback: () => grid.showPage(grid.page + 1),
        });
        eventBus.subscribe({
            channel: buttonsChannel(this),
            name: "previous",
            callback: () => grid.showPage(grid.page - 1),
        });
    }
}
