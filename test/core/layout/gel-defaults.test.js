/**
 * @copyright BBC 2018
 * @author BBC Children's D+E
 * @license Apache-2.0
 */
import { createMockGmi } from "../../mock/gmi";

import * as howToPlay from "../../../src/components/overlays/how-to-play.js";
import * as gel from "../../../src/core/layout/gel-defaults.js";
import * as pause from "../../../src/components/overlays/pause.js";
import { settings, settingsChannel } from "../../../src/core/settings.js";
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

        mockGmi = { exit: jest.fn(), setAudio: jest.fn(), sendStatsEvent: jest.fn() };
        createMockGmi(mockGmi);

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

        test("sends a stat to the GMI", () => {
            expect(mockGmi.sendStatsEvent).toHaveBeenCalledWith("exit", "click");
        });
    });

    describe("Home Button Callback", () => {
        beforeEach(() => {
            gel.config.home.action({ game: mockGame });
        });

        test("navigates to the home screen", () => {
            const homeNavigationSpy = mockGame.state.states["current-screen"].navigation.home;
            expect(homeNavigationSpy).toHaveBeenCalled();
        });
    });

    describe("Audio Callback", () => {
        beforeEach(() => {
            jest.spyOn(signal.bus, "publish");
            gel.config.audio.action({ game: mockGame });
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

        test("sends a stat to the GMI when audio is off", () => {
            expect(mockGmi.sendStatsEvent).toHaveBeenCalledWith("audio", "off");
        });

        test("sends a stat to the GMI when audio is on", () => {
            mockGame.sound.mute = true;
            gel.config.audio.action({ game: mockGame });
            expect(mockGmi.sendStatsEvent).toHaveBeenCalledWith("audio", "on");
        });
    });

    describe("Settings Button Callback", () => {
        beforeEach(() => {
            gel.config.settings.action({ game: mockGame });
        });

        test("shows the settings", () => {
            expect(settings.show).toHaveBeenCalled();
        });
    });

    describe("Pause Button Callback", () => {
        beforeEach(() => {
            gel.config.pause.action({ game: mockGame });
        });

        test("creates a pause screen", () => {
            expect(pause.create).toHaveBeenCalledWith(false, { game: mockGame });
        });
    });

    describe("Pause No Replay Button Callback", () => {
        beforeEach(() => {
            gel.config.pauseNoReplay.action({ game: mockGame });
        });

        test("creates a pause screen with replay button hidden", () => {
            expect(pause.create).toHaveBeenCalledWith(true, { game: mockGame });
        });
    });

    describe("Replay Button Callback", () => {
        beforeEach(() => {
            gel.config.replay.action();
        });

        test("sends a stat to the GMI", () => {
            expect(mockGmi.sendStatsEvent).toHaveBeenCalledWith("level", "playagain");
        });
    });

    describe("Pause Replay Button Callback", () => {
        beforeEach(() => {
            gel.config.pauseReplay.action();
        });

        test("sends a stat to the GMI", () => {
            expect(mockGmi.sendStatsEvent).toHaveBeenCalledWith("level", "playagain");
        });
    });

    describe("Play Button Callback", () => {
        beforeEach(() => {
            gel.config.play.action();
        });

        test("sends a stat to the GMI", () => {
            expect(mockGmi.sendStatsEvent).toHaveBeenCalledWith("play", "click");
        });
    });

    describe("Pause Play Button Callback", () => {
        beforeEach(() => {
            gel.config.pausePlay.action();
        });

        test("sends a stat to the GMI", () => {
            expect(mockGmi.sendStatsEvent).toHaveBeenCalledWith("play", "click");
        });
    });

    describe("Achievements Button Callback", () => {
        beforeEach(() => {
            gel.config.achievements.action({ game: mockGame });
        });

        test("sends a stat to the GMI", () => {
            expect(mockGmi.sendStatsEvent).toHaveBeenCalledWith("achievements", "click");
        });
    });

    describe("Restart Button Callback", () => {
        beforeEach(() => {
            gel.config.restart.action();
        });

        test("sends a stat to the GMI", () => {
            expect(mockGmi.sendStatsEvent).toHaveBeenCalledWith("level", "playagain");
        });
    });

    describe("Continue Game Button Callback", () => {
        beforeEach(() => {
            gel.config.continueGame.action();
        });

        test("sends a stat to the GMI", () => {
            expect(mockGmi.sendStatsEvent).toHaveBeenCalledWith("level", "continue");
        });
    });

    describe("How To Play Button Callback", () => {
        beforeEach(() => {
            gel.config.howToPlay.action({ game: mockGame });
        });

        test("creates a how to play screen", () => {
            expect(howToPlay.create).toHaveBeenCalledWith({ game: mockGame });
        });

        test("sends a stat to the GMI", () => {
            expect(mockGmi.sendStatsEvent).toHaveBeenCalledWith("howtoplay", "click");
        });
    });
});
