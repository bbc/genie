/**
 * Select gives a choice of different items, which can be configured in main.js.
 *
 * @module components/select
 * @copyright BBC 2018
 * @author BBC Children's D+E
 * @license Apache-2.0
 */
import { Screen } from "../../core/screen.js";
import { onScaleChange } from "../../core/scaler.js";
import { GelGrid } from "../../core/layout/grid/grid.js";
import * as state from "../../core/state.js";
import fp from "../../../lib/lodash/fp/fp.js";
import { createTitles } from "./titles.js";
import * as singleItemMode from "./single-item-mode.js";
import { addEvents } from "./add-events.js";

const gridDefaults = {
    tabIndex: 6,
};

const getOnTransitionStartFn = scene => () => {
    if (!scene.layout.buttons.continue) return;

    const bool = scene.currentEnabled();
    scene.layout.buttons.continue.input.enabled = bool;
    scene.layout.buttons.continue.alpha = bool ? 1 : 0.5;
    scene.layout.buttons.continue.accessibleElement.update();
};

export class Select extends Screen {
    create() {
        this.add.image(0, 0, `${this.scene.key}.background`);
        this.addAnimations();
        this.theme = this.context.theme;
        this.titles = createTitles(this);
        const buttons = ["home", "pause", "previous", "next"];
        this.setLayout(buttons.concat(singleItemMode.continueBtn(this)));
        const onTransitionStart = getOnTransitionStartFn(this);
        this.grid = new GelGrid(this, Object.assign(this.theme, gridDefaults, { onTransitionStart }));
        this.resize();
        this._cells = this.grid.addGridCells(this.theme);
        this.layout.addCustomGroup("grid", this.grid, gridDefaults.tabIndex);

        this._scaleEvent = onScaleChange.add(this.resize.bind(this));
        this.scene.scene.events.on("shutdown", this._scaleEvent.unsubscribe, this);

        addEvents(this);

        const stateConfig = this.theme.choices.map(({ id, state }) => ({ id, state }));
        this.states = state.create(this.context.theme.storageKey, stateConfig);

        this.singleItemMode = singleItemMode.create(this);

        this.updateStates();
        onTransitionStart();
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
        this.grid.resize(this.layout.getSafeArea());
        this.titles.reposition(this.layout.buttons);
    }

    currentEnabled() {
        const currentState = this.states.get(this.grid.getCurrentPageKey()).state;
        const stateDefinition = this.context.theme.states[currentState];
        return stateDefinition === undefined || stateDefinition.enabled !== false;
    }

    next = getTitle => () => {
        this._scaleEvent.unsubscribe();

        //TODO  Stats Stuff will need adding back in, once we have the carousel back
        //TODO work out the correct key if "continue" is passed here when continue button used vs grid button
        this.transientData[this.scene.key] = { choice: { title: getTitle.call(this.grid) } };
        this.navigation.next();
    };
}
