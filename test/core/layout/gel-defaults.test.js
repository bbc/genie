/**
 * @copyright BBC 2018
 * @author BBC Children's D+E
 * @license Apache-2.0
 */
import { createMockGmi } from "../../mock/gmi";
import * as gel from "../../../src/core/layout/gel-defaults.js";
import { settings, settingsChannel } from "../../../src/core/settings.js";
import { eventBus } from "../../../src/core/event-bus.js";

describe("Layout - Gel Defaults", () => {
    let mockPausedScreen;
    let mockCurrentScreen;
    let mockGmi;
    let clearIndicatorSpy;
    let mockSettings;

    beforeEach(() => {
        clearIndicatorSpy = jest.fn();
        mockPausedScreen = { scene: { key: "belowScreenKey", resume: jest.fn(), isPaused: () => true } };
        mockCurrentScreen = {
            key: "current-screen",
            context: {
                parentScreens: [mockPausedScreen],
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
            layout: {
                buttons: {
                    achievements: { setIndicator: clearIndicatorSpy },
                    achievementsCircular: { setIndicator: clearIndicatorSpy },
                },
            },
            addOverlay: jest.fn(),
            removeOverlay: jest.fn(),
            transientData: {},
            sound: { mute: false },
        };

        mockSettings = { audio: true };

        mockGmi = {
            exit: jest.fn(),
            setAudio: jest.fn(value => {
                mockSettings.audio = value;
            }),
            setStatsScreen: jest.fn(),
            sendStatsEvent: jest.fn(),
            achievements: { show: jest.fn() },
            getAllSettings: jest.fn(() => mockSettings),
        };
        createMockGmi(mockGmi);

        jest.spyOn(settings, "show").mockImplementation(() => {});
    });

    afterEach(() => jest.clearAllMocks());

    describe("Exit Button Callback", () => {
        beforeEach(() => gel.config(mockCurrentScreen).exit.action({ screen: mockCurrentScreen }));

        test("exits the game using the GMI", () => {
            expect(mockGmi.exit).toHaveBeenCalled();
        });

        test("sends a stat to the GMI", () => {
            expect(mockGmi.sendStatsEvent).toHaveBeenCalledWith("exit", "click");
        });
    });

    describe("Home Button Callback", () => {
        beforeEach(() => {
            gel.config(mockCurrentScreen).home.action({ screen: mockCurrentScreen });
        });

        test("navigates to the home screen", () => {
            const homeNavigationSpy = mockCurrentScreen.navigation.home;

            expect(homeNavigationSpy).toHaveBeenCalled();
        });

        test("fires a click stat", () => {
            expect(mockGmi.sendStatsEvent).toHaveBeenCalledWith("home", "click");
        });
    });

    describe("Back Button Callback", () => {
        beforeEach(() => {
            gel.config(mockCurrentScreen).back.action({ screen: mockCurrentScreen });
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
            gel.config(mockCurrentScreen).overlayBack.action({ screen: mockCurrentScreen });
        });

        test("fires a click stat", () => {
            expect(mockGmi.sendStatsEvent).toHaveBeenCalledWith("back", "click");
        });

        test("removes overlay screen", () => {
            expect(mockCurrentScreen.removeOverlay).toHaveBeenCalled();
        });

        test("resumes the screen below", () => {
            expect(mockPausedScreen.scene.resume).toHaveBeenCalled();
        });
    });

    describe("Audio Callback", () => {
        test("sets audio on the GMI", () => {
            gel.config(mockCurrentScreen).audio.action({ screen: mockCurrentScreen });
            expect(mockGmi.setAudio).toHaveBeenCalledWith(false);
        });

        test("mutes the game audio", () => {
            jest.spyOn(eventBus, "publish");
            gel.config(mockCurrentScreen).audio.action({ screen: mockCurrentScreen });
            expect(eventBus.publish).toHaveBeenCalledWith({
                channel: settingsChannel,
                name: "audio",
            });
        });

        test("unmutes the game audio", () => {
            mockCurrentScreen.sound.mute = true;
            gel.config(mockCurrentScreen).audio.action();

            expect(eventBus.publish).toHaveBeenCalledWith({
                channel: settingsChannel,
                name: "audio",
            });
        });

        test("sends a stat to the GMI when audio is off", () => {
            mockSettings.audio = true;
            gel.config(mockCurrentScreen).audio.action();

            expect(mockGmi.sendStatsEvent).toHaveBeenCalledWith("audio", "off");
        });

        test("sends a stat to the GMI when audio is on", () => {
            mockSettings.audio = false;
            gel.config(mockCurrentScreen).audio.action();
            expect(mockGmi.sendStatsEvent).toHaveBeenCalledWith("audio", "on");
        });
    });

    describe("Settings Button Callback", () => {
        beforeEach(() => {
            gel.config(mockCurrentScreen).settings.action({ game: {} });
        });

        test("shows the settings", () => {
            expect(settings.show).toHaveBeenCalled();
        });
    });

    describe("Pause Button Callback", () => {
        beforeEach(() => {
            gel.config(mockCurrentScreen).pause.action({ screen: mockCurrentScreen });
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

    describe("Replay Button Callback", () => {
        test("sends a stat to the GMI", () => {
            gel.config(mockCurrentScreen).replay.action({ screen: mockCurrentScreen });
            expect(mockGmi.sendStatsEvent).toHaveBeenCalledWith("level", "playagain");
        });

        test("appends level id to stats if it exists", () => {
            const testLevelId = "test level id";
            mockCurrentScreen.context.transientData = { "level-select": { choice: { title: testLevelId } } };
            gel.config(mockCurrentScreen).replay.action({ screen: mockCurrentScreen });
            expect(mockGmi.sendStatsEvent).toHaveBeenCalledWith("level", "playagain", { source: testLevelId });
        });
    });

    describe("Pause Replay Button Callback", () => {
        test("sends a stat to the GMI", () => {
            gel.config(mockCurrentScreen).pauseReplay.action({ screen: mockCurrentScreen });
            expect(mockGmi.sendStatsEvent).toHaveBeenCalledWith("level", "playagain");
        });

        test("appends level id to stats if it exists", () => {
            const testLevelId = "test level id";
            mockCurrentScreen.context.transientData = { "level-select": { choice: { title: testLevelId } } };
            gel.config(mockCurrentScreen).pauseReplay.action({ screen: mockCurrentScreen });
            expect(mockGmi.sendStatsEvent).toHaveBeenCalledWith("level", "playagain", { source: testLevelId });
        });
    });

    describe("Play Button Callback", () => {
        beforeEach(() => {
            gel.config(mockCurrentScreen).play.action();
        });

        test("sends a stat to the GMI", () => {
            expect(mockGmi.sendStatsEvent).toHaveBeenCalledWith("play", "click");
        });
    });

    describe("Pause Play Button Callback", () => {
        beforeEach(() => {
            gel.config(mockCurrentScreen).pausePlay.action({ screen: mockCurrentScreen });
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
            gel.config(mockCurrentScreen).achievements.action({ screen: mockCurrentScreen });
            expect(mockCurrentScreen.navigation.achievements).toHaveBeenCalled();
        });

        test("opens the CAGE achievements screen if there is no local navigation", () => {
            delete mockCurrentScreen.navigation.achievements;
            gel.config(mockCurrentScreen).achievements.action({ screen: mockCurrentScreen });
            expect(mockGmi.achievements.show).toHaveBeenCalled();
        });

        test("clears the indicator", () => {
            gel.config(mockCurrentScreen).achievements.action({ screen: mockCurrentScreen });
            expect(clearIndicatorSpy).toHaveBeenCalled();
        });
    });

    describe("Circular Achievements Button Callback", () => {
        test("navigates to the achievements screen if it exists locally", () => {
            gel.config(mockCurrentScreen).achievementsCircular.action({ screen: mockCurrentScreen });
            expect(mockCurrentScreen.navigation.achievements).toHaveBeenCalled();
        });

        test("opens the CAGE achievements screen if there is no local navigation", () => {
            delete mockCurrentScreen.navigation.achievements;
            gel.config(mockCurrentScreen).achievementsCircular.action({ screen: mockCurrentScreen });
            expect(mockGmi.achievements.show).toHaveBeenCalled();
        });

        test("clears the indicator", () => {
            gel.config(mockCurrentScreen).achievementsCircular.action({ screen: mockCurrentScreen });
            expect(clearIndicatorSpy).toHaveBeenCalled();
        });
    });

    describe("Restart Button Callback", () => {
        test("sends a stat to the GMI", () => {
            gel.config(mockCurrentScreen).restart.action({ screen: mockCurrentScreen });
            expect(mockGmi.sendStatsEvent).toHaveBeenCalledWith("level", "playagain");
        });

        test("appends level id to stats if it exists", () => {
            const testLevelId = "test level id";
            mockCurrentScreen.context.transientData = { "level-select": { choice: { title: testLevelId } } };
            gel.config(mockCurrentScreen).restart.action({ screen: mockCurrentScreen });
            expect(mockGmi.sendStatsEvent).toHaveBeenCalledWith("level", "playagain", { source: testLevelId });
        });
    });

    describe("Continue Game Button Callback", () => {
        test("sends a stat to the GMI", () => {
            gel.config(mockCurrentScreen).continueGame.action({ screen: mockCurrentScreen });
            expect(mockGmi.sendStatsEvent).toHaveBeenCalledWith("level", "continue");
        });

        test("appends level id to stats if it exists", () => {
            const testLevelId = "test level id";
            mockCurrentScreen.context.transientData = { "level-select": { choice: { title: testLevelId } } };
            gel.config(mockCurrentScreen).continueGame.action({ screen: mockCurrentScreen });
            expect(mockGmi.sendStatsEvent).toHaveBeenCalledWith("level", "continue", { source: testLevelId });
        });
    });

    describe("How To Play Button Callback", () => {
        beforeEach(() => {
            gel.config(mockCurrentScreen).howToPlay.action({ screen: mockCurrentScreen });
        });

        test("creates a how to play screen", () => {
            expect(mockCurrentScreen.addOverlay).toHaveBeenCalledWith("how-to-play");
        });

        test("sends a stat to the GMI", () => {
            expect(mockGmi.sendStatsEvent).toHaveBeenCalledWith("howtoplay", "click");
        });

        test("pauses the screen below", () => {
            expect(mockCurrentScreen.scene.pause).toHaveBeenCalled();
        });
    });
});
