/**
 * A container for gel buttons with built in resizing and button break points
 *
 * @module layout/layout
 */
import { onScaleChange } from "../scaler.js";
import fp from "../../../lib/lodash/fp/fp.js";
import * as gel from "./gel-defaults.js";
import { groupLayouts } from "./group-layouts.js";
import { Group } from "./group.js";

const getOrder = fp.curry((object, name) => object[name].order);
const tabSort = fp.sortBy(getOrder(gel.config));

/**
 * Creates a new layout. Called by layout.factory.addLayout for each screen component
 *
 * @param {Phaser.Game} game - Phaser Game Instance
 * @param {Object} metrics - viewport metrics
 * @param {Array.<string>} buttonIds
 */
export function create(game, metrics, buttonIds) {
    const root = new Phaser.Group(game, game.world, undefined);
    const groups = fp.zipObject(
        groupLayouts.map(layout =>
            fp.camelCase([layout.vPos, layout.hPos, layout.safe ? "safe" : "", layout.arrangeV ? "v" : ""].join(" ")),
        ),
        groupLayouts.map(
            layout => new Group(game, root, layout.vPos, layout.hPos, metrics, !!layout.safe, !!layout.arrangeV),
        ),
    );

    const buttons = fp.zipObject(
        tabSort(buttonIds),
        tabSort(buttonIds).map(name => groups[gel.config[name].group].addButton(gel.config[name])),
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

    const resize = metrics => {
        if (groups) {
            fp.forOwn(group => group.reset(metrics), groups);
        }
    };
    resize(metrics);

    const signal = onScaleChange.add(resize);
    const removeSignals = () => {
        signal.unsubscribe();
    };

    const destroy = () => {
        removeSignals();
        root.destroy();
    };

    return {
        addToGroup,
        buttons,
        destroy,
        resize,
        root,
        removeSignals,
        setAction,
    };
}
