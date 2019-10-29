/**
 * @copyright BBC 2018
 * @author BBC Children's D+E
 * @license Apache-2.0
 */
import { settings, settingsChannel } from "../../core/settings.js";
import { gmi } from "../../core/gmi/gmi.js";
import * as signal from "../signal-bus.js";
import fp from "../../../lib/lodash/fp/fp.js";

const pushLevelId = (screen, params) => {
    const levelId = fp.get("transientData.level-select.choice.title", screen.context);
    return levelId ? [...params, { source: levelId }] : params;
};

const getScreenBelow = screen => {
    return screen.context.parentScreens.slice(-1)[0];
};

export const buttonsChannel = screen => (screen ? `gel-buttons-${screen.scene.key}` : "gel-buttons");
export const config = screen => {
    return {
        exit: {
            group: "topLeft",
            title: "Exit",
            key: "exit",
            ariaLabel: "Exit Game",
            order: 0,
            id: "__exit",
            channel: buttonsChannel(screen),
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
            channel: buttonsChannel(screen),
            action: ({ screen }) => {
                screen.navigation.home();
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
            action: ({ screen }) => {
                gmi.sendStatsEvent("back", "click");
                screen.navigation.back();
            },
        },
        overlayBack: {
            group: "topLeft",
            title: "Back",
            key: "back",
            ariaLabel: "Back",
            order: 2,
            id: "__back",
            channel: buttonsChannel(screen),
            action: ({ screen }) => {
                getScreenBelow(screen).scene.resume();
                gmi.sendStatsEvent("back", "click");
                screen.removeOverlay();
            },
        },
        audio: {
            group: "topRight",
            title: "Sound Off",
            key: "audio-on",
            ariaLabel: "Toggle Sound",
            order: 3,
            id: "__audio",
            channel: buttonsChannel(screen),
            action: ({ screen }) => {
                const muted = !screen.sound.mute;
                gmi.setAudio(!muted);

                signal.bus.publish({
                    channel: settingsChannel,
                    name: "audio",
                    data: muted,
                });

                gmi.sendStatsEvent("audio", muted ? "off" : "on");
            },
        },
        settings: {
            group: "topRight",
            title: "Settings",
            key: "settings",
            ariaLabel: "Game Settings",
            order: 5,
            id: "__settings",
            channel: buttonsChannel(screen),
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
            channel: buttonsChannel(screen),
            action: ({ screen }) => {
                screen.scene.pause();
                gmi.sendStatsEvent("pause", "click");
                screen.addOverlay("pause");
            },
        },
        pauseNoReplay: {
            group: "topRight",
            title: "Pause",
            key: "pause",
            ariaLabel: "Pause Game",
            order: 6,
            id: "__pause",
            channel: buttonsChannel(screen),
            action: ({ screen }) => {
                screen.scene.pause();
                gmi.sendStatsEvent("pause", "click");
                screen.addOverlay("pause-noreplay");
            },
        },
        previous: {
            group: "middleLeftSafe",
            title: "Previous",
            key: "previous",
            ariaLabel: "Previous Item",
            order: 7,
            id: "__previous",
            channel: buttonsChannel(screen),
        },
        replay: {
            group: "middleCenter",
            title: "Replay",
            key: "replay",
            ariaLabel: "Replay Game",
            order: 8,
            id: "__replay",
            action: ({ screen }) => {
                const params = pushLevelId(screen, ["level", "playagain"]);
                gmi.sendStatsEvent(...params);
            },
        },
        pauseReplay: {
            group: "middleCenter",
            title: "Replay",
            key: "replay",
            ariaLabel: "Replay Game",
            order: 8,
            id: "__replay",
            channel: buttonsChannel(screen),
            action: ({ screen }) => {
                const belowScreenKey = getScreenBelow(screen).scene.key;
                screen._navigate(screen.context.navigation[belowScreenKey].routes.restart);
                const params = pushLevelId(screen, ["level", "playagain"]);
                gmi.sendStatsEvent(...params);
            },
        },
        play: {
            group: "middleCenter",
            title: "Play",
            key: "play",
            ariaLabel: "Play Game",
            order: 9,
            id: "__play",
            channel: buttonsChannel(screen),
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
            channel: buttonsChannel(screen),
            action: ({ screen }) => {
                getScreenBelow(screen).scene.resume();
                gmi.sendStatsEvent("play", "click");
                screen.removeOverlay();
            },
        },
        next: {
            group: "middleRightSafe",
            title: "Next",
            key: "next",
            ariaLabel: "Next Item",
            order: 10,
            id: "__next",
            channel: buttonsChannel(screen),
        },
        achievements: {
            group: "bottomLeft",
            title: "Achievements",
            key: "achievements",
            ariaLabel: "Your Achievements",
            order: 11,
            id: "__achievements",
            channel: buttonsChannel(screen),
            action: ({ screen }) => {
                if (screen.navigation.achievements) {
                    screen.navigation.achievements();
                } else {
                    gmi.achievements.show();
                }
                screen.layouts[0].buttons.achievements.setIndicator();
            },
        },
        restart: {
            group: "bottomCenter",
            title: "Restart",
            key: "restart",
            ariaLabel: "Restart Game",
            order: 12,
            id: "__restart",
            channel: buttonsChannel(screen),
            action: ({ screen }) => {
                const params = pushLevelId(screen, ["level", "playagain"]);
                gmi.sendStatsEvent(...params);
            },
        },
        continue: {
            group: "bottomCenter",
            title: "Continue",
            key: "continue",
            ariaLabel: "Continue",
            order: 13,
            id: "__continue",
            channel: buttonsChannel(screen),
        },
        continueGame: {
            group: "bottomCenter",
            title: "Continue",
            key: "continue",
            ariaLabel: "Continue Game",
            order: 13,
            id: "__continue",
            channel: buttonsChannel(screen),
            action: ({ screen }) => {
                const params = pushLevelId(screen, ["level", "continue"]);
                gmi.sendStatsEvent(...params);
            },
        },
        howToPlay: {
            group: "bottomRight",
            title: "How To Play",
            key: "how-to-play",
            ariaLabel: "Game Instructions",
            order: 14,
            id: "__how-to-play",
            channel: buttonsChannel(screen),
            action: ({ screen }) => {
                screen.scene.pause();
                screen.addOverlay("how-to-play");
                gmi.sendStatsEvent("howtoplay", "click");
            },
        },
    };
};
