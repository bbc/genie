/**
 * A container for gel buttons with built in resizing and button break points
 *
 * @module layout/layout
 * @copyright BBC 2018
 * @author BBC Children's D+E
 * @license Apache-2.0
 */
import { onScaleChange } from "../scaler.js";
import fp from "../../../lib/lodash/fp/fp.js";
import * as settingsIcons from "./settings-icons.js";
import * as gel from "./gel-defaults.js";
import { groupLayouts } from "./group-layouts.js";
import { GelGroup } from "./gel-group.js";
import { gmi } from "../gmi/gmi.js";

const getOrder = fp.curry((object, name) => object[name].order);
const tabSort = fp.sortBy(getOrder(gel.config()));

const checkGMIFlags = fp.cond([
    [name => name === "audio", () => gmi.shouldDisplayMuteButton],
    [name => name === "exit", () => gmi.shouldShowExitButton],
    [fp.stubTrue, fp.stubTrue],
]);

const copyFirstChildren = fp.mapValues(key => Object.assign({}, key));
const assignProperties = (object, overrides) => {
    fp.mapKeys(key => Object.assign(object[key], overrides[key]), overrides);
    return object;
};

// Copy gel config with only objects / functions as a reference.
const shallowMergeOverrides = (config, overrides) => assignProperties(copyFirstChildren(config), overrides);

/**
 * Creates a new layout. Called by screen.addLayout for each screen component
 *
 * @param {Phaser.Scene} scene - Phaser Scene Instance
 * @param {Object} metrics - viewport metrics
 * @param {Array.<string>} buttonIds
 */
export function create(scene, metrics, buttonIds) {
    buttonIds = buttonIds.filter(checkGMIFlags);

    const overrides = scene.cache.json.get("config").theme[scene.scene.key]["button-overrides"];
    const config = shallowMergeOverrides(gel.config(scene), overrides);
    const root = new Phaser.GameObjects.Container(scene, 0, 0);

    const groups = fp.zipObject(
        groupLayouts.map(layout =>
            fp.camelCase([layout.vPos, layout.hPos, layout.safe ? "safe" : "", layout.arrangeV ? "v" : ""].join(" ")),
        ),
        groupLayouts.map(layout => {
            const group = new GelGroup(scene, root, layout.vPos, layout.hPos, metrics, layout.safe, layout.arrangeV);
            root.add(group);
            return group;
        }),
    );

    const buttons = fp.zipObject(
        tabSort(buttonIds),
        tabSort(buttonIds).map(name => groups[config[name].group].addButton(config[name])),
    );

    const iconEvents = settingsIcons.create(groups.topRight, buttonIds);

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

    const makeAccessible = () => {
        fp.forOwn(group => group.makeAccessible(), groups);
    };

    const resize = metrics => {
        fp.forOwn(group => group.reset(metrics), groups);
    };
    resize(metrics);

    const event = onScaleChange.add(resize);

    const removeEvents = () => {
        event.unsubscribe();
        iconEvents.unsubscribe();
    };

    const destroy = () => {
        removeEvents();
        root.destroy();
    };

    return {
        addToGroup,
        buttons,
        destroy,
        makeAccessible,
        resize,
        root,
        removeEvents,
        setAction,
    };
}
