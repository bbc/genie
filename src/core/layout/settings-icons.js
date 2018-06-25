import * as signal from "../signal-bus.js";
import { settingsChannel } from "../settings.js";
//import fp from "../../../lib/lodash/fp/fp.js";

//const fxButtonConfig = {
//    title: "FX Off",
//    key: "fx-off-icon",
//    id: "fx-off",
//};

const audioButtonConfig = {
    title: "Audio Off",
    key: "audio-off-icon",
    id: "audio-off",
};

const createAudioIcon = (group, buttonIds) => {
    if (buttonIds.includes("audioOff")) {
        return;
    }

    let button;

    const callback = bool => {
        if (!bool) {
            button = group.addButton(audioButtonConfig, 0);
        } else if (button) {
            group.removeButton(button);
        }
    };

    //signal.bus.subscribe
    signal.bus.subscribe({
        channel: settingsChannel,
        name: "audio",
        callback,
    });
};

export const create = (group, buttonIds) => {
    //console.log(buttonIds);
    //const fxOffButton = group.addButton(fxButtonConfig, 0);

    window.s = signal;

    createAudioIcon(group, buttonIds);
};

// Pops when addButton is called. Does addButton resize the group?
// Crashes after destroy when breakpoints are hit. Probably need to also remove from group internal button array
// Why does the callback get called 4 times? - because it's called on each of the screens that have been set up.
