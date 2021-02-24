/**
 * A Gel Button Factory exists on each layout group. It has one method {@link module:layout/button-factory.createButtonFn createButton}
 *
 * @module core/layout/button-factory
 * @copyright BBC 2018
 * @author BBC Children's D+E
 * @license Apache-2.0
 */
import { eventBus } from "../../core/event-bus.js";
import { accessibilify } from "../accessibility/accessibilify.js";
import { GelButton } from "./gel-button.js";
import { settings } from "../settings.js";

const defaultAction = config => {
    if (config.action) {
        eventBus.subscribe({
            channel: config.channel,
            name: config.id,
            callback: config.action,
        });
    }
};

export const createButton = (scene, config, x = 0, y = 0) => {
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

    return config.accessibilityEnabled? accessibilify(btn, false) : btn;

};
