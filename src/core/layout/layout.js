/**
 * A container for gel buttons with built in resizing and button break points
 *
 * @module layout/layout
 */
import fp from "../../lib/lodash/fp/fp.js";

import { calculateMetrics } from "./calculate-metrics.js";
import gel from "./gel-defaults.js";
import { Group } from "./group.js";
import { groupLayouts } from "./group-layouts.js";

const getOrder = fp.curry((object, name) => object[name].order);
const tabSort = fp.sortBy(getOrder(gel));

/**
 * Creates a new layout. Called by layout.factory.addLayout for each screen component
 *
 * @param {Phaser.Game} game - Phaser Game Instance
 * @param {module:scaler} scaler
 * @param {[string]} buttonIds
 */
export function create(game, scaler, buttonIds) {
    const root = new Phaser.Group(game, game.world, undefined);

    const size = scaler.getSize();
    let metrics = calculateMetrics(size.width, size.height, size.scale, size.stageHeightPx);

    const groups = fp.zipObject(
        groupLayouts.map(layout => fp.camelCase([layout.vPos, layout.hPos, layout.arrangeV ? "v" : ""].join(" "))),
        groupLayouts.map(layout => new Group(game, root, layout.vPos, layout.hPos, metrics, !!layout.arrangeV)),
    );

    const buttons = fp.zipObject(
        tabSort(buttonIds),
        tabSort(buttonIds).map(name => groups[gel[name].group].addButton(gel[name])),
    );

    /**
     * Attach a callback to the onInputUp event of a given Gel button
     *
     * @param button - gel button identifier
     * @param callback - callback function to attach
     */
    const setAction = (button, callback) => {
        buttons[button].onInputUp.add(callback, this);
    };

    const addToGroup = (groupName, item, position) => {
        groups[groupName].addToGroup(item, position);
    };

    const resize = (width, height, scale, stageHeight) => {
        metrics = calculateMetrics(width, height, scale, stageHeight);

        if (groups) {
            fp.forOwn(group => group.reset(metrics), groups);
        }
    };

    const removeSignals = () => {
        scaler.onScaleChange.remove(resize);
    };

    scaler.onScaleChange.add(resize);
    resize(size.width, size.height, size.scale, size.stageHeightPx);

    return {
        addToGroup,
        buttons,
        destroy: root.destroy,
        resize,
        root,
        removeSignals,
        setAction,
        scaler,
    };
}
