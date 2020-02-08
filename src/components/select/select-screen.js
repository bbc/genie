/**
 * Select gives a choice of different items, which can be configured in main.js.
 *
 * @module components/select
 * @copyright BBC 2018
 * @author BBC Children's D+E
 * @license Apache-2.0
 */
import { Screen } from "../../core/screen.js";
import { eventBus } from "../../core/event-bus.js";
import { buttonsChannel } from "../../core/layout/gel-defaults.js";
import { getMetrics, onScaleChange } from "../../core/scaler.js";
import { GelGrid } from "../../core/layout/grid/grid.js";
import * as state from "../../core/state.js";
import fp from "../../../lib/lodash/fp/fp.js";
import { createTitles } from "./titles.js";

const gridDefaults = {
    tabIndex: 6,
};

export class Select extends Screen {
    create() {
        this.add.image(0, 0, `${this.scene.key}.background`);
        this.addAnimations();
        this.theme = this.context.config.theme[this.scene.key];
        this.titles = createTitles(this);
        const continueBtn = this.theme.rows * this.theme.columns === 1 ? ["continue"] : [];
        const buttons = ["home", "pause", "previous", "next"];
        this.setLayout(buttons.concat(continueBtn));
        const metrics = getMetrics();
        const onTransitionStart = this.onTransitionStart.bind(this);
        this.grid = new GelGrid(this, metrics, Object.assign(this.theme, gridDefaults, { onTransitionStart }));
        this.resize();
        this._cells = this.grid.addGridCells(this.theme.choices);
        this.layout.addCustomGroup("grid", this.grid, gridDefaults.tabIndex);

        this._scaleEvent = onScaleChange.add(this.resize.bind(this));
        this.scene.scene.events.on("shutdown", this._scaleEvent.unsubscribe, this);

        this.addEventSubscriptions();

        const stateConfig = this.context.theme.choices.map(({ id, state }) => ({ id, state }));
        this.states = state.create(this.context.theme.storageKey, stateConfig);

        const continueButton = this.layout.buttons.continue ? [this.layout.buttons.continue] : [];
        continueButton.map(this.linkHover.bind(this));

        this.updateStates();
        this.onTransitionStart();
    }

    linkHover(button) {
        //button is continueButton
        //

        button.on(
            "pointerover",
            function() {
                this.grid.getPageCells(this.grid.page)[0].button.sprite.setFrame(1);
                console.log("hover");
            }.bind(this),
        );

        button.on(
            "pointerout",
            function() {
                this.grid.getPageCells(this.grid.page)[0].button.sprite.setFrame(0);
            }.bind(this),
        );

        this._cells.map(cell => {
            cell.button.on("pointerover", () => button.sprite.setFrame(1));
            cell.button.on("pointerout", () => button.sprite.setFrame(0));
        });
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

        this.titles.reposition(metrics, this.layout.buttons);
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
