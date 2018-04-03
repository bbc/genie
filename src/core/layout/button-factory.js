/**
 * A Gel Button Factory exists on each layout group. It has one method {@link module:layout/button-factory.createButton createButton}
 *
 * @module layout/button-factory
 */
import fp from "../../lib/lodash/fp/fp.js";
import { accessibilify } from "../../lib/accessibilify/accessibilify.js";
import { GelButton } from "./gel-button.js";

/**
 * Creates a new Gel button.
 * Phaser Game, x, y params are always stored in a curried version
 *
 * @function
 * @memberOf module:layout/button-factory
 * @param {Boolean} isMobile - Whether to use mobile or desktop sized assets
 * @param {Object} config - Gel configuration for this button
 */
const createButton = fp.curry((game, isMobile, config, x = 0, y = 0) => {
    const btn = new GelButton(game, x, y, isMobile, config.key); //Instantiate then return or TSC loses non-curried args
    return accessibilify(btn, config);
});

export const create = game => ({ createButton: createButton(game) });
