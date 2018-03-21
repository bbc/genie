import fpcurry from "lodash/fp/curry";
import fpsortBy from "lodash/fp/sortBy";
import fpzipObject from "lodash/fp/zipObject";
import fpcamelCase from "lodash/fp/camelCase";
import fpforOwn from "lodash/fp/forOwn";

import { calculateMetrics } from "./calculate-metrics.js";
import gel from "./gel-defaults.js";
import { Group } from "./group.js";
import { groupLayouts } from "./group-layouts.js";

const getOrder = fpcurry((object, name) => object[name].order);
const tabSort = fpsortBy(getOrder(gel));

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

        this._groups = fpzipObject(
            groupLayouts.map(layout => fpcamelCase([layout.vPos, layout.hPos, layout.arrangeV ? "v" : ""].join(" "))),
            groupLayouts.map(
                layout => new Group(game, this.root, layout.vPos, layout.hPos, this._metrics, !!layout.arrangeV),
            ),
        );

        this.buttons = fpzipObject(
            tabSort(buttons),
            tabSort(buttons).map(name => this._groups[gel[name].group].addButton(gel[name])),
        );

        scaler.onScaleChange.add(this.resize, this);
        this.resize(size.width, size.height, size.scale, size.stageHeightPx);
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
            fpforOwn(group => group.reset(this._metrics), this._groups);
        }
    }
}
