/**
 * A Gel Button Factory exists on each layout group. It has one method {@link module:layout/button-factory.createButton createButton}
 *
 * @module core/layout/button-factory
 */
import fp from "../../../lib/lodash/fp/fp.js";
import { accessibilify } from "../accessibilify/accessibilify.js";
import { GelButton } from "./gel-button.js";
import * as signal from "../../core/signal-bus.js";

/**
 * Checks for a default action and if present adds its callback to the signal bus
 *
 * @param {Object} config - Gel configuration for this button
 */
const defaultAction = config => {
    if (config.action) {
        signal.bus.subscribe({
            channel: "gel-buttons",
            name: config.key,
            callback: config.action,
        });
    }
};

/**
 * Creates a new Gel button.
 * Phaser Game, x, y params are always stored in a curried version
 *
 * @function
 * @memberOf module:layout/button-factory
 * @param {Boolean} isMobile - Whether to use mobile or desktop sized assets
 * @param {Object} config - Gel configuration for this button
 */
const createButton = fp.curry((game, metrics, config, x = 0, y = 0) => {
    const btn = new GelButton(game, x, y, metrics, config); //Instantiate then return or TSC loses non-curried args

    defaultAction(config);
    const accessibleButton = accessibilify(btn, config);
    return accessibleButton;
});

export const create = game => ({ createButton: createButton(game) });
