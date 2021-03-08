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
import fp from "../../../lib/lodash/fp/fp.js";
import { createTitles } from "../../core/titles.js";
import * as singleItemMode from "./single-item-mode.js";
import { addEvents } from "./add-events.js";
import { gmi } from "../../core/gmi/gmi.js";
import { addHoverParticlesToCells } from "./select-particles.js";
import { collections } from "../../core/collections.js";

const gridDefaults = {
    tabIndex: 6,
};

const getOnTransitionStartFn = scene => () => {
    if (!scene.layout.buttons.continue) return;

    const bool = scene.currentEnabled();
    scene.layout.buttons.continue.input.enabled = bool;
    scene.layout.buttons.continue.alpha = bool ? 1 : 0.5;
};

export class Select extends Screen {
    create() {
        this.addBackgroundItems();
        this.collection = collections.get(this.config.collection);
        const paginate = this.collection.getAll().length > this.config.columns * this.config.rows;
        const pagingButtons = paginate ? ["previous", "next"] : [];
        const buttons = ["home", "pause", ...pagingButtons];
        singleItemMode.isEnabled(this)
            ? this.setLayout([...buttons, "continue"], ["home", "pause"])
            : this.setLayout(buttons, buttons);

        this.titles = createTitles(this);
        const onTransitionStart = getOnTransitionStartFn(this);
        const choice = this.transientData[this.scene.key]?.choice?.id;

        this.grid = new GelGrid(this, Object.assign(this.config, gridDefaults, { onTransitionStart }, { choice }));
        this.layout.addCustomGroup("grid", this.grid, gridDefaults.tabIndex);
        this.resize();
        this._cells = this.grid.addGridCells(this.collection.getAll());

        this._scaleEvent = onScaleChange.add(this.resize.bind(this));
        this.scene.scene.events.on("shutdown", this._scaleEvent.unsubscribe, this);

        addEvents(this);

        singleItemMode.create(this);

        this.updateStates();
        onTransitionStart();
        addHoverParticlesToCells(this, this._cells, this.config.onHoverParticles, this.layout.root);
    }

    updateStates() {
        const storedStates = this.collection.getAll().filter(config => Boolean(config.state));

        const cells = fp.keyBy(cell => cell.button.config.id, this._cells);

        storedStates.forEach(stored => {
            const config = this.config.states[stored.state];
            const button = cells[stored.id].button;
            button.overlays.set("state", this.add.sprite(config.x, config.y, config.overlayAsset));

            config.asset && button.setImage(config.asset);
            config.properties && Object.assign(button.sprite, config.properties);

            config.suffix && (button.config.ariaLabel = [button.config.ariaLabel, config.suffix].join(" "));
            config.enabled === false && button.off(Phaser.Input.Events.POINTER_UP);
            button.accessibleElement.update();
        }, this);
    }

    resize() {
        this.grid.resize(this.layout.getSafeArea());
    }

    currentEnabled() {
        const currentState = this.collection.get(this.grid.getCurrentPageKey()).state;
        const stateDefinition = this.config.states[currentState];
        return stateDefinition === undefined || stateDefinition.enabled !== false;
    }

    next = getSelection => () => {
        this._scaleEvent.unsubscribe();
        const selection = getSelection.call(this.grid);

        const metaData = { metadata: `ELE=[${selection.title}]` };
        const screenType = this.scene.key.split("-")[0];
        gmi.sendStatsEvent(screenType, "select", metaData);

        this.transientData[this.scene.key] = { choice: selection };
        this.navigation.next();
    };
}
