import * as signal from "../core/signal-bus.js";
import fp from "../lib/lodash/fp/fp.js";
import * as gel from "./layout/gel-defaults.js";

export const settingsChannel = "genie-settings";

export const create = () => {
    let gmi;

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
        document.getElementById(gel.config.settings.id).focus();
    };

    const setGmi = newGmi => (gmi = newGmi);

    const callGmi = () => gmi.showSettings(onSettingChanged, onSettingsClosed);

    const show = fp.flow(checkGmi, callGmi);

    return {
        setGmi,
        show,
    };
};

// Singleton used by games
export const settings = create();
