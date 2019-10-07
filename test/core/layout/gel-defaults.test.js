/**
 * @copyright BBC 2018
 * @author BBC Children's D+E
 * @license Apache-2.0
 */
import { createMockGmi } from "../../mock/gmi";
import * as gel from "../../../src/core/layout/gel-defaults.js";
import { settings, settingsChannel } from "../../../src/core/settings.js";
import * as signal from "../../../src/core/signal-bus.js";

describe("Layout - Gel Defaults", () => {
    let mockPausedScreen;
    let mockCurrentScreen;
    let mockGame;
    let mockGmi;
    let clearIndicatorSpy;

    beforeEach(() => {
        clearIndicatorSpy = jest.fn();
        mockPausedScreen = { scene: { key: "belowScreenKey", resume: jest.fn(), isPaused: () => true } };
        mockCurrentScreen = {
            key: "current-screen",
            context: {
                parentScreens: [
                    {
                        screen: mockPausedScreen,
                    },
                ],
                navigation: {
                    belowScreenKey: {
                        routes: {
                            restart: "home",
                        },
                    },
                },
                transientData: [],
            },
            game: {
                scene: {
                    getScenes: () => [mockPausedScreen],
                },
            },
            scene: {
                pause: jest.fn(),
            },
            navigation: {
                home: jest.fn(),
                achievements: jest.fn(),
                back: jest.fn(),
            },
            _navigate: jest.fn(),
            layouts: [
                {
                    buttons: { achievements: { setIndicator: clearIndicatorSpy } },
                },
            ],
            addOverlay: jest.fn(),
            removeOverlay: jest.fn(),
            transientData: {},
        };
        mockGame = {
            sound: { mute: false },
            state: {
                current: "current-screen",
                states: { "current-screen": mockCurrentScreen },
            },
        };

        mockGmi = {
            exit: jest.fn(),
            setAudio: jest.fn(),
            setStatsScreen: jest.fn(),
            sendStatsEvent: jest.fn(),
            achievements: { show: jest.fn() },
        };
        createMockGmi(mockGmi);

        jest.spyOn(settings, "show").mockImplementation(() => {});
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
            gel.config.home.action({ screen: mockCurrentScreen });
        });

        test("navigates to the home screen", () => {
            const homeNavigationSpy = mockGame.state.states["current-screen"].navigation.home;
            expect(homeNavigationSpy).toHaveBeenCalled();
        });
    });

    describe("Back Button Callback", () => {
        beforeEach(() => {
            gel.config.back.action({ screen: mockCurrentScreen });
        });

        test("fires a click stat", () => {
            expect(mockGmi.sendStatsEvent).toHaveBeenCalledWith("back", "click");
        });

        test("navigates back", () => {
            expect(mockCurrentScreen.navigation.back).toHaveBeenCalled();
        });
    });

    describe("Overlay Back Button Callback", () => {
        beforeEach(() => {
            gel.config.overlayBack.action({ screen: mockCurrentScreen });
        });

        test("fires a click stat", () => {
            expect(mockGmi.sendStatsEvent).toHaveBeenCalledWith("back", "click");
        });

        test("removes overlay screen", () => {
            expect(mockCurrentScreen.removeOverlay).toHaveBeenCalled();
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
            gel.config.pause.action({ screen: mockCurrentScreen });
        });

        test("sends a stat to the GMI", () => {
            expect(mockGmi.sendStatsEvent).toHaveBeenCalledWith("pause", "click");
        });

        test("creates a pause screen", () => {
            expect(mockCurrentScreen.addOverlay).toHaveBeenCalledWith("pause");
        });

        test("pauses the screen", () => {
            expect(mockCurrentScreen.scene.pause).toHaveBeenCalled();
        });
    });

    describe("Pause No Replay Button Callback", () => {
        beforeEach(() => {
            gel.config.pauseNoReplay.action({ screen: mockCurrentScreen });
        });

        test("sends a stat to the GMI", () => {
            expect(mockGmi.sendStatsEvent).toHaveBeenCalledWith("pause", "click");
        });

        test("creates a pause screen with replay button hidden", () => {
            expect(mockCurrentScreen.addOverlay).toHaveBeenCalledWith("pause-noreplay");
        });

        test("pauses the screen", () => {
            expect(mockCurrentScreen.scene.pause).toHaveBeenCalled();
        });
    });

    describe("Replay Button Callback", () => {
        test("sends a stat to the GMI", () => {
            gel.config.replay.action({ screen: mockCurrentScreen });
            expect(mockGmi.sendStatsEvent).toHaveBeenCalledWith("level", "playagain");
        });

        test("appends level id to stats if it exists", () => {
            const testLevelId = "test level id";
            mockCurrentScreen.context.transientData = { "level-select": { choice: { title: testLevelId } } };
            gel.config.replay.action({ screen: mockCurrentScreen });
            expect(mockGmi.sendStatsEvent).toHaveBeenCalledWith("level", "playagain", { source: testLevelId });
        });
    });

    describe("Pause Replay Button Callback", () => {
        test("sends a stat to the GMI", () => {
            gel.config.pauseReplay.action({ screen: mockCurrentScreen });
            expect(mockGmi.sendStatsEvent).toHaveBeenCalledWith("level", "playagain");
        });

        test("appends level id to stats if it exists", () => {
            const testLevelId = "test level id";
            mockCurrentScreen.context.transientData = { "level-select": { choice: { title: testLevelId } } };
            gel.config.pauseReplay.action({ screen: mockCurrentScreen });
            expect(mockGmi.sendStatsEvent).toHaveBeenCalledWith("level", "playagain", { source: testLevelId });
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
            gel.config.pausePlay.action({ screen: mockCurrentScreen });
        });

        test("sends a stat to the GMI", () => {
            expect(mockGmi.sendStatsEvent).toHaveBeenCalledWith("play", "click");
        });

        test("resumes the screen", () => {
            expect(mockPausedScreen.scene.resume).toHaveBeenCalled();
        });
    });

    describe("Achievements Button Callback", () => {
        test("navigates to the achievements screen if it exists locally", () => {
            gel.config.achievements.action({ screen: mockCurrentScreen });
            expect(mockCurrentScreen.navigation.achievements).toHaveBeenCalled();
        });

        test("opens the CAGE achievements screen if there is no local navigation", () => {
            delete mockCurrentScreen.navigation.achievements;
            gel.config.achievements.action({ screen: mockCurrentScreen });
            expect(mockGmi.achievements.show).toHaveBeenCalled();
        });

        test("clears the indicator", () => {
            gel.config.achievements.action({ screen: mockCurrentScreen });
            expect(clearIndicatorSpy).toHaveBeenCalled();
        });
    });

    describe("Restart Button Callback", () => {
        test("sends a stat to the GMI", () => {
            gel.config.restart.action({ screen: mockCurrentScreen });
            expect(mockGmi.sendStatsEvent).toHaveBeenCalledWith("level", "playagain");
        });

        test("appends level id to stats if it exists", () => {
            const testLevelId = "test level id";
            mockCurrentScreen.context.transientData = { "level-select": { choice: { title: testLevelId } } };
            gel.config.restart.action({ screen: mockCurrentScreen });
            expect(mockGmi.sendStatsEvent).toHaveBeenCalledWith("level", "playagain", { source: testLevelId });
        });
    });

    describe("Continue Game Button Callback", () => {
        test("sends a stat to the GMI", () => {
            gel.config.continueGame.action({ screen: mockCurrentScreen });
            expect(mockGmi.sendStatsEvent).toHaveBeenCalledWith("level", "continue");
        });

        test("appends level id to stats if it exists", () => {
            const testLevelId = "test level id";
            mockCurrentScreen.context.transientData = { "level-select": { choice: { title: testLevelId } } };
            gel.config.continueGame.action({ screen: mockCurrentScreen });
            expect(mockGmi.sendStatsEvent).toHaveBeenCalledWith("level", "continue", { source: testLevelId });
        });
    });

    describe("How To Play Button Callback", () => {
        beforeEach(() => {
            gel.config.howToPlay.action({ screen: mockCurrentScreen });
        });

        test("creates a how to play screen", () => {
            expect(mockCurrentScreen.addOverlay).toHaveBeenCalledWith("how-to-play");
        });

        test("sends a stat to the GMI", () => {
            expect(mockGmi.sendStatsEvent).toHaveBeenCalledWith("howtoplay", "click");
        });
    });
});
