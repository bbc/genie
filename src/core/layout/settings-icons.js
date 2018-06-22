import * as signal from "../signal-bus.js";
import { settingsChannel } from "../settings.js";

export function create(group, buttonIds) {
    const fxButtonConfig = {
        title: "FX Off",
        key: "fx-off-icon",
        id: "fx-off",
    };

    const audioButtonConfig = {
        title: "Audio Off",
        key: "audio-off-icon",
        id: "audio-off",
    };

    //console.log(buttonIds);
    //const fxOffButton =
    group.addButton(fxButtonConfig, 0);

    let audioOffButton;

    if (!buttonIds.includes("audioOff")) {
        audioOffButton = group.addButton(audioButtonConfig, 0);
    }

    //signal.bus.subscribe
    signal.bus.subscribe({
        channel: settingsChannel,
        name: "audio",
        callback: bool => {
            if (bool) {
                audioOffButton = group.addButton(audioButtonConfig, 0);
            } else {
                audioOffButton && audioOffButton.destroy();
            }
        },
    });
}
