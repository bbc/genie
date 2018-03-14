import * as _ from "../../lib/lodash/lodash.js";

import { calculateMetrics } from "./calculate-metrics.js";
import gel from "./gel-defaults.js";
import { Group } from "./group.js";
import { groupLayouts } from "./group-layouts.js";

export class Layout {

    /**
     * Creates a new layout. Called by engine.create for each screen component
     *
     * @param game - Phaser Game Instance
     * @param {Scaler} scaler
     * @param keyLookup
     * @param buttons
     */
    constructor(
        game,
        scaler,
        buttons,
    ) {
        this.root = new Phaser.Group(game, game.world, undefined);

        const size = scaler.getSize();
        this.resize(size.width, size.height, size.scale, size.stageHeightPx);

        this._groups = _.zipObject(
            groupLayouts.map(layout => _.camelCase([layout.vPos, layout.hPos, layout.arrangeV ? "v" : ""].join(" "))),
            groupLayouts.map(
                layout =>
                    new Group(
                        game,
                        this.root,
                        layout.vPos,
                        layout.hPos,
                        this._metrics,
                        !!layout.arrangeV,
                    ),
            ),
        );
        this.buttons = _.zipObject(
            buttons,
            buttons.map((name) => this._groups[gel[name].group].addButton(gel[name])),
        );

        scaler.onScaleChange.add(this.resize, this);
    }

    /**
     * Attach a callback to the onInputUp event of a given Gel button
     *
     * @param button- gel button identifier
     * @param callback - callback function to attach
     */
    setAction(button, callback) {
        this.buttons[button].onInputUp.add(callback, this);
    }

    addToGroup(groupName, item, position) {
	    this._groups[groupName].addToGroup(item, position);
    }

    destroy() {this.root.destroy();}

    resize(width, height, scale, stageHeight) {
        this._metrics = calculateMetrics(width, height, scale, stageHeight);

        if (this._groups) {
            _.forOwn(this._groups, (group) => group.reset(this._metrics));
        }
    }
}
