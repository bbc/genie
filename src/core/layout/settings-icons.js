import * as signal from "../signal-bus.js";
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

const createSignals = (group, config) => {
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

const publish = fp.curry((settings, key) => {
    signal.bus.publish({
        channel: settingsChannel,
        name: key,
        data: settings[key],
    });
});

export const create = (group, buttonIds) => {
    window.s = signal;

    if (!buttonIds.includes("audioOff")) {
        createSignals(group, audioConfig);
    }

    createSignals(group, fxConfig);

    const settings = gmi.getAllSettings();

    ["audio", "motion"].forEach(publish(settings));
};

// Pops when addButton is called. Does addButton resize the group?
// Note it gets called once for each screen - Tear down these on screen exit
// Add ticket for cage settings simulator in dev html

//Done?
// Fire signals when state is started (check gmi )
// Add fx setting
