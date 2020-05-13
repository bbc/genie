/**
 * @copyright BBC 2018
 * @author BBC Children's D+E
 * @license Apache-2.0
 */
import { settings, settingsChannel } from "../../core/settings.js";
// import * as GameSound from "../../core/game-sound.js";
import { gmi } from "../../core/gmi/gmi.js";
import { eventBus } from "../event-bus.js";
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
            id: "exit",
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
            id: "home",
            channel: buttonsChannel(screen),
            action: ({ screen }) => {
                gmi.sendStatsEvent("home", "click");
                screen.navigation.home();
            },
        },
        back: {
            group: "topLeft",
            title: "Back",
            key: "back",
            ariaLabel: "Back",
            order: 2,
            id: "back",
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
            id: "back",
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
            id: "audio",
            channel: buttonsChannel(screen),
            action: () => {
                const audioEnabled = gmi.getAllSettings().audio;
                gmi.setAudio(!audioEnabled);

                eventBus.publish({
                    channel: settingsChannel,
                    name: "audio",
                });

                gmi.sendStatsEvent("audio", gmi.getAllSettings().audio ? "on" : "off");
            },
        },
        settings: {
            group: "topRight",
            title: "Settings",
            key: "settings",
            ariaLabel: "Game Settings",
            order: 5,
            id: "settings",
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
            id: "pause",
            channel: buttonsChannel(screen),
            action: ({ screen }) => {
                screen.scene.pause();
                gmi.sendStatsEvent("pause", "click");
                screen.addOverlay("pause");
            },
        },
        previous: {
            group: "middleLeftSafe",
            title: "Previous",
            key: "previous",
            ariaLabel: "Previous Item",
            order: 7,
            id: "previous",
            channel: buttonsChannel(screen),
        },
        replay: {
            group: "middleCenter",
            title: "Replay",
            key: "replay",
            ariaLabel: "Replay Game",
            order: 8,
            id: "replay",
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
            id: "replay",
            channel: buttonsChannel(screen),
            action: ({ screen }) => {
                const belowScreenKey = getScreenBelow(screen).scene.key;
                screen.navigate(screen.context.navigation[belowScreenKey].routes.restart);
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
            id: "play",
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
            order: 9,
            id: "play",
            channel: buttonsChannel(screen),
            action: ({ screen }) => {
                getScreenBelow(screen).scene.resume();
                gmi.sendStatsEvent("play", "click");
                screen.removeOverlay();
            },
        },
        skip: {
            group: "bottomRight",
            title: "Skip",
            key: "skip",
            ariaLabel: "Skip",
            order: 6,
            id: "pause",
            channel: buttonsChannel(screen),
            action: ({ screen }) => {
                gmi.sendStatsEvent("skip", "click");
                screen.navigation.next();
            },
        },
        next: {
            group: "middleRightSafe",
            title: "Next",
            key: "next",
            ariaLabel: "Next Item",
            order: 10,
            id: "next",
            channel: buttonsChannel(screen),
        },
        achievements: {
            group: "bottomLeft",
            title: "Achievements",
            key: "achievements",
            ariaLabel: "Your Achievements",
            order: 11,
            id: "achievements",
            channel: buttonsChannel(screen),
            indicator: {
                offsets: {
                    mobile: { x: -12, y: 12 },
                    desktop: { x: -4, y: 4 },
                },
            },
            action: ({ screen }) => {
                if (screen.navigation.achievements) {
                    screen.navigation.achievements();
                } else {
                    gmi.achievements.show();
                }
                screen.layout.buttons.achievements.setIndicator();
            },
        },
        achievementsSmall: {
            group: "topLeft",
            title: "Achievements",
            key: "achievements-small",
            ariaLabel: "Your Achievements",
            order: 12,
            id: "achievements-small",
            channel: buttonsChannel(screen),
            indicator: {
                offsets: {
                    mobile: { x: -17, y: 17 },
                    desktop: { x: -12, y: 12 },
                },
            },
            action: ({ screen }) => {
                if (screen.navigation.achievements) {
                    screen.navigation.achievements();
                } else {
                    gmi.achievements.show();
                }
                screen.layout.buttons.achievementsSmall.setIndicator();
            },
        },
        restart: {
            group: "bottomCenter",
            title: "Restart",
            key: "restart",
            ariaLabel: "Restart Game",
            order: 12,
            id: "restart",
            channel: buttonsChannel(screen),
            action: ({ screen }) => {
                const params = pushLevelId(screen, ["level", "playagain"]);
                gmi.sendStatsEvent(...params);
            },
        },
        playAgain: {
            group: "bottomCenter",
            title: "Play Again",
            key: "restart",
            ariaLabel: "Play Again",
            order: 12,
            id: "restart",
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
            id: "continue",
            channel: buttonsChannel(screen),
        },
        continueGame: {
            group: "bottomCenter",
            title: "Continue",
            key: "continue",
            ariaLabel: "Continue Game",
            order: 13,
            id: "continue",
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
            id: "how-to-play",
            channel: buttonsChannel(screen),
            action: ({ screen }) => {
                screen.scene.pause();
                screen.addOverlay("how-to-play");
                gmi.sendStatsEvent("howtoplay", "click");
            },
        },
        debug: {
            group: "bottomCenter",
            title: "Debug",
            key: "debug",
            ariaLabel: "Debug",
            order: 15,
            id: "debug",
            channel: buttonsChannel(screen),
            action: ({ screen }) => {
                screen.navigation.debug();
            },
        },
    };
};
