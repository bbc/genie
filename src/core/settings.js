/**
 * @copyright BBC 2018
 * @author BBC Children's D+E
 * @license Apache-2.0
 */
import * as signal from "../core/signal-bus.js";
import { gmi } from "./gmi/gmi.js";
import fp from "../../lib/lodash/fp/fp.js";

export const settingsChannel = "genie-settings";

export const create = () => {
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
        });
    };

    return {
        show: game => {
            // get current buttons
            const screen = game.state.states[game.state.current];
            const buttons = screen.scene.getLayouts()[0].buttons;

            fp.map(button => {
                button.inputEnabled = false;
            }, buttons);

            return gmi.showSettings(onSettingChanged, onSettingsClosed);
        },
        getAllSettings: () => gmi.getAllSettings(),
    };
};

// Singleton used by games
export const settings = create();
