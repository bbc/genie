import * as pause from "../../components/overlays/pause.js";
import * as howToPlay from "../../components/overlays/how-to-play.js";
import { settings } from "../settings.js";

let gmi;

export const setGmi = newGmi => {
    gmi = newGmi;
};

const callGmi = method => () => {
    if (gmi) {
        gmi[method]();
    } else {
        throw "gmi has not been initialised in gel-defaults";
    }
};

export const config = {
    exit: {
        group: "topLeft",
        title: "Exit",
        key: "exit",
        ariaLabel: "Exit Game",
        order: 0,
        id: "gel-exit",
        channel: "gel-buttons",
        action: callGmi("exit"),
    },
    home: {
        group: "topLeft",
        title: "Home",
        key: "home",
        ariaLabel: "Home",
        order: 1,
        id: "gel-home",
        channel: "gel-buttons",
        action: ({ game }) => {
            const screen = game.state.states[game.state.current];
            screen.navigation.home();
        },
    },
    pauseHome: {
        group: "topLeft",
        title: "Home",
        key: "home",
        ariaLabel: "Home",
        order: 1,
        id: "gel-home",
        channel: "pause-gel-buttons",
    },
    back: {
        group: "topLeft",
        title: "Back",
        key: "back",
        ariaLabel: "Back",
        order: 2,
        id: "gel-back",
        channel: "gel-buttons",
    },
    howToPlayBack: {
        group: "topLeft",
        title: "Back",
        key: "back",
        ariaLabel: "Back",
        order: 2,
        id: "gel-back",
        channel: "how-to-play-gel-buttons",
    },
    audioOff: {
        group: "topRight",
        title: "Sound Off",
        key: "audio-off",
        ariaLabel: "Disable Sound",
        order: 3,
        id: "gel-audio-off",
        channel: "gel-buttons",
    },
    audioOn: {
        group: "topRight",
        title: "Sound On",
        key: "audio-on",
        ariaLabel: "Enable Sound",
        order: 4,
        id: "gel-audio-on",
        channel: "gel-buttons",
    },
    settings: {
        group: "topRight",
        title: "Settings",
        key: "settings",
        ariaLabel: "Game Settings",
        order: 5,
        id: "gel-settings",
        channel: "gel-buttons",
        action: settings.show,
    },
    pause: {
        group: "topRight",
        title: "Pause",
        key: "pause",
        ariaLabel: "Pause Game",
        order: 6,
        id: "gel-pause",
        action: pause.create,
        channel: "gel-buttons",
    },
    previous: {
        group: "middleLeft",
        title: "Previous",
        key: "previous",
        ariaLabel: "Previous Item",
        order: 7,
        id: "gel-previous",
        channel: "gel-buttons",
    },
    howToPlayPrevious: {
        group: "middleLeft",
        title: "Previous",
        key: "previous",
        ariaLabel: "Previous Item",
        order: 7,
        id: "gel-previous",
        channel: "how-to-play-gel-buttons",
    },
    replay: {
        group: "middleCenter",
        title: "Replay",
        key: "replay",
        ariaLabel: "Replay Game",
        order: 8,
        id: "gel-replay",
    },
    pauseReplay: {
        group: "middleCenter",
        title: "Replay",
        key: "replay",
        ariaLabel: "Replay Game",
        order: 8,
        id: "gel-replay",
        channel: "pause-gel-buttons",
    },
    play: {
        group: "middleCenter",
        title: "Play",
        key: "play",
        ariaLabel: "Play Game",
        order: 9,
        id: "gel-play",
        channel: "gel-buttons",
    },
    pausePlay: {
        group: "middleCenter",
        title: "Play",
        key: "play",
        ariaLabel: "Play Game",
        order: 8,
        id: "gel-play",
        channel: "pause-gel-buttons",
    },
    next: {
        group: "middleRight",
        title: "Next",
        key: "next",
        ariaLabel: "Next Item",
        order: 10,
        id: "gel-next",
        channel: "gel-buttons",
    },
    howToPlayNext: {
        group: "middleRight",
        title: "Next",
        key: "next",
        ariaLabel: "Next Item",
        order: 10,
        id: "gel-next",
        channel: "how-to-play-gel-buttons",
    },
    achievements: {
        group: "bottomLeft",
        title: "Achievements",
        key: "achievements",
        ariaLabel: "Your Achievements",
        order: 11,
        id: "gel-achievements",
        channel: "gel-buttons",
    },
    restart: {
        group: "bottomCenter",
        title: "Restart",
        key: "restart",
        ariaLabel: "Restart Game",
        order: 12,
        id: "gel-restart",
        channel: "gel-buttons",
    },
    continue: {
        group: "bottomCenter",
        title: "Continue",
        key: "continue",
        ariaLabel: "Continue Game",
        order: 13,
        id: "gel-continue",
        channel: "gel-buttons",
    },
    howToPlay: {
        group: "bottomRight",
        title: "How To Play",
        key: "how-to-play",
        ariaLabel: "Game Instructions",
        order: 14,
        action: howToPlay.create,
        channel: "gel-buttons",
    },
};
