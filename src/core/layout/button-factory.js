/**
 * A Gel Button Factory exists on each layout group. It has one method {@link module:layout/button-factory.createButton createButton}
 *
 * @module core/layout/button-factory
 * @copyright BBC 2018
 * @author BBC Children's D+E
 * @license Apache-2.0
 */
import fp from "../../../lib/lodash/fp/fp.js";
import { eventBus } from "../../core/event-bus.js";
import { accessibilify } from "../accessibility/accessibilify.js";
import { GelButton } from "./gel-button.js";
import { settings } from "../settings.js";

/**
 * Checks for a default action and if present adds its callback to the event bus
 *
 * @param {Object} config - Gel configuration for this button
 */
const defaultAction = config => {
    if (config.action) {
        eventBus.subscribe({
            channel: config.channel,
            name: config.id,
            callback: config.action,
        });
    }
};

/**
 * Creates a new Gel button.
 * Phaser Scene, x, y params are always stored in a curried version
 *
 * @function
 * @memberOf module:layout/button-factory
 * @param {Boolean} isMobile - Whether to use mobile or desktop sized assets
 * @param {Object} config - Gel configuration for this button
 */
const createButton = fp.curry((scene, config, x = 0, y = 0) => {
    if (config.id === "audio") {
        config.key = settings.getAllSettings().audio ? "audio-on" : "audio-off";
    }

    const btn = new GelButton(scene, x, y, config);

    if (config.icon) {
        btn.disableInteractive();
        btn.input.hitArea = null;
        return btn;
    }

    defaultAction(config);

    if (config.accessibilityEnabled) {
        return accessibilify(btn, false);
    }

    return btn;
});

export const create = scene => ({ createButton: createButton(scene) });
