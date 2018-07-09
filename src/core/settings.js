import fp from "../../lib/lodash/fp/fp.js";
import * as signal from "../core/signal-bus.js";
import { gmi } from "./gmi.js";

export const settingsChannel = "genie-settings";

export const create = () => {
    const onSettingChanged = (key, value) => {
        signal.bus.publish({
            channel: settingsChannel,
            name: key,
            data: value,
        });
    };

    const checkGmi = () => {
        if (!gmi) {
            throw "gmi has not been initialised in settings.js";
        }
    };

    const onSettingsClosed = () => {
        signal.bus.publish({
            channel: settingsChannel,
            name: "settingsClosed",
        });
    };

    const getAllSettings = fp.flow(checkGmi, () => gmi.getAllSettings());

    const show = fp.flow(checkGmi, () => gmi.showSettings(onSettingChanged, onSettingsClosed));
    const exit = fp.flow(checkGmi, () => gmi.exit());

    return {
        exit,
        show,
        getAllSettings,
    };
};

// Singleton used by games
export const settings = create();
