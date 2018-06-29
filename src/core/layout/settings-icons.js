import { settingsChannel } from "../settings.js";
import { gmi } from "../gmi.js";
import fp from "../../../lib/lodash/fp/fp.js";

const fxConfig = {
    title: "FX Off",
    key: "fx-off-icon",
    id: "fx-off",
    signalName: "motion",
};

const audioConfig = {
    title: "Audio Off",
    key: "audio-off-icon",
    id: "audio-off",
    signalName: "audio",
};

const createSignals = (group, config, signal) => {
    let icon;

    const callback = bool => {
        if (!bool) {
            if (!icon) {
                icon = group.addButton(config, 0);
            }
        } else if (icon) {
            group.removeButton(icon);
        }
    };

    //signal.bus.subscribe
    return signal.bus.subscribe({
        channel: settingsChannel,
        name: config.signalName,
        callback,
    });
};

const publish = fp.curry((settings, signal, key) => {
    signal.bus.publish({
        channel: settingsChannel,
        name: key,
        data: settings[key],
    });
});

export const create = (group, buttonIds, signals) => {
    window.s = signals;

    let iconSignals = [];

    if (!buttonIds.includes("audioOff")) {
        iconSignals.push(createSignals(group, audioConfig, signals));
    }

    iconSignals.push(createSignals(group, fxConfig, signals));

    const settings = gmi.getAllSettings();

    ["audio", "motion"].forEach(publish(settings, signals));

    return {
        destroy: () => {
            iconSignals.forEach(signal => signal.unsubscribe());
        },
    };

    //return the signals made above OR a function to kill them
};

// Pops when addButton is called. Does addButton resize the group?
// Add ticket for cage settings simulator in dev html
