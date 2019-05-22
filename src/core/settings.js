/**
 * @copyright BBC 2018
 * @author BBC Children's D+E
 * @license Apache-2.0
 */
import * as signal from "../core/signal-bus.js";
import { clearElementsFromDom, setAccessibleLayer } from "../core/accessibility/accessibility-layer.js"
import { gmi } from "./gmi/gmi.js";
import fp from "../../lib/lodash/fp/fp.js";

export const settingsChannel = "genie-settings";

let game;

export const create = () => {
    signal.bus.subscribe({
        channel: settingsChannel,
        name: "settings-closed",
        callback: () => {
            setAccessibleLayer(true);
        },
    });

    const onSettingChanged = (key, value) => {
        signal.bus.publish({
            channel: settingsChannel,
            name: key,
            data: value,
        });
    };

    const onSettingsClosed = () => {
        signal.bus.publish({
            channel: settingsChannel,
            name: "settings-closed",
            data: { game },
        });
    };

    return {
        show: game => {
            // get current buttons
            setAccessibleLayer(false);

            return gmi.showSettings(onSettingChanged, onSettingsClosed);
        },
        getAllSettings: () => gmi.getAllSettings(),
    };
};

// Singleton used by games
export const settings = create();
