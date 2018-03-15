import fp from "../../lib/lodash/fp/fp.js";

import { calculateMetrics } from "./calculate-metrics.js";
import gel from "./gel-defaults.js";
import { Group } from "./group.js";
import { groupLayouts } from "./group-layouts.js";

const getOrder = fp.curry((object, name) => object[name].order);
const tabSort = fp.sortBy(getOrder(gel));

export class Layout {
    /**
     * Creates a new layout. Called by engine.create for each screen component
     *
     * @param game - Phaser Game Instance
     * @param scaler
     * @param buttons
     */
    constructor(game, scaler, buttons) {
        this.root = new Phaser.Group(game, game.world, undefined);

        const size = scaler.getSize();
        this._metrics = calculateMetrics(size.width, size.height, size.scale, size.stageHeightPx);

        this._groups = fp.zipObject(
            groupLayouts.map(layout => fp.camelCase([layout.vPos, layout.hPos, layout.arrangeV ? "v" : ""].join(" "))),
            groupLayouts.map(
                layout => new Group(game, this.root, layout.vPos, layout.hPos, this._metrics, !!layout.arrangeV),
            ),
        );

        this.buttons = fp.zipObject(
            tabSort(buttons),
            tabSort(buttons).map(name => this._groups[gel[name].group].addButton(gel[name])),
        );

        scaler.onScaleChange.add(this.resize, this);
        this.resize();
    }

    /**
     * Attach a callback to the onInputUp event of a given Gel button
     *
     * @param button - gel button identifier
     * @param callback - callback function to attach
     */
    setAction(button, callback) {
        this.buttons[button].onInputUp.add(callback, this);
    }

    addToGroup(groupName, item, position) {
        this._groups[groupName].addToGroup(item, position);
    }

    destroy() {
        this.root.destroy();
    }

    resize(width, height, scale, stageHeight) {
        this._metrics = calculateMetrics(width, height, scale, stageHeight);

        if (this._groups) {
            fp.forOwn(group => group.reset(this._metrics), this._groups);
        }
    }
}
