/**
 * @copyright BBC 2018
 * @author BBC Children's D+E
 * @license Apache-2.0
 */
import * as howToPlay from "../../components/overlays/how-to-play.js";
import * as pause from "../../components/overlays/pause.js";
import { settings, settingsChannel } from "../../core/settings.js";
import { gmi } from "../../core/gmi/gmi.js";
import * as signal from "../signal-bus.js";

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
            gmi.sendStatsEvent("exit", "click");
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
            gmi.sendStatsEvent("back", "click");
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
            gmi.sendStatsEvent("back", "click");
        },
    },
    audio: {
        group: "topRight",
        title: "Sound Off",
        key: "audio-on",
        ariaLabel: "Toggle Sound",
        order: 3,
        id: "__audio",
        channel: buttonsChannel,
        action: ({ game }) => {
            const enabled = game.sound.mute;

            gmi.setAudio(enabled);

            signal.bus.publish({
                channel: settingsChannel,
                name: "audio",
                data: enabled,
            });

            const audioOnOrOff = enabled ? "on" : "off";
            gmi.sendStatsEvent("audio", audioOnOrOff);
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
        action: ({ game }) => {
            settings.show(game);
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
            gmi.sendStatsEvent("pause", "click");
            pause.create(false, { game });
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
            gmi.sendStatsEvent("pause", "click");
            pause.create(true, { game });
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
    },
    howToPlayPrevious: {
        group: "middleLeftSafe",
        title: "Previous",
        key: "previous",
        ariaLabel: "Previous Item",
        order: 7,
        id: "__previous",
        channel: "how-to-play-gel-buttons",
    },
    replay: {
        group: "middleCenter",
        title: "Replay",
        key: "replay",
        ariaLabel: "Replay Game",
        order: 8,
        id: "__replay",
        action: () => {
            gmi.sendStatsEvent("level", "playagain");
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
            gmi.sendStatsEvent("level", "playagain");
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
            gmi.sendStatsEvent("play", "click");
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
            gmi.sendStatsEvent("play", "click");
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
    },
    howToPlayNext: {
        group: "middleRightSafe",
        title: "Next",
        key: "next",
        ariaLabel: "Next Item",
        order: 10,
        id: "__next",
        channel: "how-to-play-gel-buttons",
    },
    achievements: {
        group: "bottomLeft",
        title: "Achievements",
        key: "achievements",
        ariaLabel: "Your Achievements",
        order: 11,
        id: "__achievements",
        channel: buttonsChannel,
        action: ({ game }) => {
            const screen = game.state.states[game.state.current];
            if (screen.navigation.achievements) {
                screen.navigation.achievements();
            } else {
                gmi.achievements.show();
            }
            gmi.sendStatsEvent("achievements", "click");

            screen.scene.getLayouts()[0].buttons.achievements.setIndicator();
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
            gmi.sendStatsEvent("level", "playagain");
        },
    },
    continue: {
        group: "bottomCenter",
        title: "Continue",
        key: "continue",
        ariaLabel: "Continue",
        order: 13,
        id: "__continue",
        channel: buttonsChannel,
    },
    continueGame: {
        group: "bottomCenter",
        title: "Continue",
        key: "continue",
        ariaLabel: "Continue Game",
        order: 13,
        id: "__continue",
        channel: buttonsChannel,
        action: () => {
            gmi.sendStatsEvent("level", "continue");
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
            gmi.sendStatsEvent("howtoplay", "click");
        },
    },
};
