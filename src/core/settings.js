import * as signal from "../core/signal-bus.js";
import { gmi } from "./gmi.js";

export const settingsChannel = "genie-settings";

export const create = () => {
    const onSettingChanged = (key, value) => {
        signal.bus.publish({
            channel: settingsChannel,
            name: "settingChanged-" + key,
            data: value,
        });
    };

    const onSettingsClosed = () => {
        signal.bus.publish({
            channel: settingsChannel,
            name: "settingsClosed",
        });
    };

    return {
        show: () => gmi.showSettings(onSettingChanged, onSettingsClosed),
        getAllSettings: () => gmi.getAllSettings(),
    };
};

// Singleton used by games
export const settings = create();
