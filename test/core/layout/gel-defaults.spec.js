/**
 * @copyright BBC 2018
 * @author BBC Children's D+E
 * @license Apache-2.0
 */
import { createMockGmi } from "../../fake/gmi";

import * as howToPlay from "../../../src/components/overlays/how-to-play.js";
import * as gel from "../../../src/core/layout/gel-defaults.js";
import * as pause from "../../../src/components/overlays/pause.js";
import { settings, settingsChannel } from "../../../src/core/settings.js";
import * as gmiModule from "../../../src/core/gmi/gmi.js";
import * as signal from "../../../src/core/signal-bus.js";

describe("Layout - Gel Defaults", () => {
    let mockCurrentScreen;
    let mockGame;
    let mockGmi;

    beforeEach(() => {
        mockCurrentScreen = {
            navigation: {
                home: jest.fn(),
                achievements: jest.fn(),
            },
        };
        mockGame = {
            sound: { mute: false },
            state: {
                current: "current-screen",
                states: { "current-screen": mockCurrentScreen },
            },
        };

        mockGmi = { exit: jest.fn(), setAudio: jest.fn() };
        createMockGmi(mockGmi);
        jest.spyOn(gmiModule, "sendStats");

        jest.spyOn(pause, "create").mockImplementation(() => {});
        jest.spyOn(settings, "show").mockImplementation(() => {});
        jest.spyOn(howToPlay, "create").mockImplementation(() => {});
    });

    afterEach(() => jest.clearAllMocks());

    describe("Exit Button Callback", () => {
        beforeEach(() => gel.config.exit.action());

        test("exits the game using the GMI", () => {
            expect(mockGmi.exit).toHaveBeenCalled();
        });

        test("sends a click stat to the GMI", () => {
            expect(gmiModule.sendStats).toHaveBeenCalledWith("click", { action_type: "exit" });
        });
    });

    describe("Home Button Callback", () => {
        beforeEach(() => {
            gel.config.home.action({ game: mockGame });
        });

        test("navigates to the home screen", () => {
            const homeNavigationSpy = mockGame.state.states["current-screen"].navigation.home;
            expect(homeNavigationSpy);
        });

        test("sends a click stat to the GMI", () => {
            expect(gmiModule.sendStats).toHaveBeenCalledWith("click", { action_type: "home" });
        });
    });

    describe("Pause Home Callback", () => {
        beforeEach(() => {
            gel.config.pauseHome.action();
        });

        test("sends a click stat to the GMI", () => {
            expect(gmiModule.sendStats).toHaveBeenCalledWith("click", { action_type: "home" });
        });
    });

    describe("Back Callback", () => {
        beforeEach(() => {
            gel.config.back.action();
        });

        test("sends a click stat to the GMI", () => {
            expect(gmiModule.sendStats).toHaveBeenCalledWith("click", { action_type: "back" });
        });
    });

    describe("How To Play Back Callback", () => {
        beforeEach(() => {
            gel.config.howToPlayBack.action();
        });

        test("sends a click stat to the GMI", () => {
            expect(gmiModule.sendStats).toHaveBeenCalledWith("click", { action_type: "back" });
        });
    });

    describe("Audio Callback", () => {
        beforeEach(() => {
            jest.spyOn(signal.bus, "publish");
            gel.config.audio.action({ game: mockGame });
        });

        test("sends a click stat to the GMI", () => {
            expect(gmiModule.sendStats).toHaveBeenCalledWith("click", { action_type: "audio" });
        });

        test("sets audio on the GMI", () => {
            expect(mockGmi.setAudio).toHaveBeenCalledWith(false);
        });

        test("mutes the game audio", () => {
            expect(signal.bus.publish).toHaveBeenCalledWith({
                channel: settingsChannel,
                name: "audio",
                data: false,
            });
        });

        test("unmutes the game audio", () => {
            mockGame.sound.mute = true;
            gel.config.audio.action({ game: mockGame });

            expect(signal.bus.publish).toHaveBeenCalledWith({
                channel: settingsChannel,
                name: "audio",
                data: true,
            });
        });
    });

    describe("Settings Button Callback", () => {
        beforeEach(() => {
            gel.config.settings.action();
        });

        test("shows the settings", () => {
            expect(settings.show).toHaveBeenCalled();
        });

        test("sends a click stat to the GMI", () => {
            expect(gmiModule.sendStats).toHaveBeenCalledWith("click", { action_type: "settings" });
        });
    });

    describe("Pause Button Callback", () => {
        beforeEach(() => {
            gel.config.pause.action({ game: mockGame });
        });

        test("creates a pause screen", () => {
            expect(pause.create).toHaveBeenCalledWith(false, { game: mockGame });
        });

        test("sends a click stat to the GMI", () => {
            expect(gmiModule.sendStats).toHaveBeenCalledWith("click", { action_type: "pause" });
        });
    });

    describe("Pause No Replay Button Callback", () => {
        beforeEach(() => {
            gel.config.pauseNoReplay.action({ game: mockGame });
        });

        test("creates a pause screen with replay button hidden", () => {
            expect(pause.create).toHaveBeenCalledWith(true, { game: mockGame });
        });

        test("sends a click stat to the GMI", () => {
            expect(gmiModule.sendStats).toHaveBeenCalledWith("click", { action_type: "pause" });
        });
    });

    describe("Replay Button Callback", () => {
        beforeEach(() => {
            gel.config.replay.action();
        });

        test("sends a click stat to the GMI", () => {
            expect(gmiModule.sendStats).toHaveBeenCalledWith("click", { action_type: "playagain" });
        });
    });

    describe("Pause Replay Button Callback", () => {
        beforeEach(() => {
            gel.config.pauseReplay.action();
        });

        test("sends a click stat to the GMI", () => {
            expect(gmiModule.sendStats).toHaveBeenCalledWith("click", { action_type: "playagain" });
        });
    });

    describe("Play Button Callback", () => {
        beforeEach(() => {
            gel.config.play.action();
        });

        test("sends a click stat to the GMI", () => {
            expect(gmiModule.sendStats).toHaveBeenCalledWith("click", { action_type: "play" });
        });
    });

    describe("Pause Play Button Callback", () => {
        beforeEach(() => {
            gel.config.pausePlay.action();
        });

        test("sends a click stat to the GMI", () => {
            expect(gmiModule.sendStats).toHaveBeenCalledWith("click", { action_type: "play" });
        });
    });

    describe("Achievements Button Callback", () => {
        beforeEach(() => {
            gel.config.achievements.action({ game: mockGame });
        });

        test("sends a click stat to the GMI", () => {
            expect(gmiModule.sendStats).toHaveBeenCalledWith("click", { action_type: "achievements" });
        });
    });

    describe("Restart Button Callback", () => {
        beforeEach(() => {
            gel.config.restart.action();
        });

        test("sends a click stat to the GMI", () => {
            expect(gmiModule.sendStats).toHaveBeenCalledWith("click", { action_type: "playagain" });
        });

        test("sends a replay stat to the GMI", () => {
            expect(gmiModule.sendStats).toHaveBeenCalledWith("replay");
        });
    });

    describe("Continue Game Button Callback", () => {
        beforeEach(() => {
            gel.config.continueGame.action();
        });

        test("sends a click stat to the GMI", () => {
            expect(gmiModule.sendStats).toHaveBeenCalledWith("click", { action_type: "continue" });
        });

        test("sends a game_level continue stat to the GMI", () => {
            expect(gmiModule.sendStats).toHaveBeenCalledWith("continue");
        });
    });

    describe("How To Play Button Callback", () => {
        beforeEach(() => {
            gel.config.howToPlay.action({ game: mockGame });
        });

        test("creates a how to play screen", () => {
            expect(howToPlay.create).toHaveBeenCalledWith({ game: mockGame });
        });

        test("sends a click stat to the GMI", () => {
            expect(gmiModule.sendStats).toHaveBeenCalledWith("click", { action_type: "how-to-play" });
        });
    });
});
