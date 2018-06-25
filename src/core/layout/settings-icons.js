import * as signal from "../signal-bus.js";
import { settingsChannel } from "../settings.js";
//import fp from "../../../lib/lodash/fp/fp.js";

const fxConfig = {
    title: "FX Off",
    key: "fx-off-icon",
    id: "fx-off",
    signalName: "fx",
};

const audioConfig = {
    title: "Audio Off",
    key: "audio-off-icon",
    id: "audio-off",
    signalName: "audio",
};

const createIcon = (group, config) => {
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

export const create = group => {
    //, buttonIds) => {
    //console.log(buttonIds);
    //const fxOffButton = group.addButton(fxButtonConfig, 0);

    window.s = signal;

    //    if (!buttonIds.includes("audioOff")) {
    createIcon(group, audioConfig);
    //    }

    createIcon(group, fxConfig);
};

// Pops when addButton is called. Does addButton resize the group?
// Note it gets called once for each screen
// Fire signals when state is started (check gmi )
// Add fx setting
