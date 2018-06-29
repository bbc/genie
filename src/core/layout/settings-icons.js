import { settingsChannel } from "../settings.js";
import { gmi } from "../gmi.js";
import fp from "../../../lib/lodash/fp/fp.js";

let signal;

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
            icon = group.addButton(config, 0);
        } else if (icon) {
            group.removeButton(icon);
        }
    };

    //signal.bus.subscribe
    signal.bus.subscribe({
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

    if (!buttonIds.includes("audioOff")) {
        createSignals(group, audioConfig, signals);
    }

    createSignals(group, fxConfig, signals);

    const settings = gmi.getAllSettings();

    ["audio", "motion"].forEach(publish(settings, signals));
};

// Pops when addButton is called. Does addButton resize the group?
// Note it gets called once for each screen - Tear down these on screen exit
// Add ticket for cage settings simulator in dev html

//Done?
// Fire signals when state is started (check gmi )
// Add fx setting
