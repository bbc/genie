import * as howToPlay from "../../components/overlays/how-to-play.js";
import * as pause from "../../components/overlays/pause.js";
import { settings } from "../../core/settings.js";
import { gmi, sendStats } from "../../core/gmi.js";

export const buttonsChannel = "gel-buttons";
export const config = {
    exit: {
        group: "topLeft",
        title: "Exit",
        key: "exit",
        ariaLabel: "Exit Game",
        order: 0,
        id: "__exit",
        channel: buttonsChannel,
        action: () => {
            gmi.exit();
            sendStats("click");
        },
    },
    home: {
        group: "topLeft",
        title: "Home",
        key: "home",
        ariaLabel: "Home",
        order: 1,
        id: "__home",
        channel: buttonsChannel,
        action: ({ game }) => {
            const screen = game.state.states[game.state.current];
            screen.navigation.home();
            sendStats("click");
        },
    },
    pauseHome: {
        group: "topLeft",
        title: "Home",
        key: "home",
        ariaLabel: "Home",
        order: 1,
        id: "__home",
        channel: "pause-gel-buttons",
        action: () => {
            sendStats("click");
        },
    },
    back: {
        group: "topLeft",
        title: "Back",
        key: "back",
        ariaLabel: "Back",
        order: 2,
        id: "__back",
        channel: buttonsChannel,
        action: () => {
            sendStats("click");
        },
    },
    howToPlayBack: {
        group: "topLeft",
        title: "Back",
        key: "back",
        ariaLabel: "Back",
        order: 2,
        id: "__back",
        channel: "how-to-play-gel-buttons",
        action: () => {
            sendStats("click");
        },
    },
    audioOff: {
        group: "topRight",
        title: "Sound Off",
        key: "audio-off",
        ariaLabel: "Disable Sound",
        order: 3,
        id: "__audio--off",
        channel: buttonsChannel,
        action: () => {
            sendStats("click");
        },
    },
    audioOn: {
        group: "topRight",
        title: "Sound On",
        key: "audio-on",
        ariaLabel: "Enable Sound",
        order: 4,
        id: "__audio--on",
        channel: buttonsChannel,
        action: () => {
            sendStats("click");
        },
    },
    settings: {
        group: "topRight",
        title: "Settings",
        key: "settings",
        ariaLabel: "Game Settings",
        order: 5,
        id: "__settings",
        channel: buttonsChannel,
        action: () => {
            settings.show();
            sendStats("click");
        },
    },
    pause: {
        group: "topRight",
        title: "Pause",
        key: "pause",
        ariaLabel: "Pause Game",
        order: 6,
        id: "__pause",
        channel: buttonsChannel,
        action: ({ game }) => {
            pause.create(false, { game });
            sendStats("click");
        },
    },
    pauseNoReplay: {
        group: "topRight",
        title: "Pause",
        key: "pause",
        ariaLabel: "Pause Game",
        order: 6,
        id: "__pause",
        channel: buttonsChannel,
        action: ({ game }) => {
            pause.create(true, { game });
            sendStats("click");
        },
    },
    previous: {
        group: "middleLeftSafe",
        title: "Previous",
        key: "previous",
        ariaLabel: "Previous Item",
        order: 7,
        id: "__previous",
        channel: buttonsChannel,
        action: () => {
            sendStats("click");
        },
    },
    howToPlayPrevious: {
        group: "middleLeftSafe",
        title: "Previous",
        key: "previous",
        ariaLabel: "Previous Item",
        order: 7,
        id: "__previous",
        channel: "how-to-play-gel-buttons",
        action: () => {
            sendStats("click");
        },
    },
    replay: {
        group: "middleCenter",
        title: "Replay",
        key: "replay",
        ariaLabel: "Replay Game",
        order: 8,
        id: "__replay",
        action: () => {
            sendStats("click");
        },
    },
    pauseReplay: {
        group: "middleCenter",
        title: "Replay",
        key: "replay",
        ariaLabel: "Replay Game",
        order: 8,
        id: "__replay",
        channel: "pause-gel-buttons",
        action: () => {
            sendStats("click");
        },
    },
    play: {
        group: "middleCenter",
        title: "Play",
        key: "play",
        ariaLabel: "Play Game",
        order: 9,
        id: "__play",
        channel: buttonsChannel,
        positionOverride: true,
        action: () => {
            sendStats("click");
        },
    },
    pausePlay: {
        group: "middleCenter",
        title: "Play",
        key: "play",
        ariaLabel: "Play Game",
        order: 8,
        id: "__play",
        channel: "pause-gel-buttons",
        action: () => {
            sendStats("click");
        },
    },
    next: {
        group: "middleRightSafe",
        title: "Next",
        key: "next",
        ariaLabel: "Next Item",
        order: 10,
        id: "__next",
        channel: buttonsChannel,
        action: () => {
            sendStats("click");
        },
    },
    howToPlayNext: {
        group: "middleRightSafe",
        title: "Next",
        key: "next",
        ariaLabel: "Next Item",
        order: 10,
        id: "__next",
        channel: "how-to-play-gel-buttons",
        action: () => {
            sendStats("click");
        },
    },
    achievements: {
        group: "bottomLeft",
        title: "Achievements",
        key: "achievements",
        ariaLabel: "Your Achievements",
        order: 11,
        id: "__achievements",
        channel: buttonsChannel,
        action: () => {
            sendStats("click");
        },
    },
    restart: {
        group: "bottomCenter",
        title: "Restart",
        key: "restart",
        ariaLabel: "Restart Game",
        order: 12,
        id: "__restart",
        channel: buttonsChannel,
        action: () => {
            sendStats("click");
        },
    },
    continue: {
        group: "bottomCenter",
        title: "Continue",
        key: "continue",
        ariaLabel: "Continue Game",
        order: 13,
        id: "__continue",
        channel: buttonsChannel,
        action: () => {
            sendStats("click");
        },
    },
    howToPlay: {
        group: "bottomRight",
        title: "How To Play",
        key: "how-to-play",
        ariaLabel: "Game Instructions",
        order: 14,
        id: "__how-to-play",
        channel: buttonsChannel,
        action: ({ game }) => {
            howToPlay.create({ game });
            sendStats("click");
        },
    },
};
