/**
 * @copyright BBC 2018
 * @author BBC Children's D+E
 * @license Apache-2.0
 */
import { createMockGmi } from "../../mock/gmi";
import * as gel from "../../../src/core/layout/gel-defaults.js";
import { settings, settingsChannel } from "../../../src/core/settings.js";
import { eventBus } from "../../../src/core/event-bus.js";
import * as pagesModule from "../../../src/core/background/pages.js";
import * as collectionsModule from "../../../src/core/collections.js";

describe("Layout - Gel Defaults", () => {
	let mockPausedScreen;
	let mockCurrentScreen;
	let mockGmi;
	let clearIndicatorSpy;
	let mockSettings;

	beforeEach(() => {
		clearIndicatorSpy = jest.fn();
		mockPausedScreen = {
			scene: {
				key: "belowScreenKey",
				resume: jest.fn(),
				isPaused: () => true,
			},
			_layout: {
				buttons: {
					achievementsSmall: { setIndicator: jest.fn() },
				},
			},
		};
		mockCurrentScreen = {
			key: "current-screen",
			_data: {
				addedBy: mockPausedScreen,
			},
			cache: {
				json: {
					get: () => ({ topRightVertical: true }),
				},
			},
			context: {
				navigation: {
					belowScreenKey: {
						routes: {
							restart: "home",
						},
					},
					pause: { routes: { select: "level-select" } },
				},
				transientData: [],
			},
			scene: {
				pause: jest.fn(),
				key: "current-screen",
			},
			navigation: {
				home: jest.fn(),
				achievements: jest.fn(),
				back: jest.fn(),
				debug: jest.fn(),
				select: jest.fn(),
				next: jest.fn(),
			},
			navigate: jest.fn(),
			layout: {
				buttons: {
					achievements: { setIndicator: clearIndicatorSpy },
					achievementsSmall: { setIndicator: clearIndicatorSpy },
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

		pagesModule.skip = jest.fn();

		collectionsModule.collections = {
			get: jest.fn(() => ({ get: jest.fn(), set: jest.fn(), getUnique: jest.fn() })),
		};
	});

	afterEach(() => jest.clearAllMocks());

	describe("Exit Button Callback", () => {
		beforeEach(() => gel.config(mockCurrentScreen).exit.action({ screen: mockCurrentScreen }));

		test("exits the game using the GMI", () => {
			expect(mockGmi.exit).toHaveBeenCalled();
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
			let mockGetUnique = jest.fn(() => ({ id: testLevelId }));
			collectionsModule.collections = {
				get: jest.fn(() => ({ get: jest.fn(), set: jest.fn(), getUnique: mockGetUnique })),
			};
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
			let mockGetUnique = jest.fn(() => ({ id: testLevelId }));
			collectionsModule.collections = {
				get: jest.fn(() => ({ get: jest.fn(), set: jest.fn(), getUnique: mockGetUnique })),
			};
			mockCurrentScreen.context.transientData = { "level-select": { choice: { title: testLevelId } } };
			gel.config(mockCurrentScreen).pauseReplay.action({ screen: mockCurrentScreen });
			expect(mockGmi.sendStatsEvent).toHaveBeenCalledWith("level", "playagain", { source: testLevelId });
		});
	});

	describe("Pause Level Select Button Callback", () => {
		test("sends a stat to the GMI", () => {
			gel.config(mockCurrentScreen).levelSelect.action({ screen: mockCurrentScreen });
			expect(mockGmi.sendStatsEvent).toHaveBeenCalledWith("levelselect", "click");
		});

		test("appends level id to stats if it exists", () => {
			const testLevelId = "test level id";
			let mockGetUnique = jest.fn(() => ({ id: testLevelId }));
			collectionsModule.collections = {
				get: jest.fn(() => ({ get: jest.fn(), set: jest.fn(), getUnique: mockGetUnique })),
			};
			mockCurrentScreen.context.transientData = { "level-select": { choice: { title: testLevelId } } };
			gel.config(mockCurrentScreen).levelSelect.action({ screen: mockCurrentScreen });
			expect(mockGmi.sendStatsEvent).toHaveBeenCalledWith("levelselect", "click", { source: testLevelId });
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

	describe("Skip Button Callback", () => {
		beforeEach(() => {
			mockCurrentScreen.timedItems = "timedItems";
			gel.config(mockCurrentScreen).skip.action({ screen: mockCurrentScreen });
		});

		test("navigates next", () => {
			expect(mockCurrentScreen.navigation.next).toHaveBeenCalled();
		});
	});

	describe("Pause Play Button Callback", () => {
		test("resumes the paused screen below", () => {
			gel.config(mockCurrentScreen).pausePlay.action({ screen: mockCurrentScreen });
			expect(mockPausedScreen.scene.resume).toHaveBeenCalled();
		});

		test("resets the small achievements indicator on the screen below if present", () => {
			gel.config(mockCurrentScreen).pausePlay.action({ screen: mockCurrentScreen });
			expect(mockPausedScreen._layout.buttons.achievementsSmall.setIndicator).toHaveBeenCalled();
		});

		test("does not error when there is no small achievements indicator on the screen below", () => {
			delete mockPausedScreen._layout.buttons.achievementsSmall;
			const pausePlayButtonAction = () =>
				gel.config(mockCurrentScreen).pausePlay.action({ screen: mockCurrentScreen });
			expect(pausePlayButtonAction).not.toThrow();
		});

		test("sends a stat to the GMI", () => {
			gel.config(mockCurrentScreen).pausePlay.action({ screen: mockCurrentScreen });
			expect(mockGmi.sendStatsEvent).toHaveBeenCalledWith("play", "click");
		});

		test("removes the overlay", () => {
			gel.config(mockCurrentScreen).pausePlay.action({ screen: mockCurrentScreen });
			expect(mockCurrentScreen.removeOverlay).toHaveBeenCalled();
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
			gel.config(mockCurrentScreen).achievementsSmall.action({ screen: mockCurrentScreen });
			expect(mockCurrentScreen.navigation.achievements).toHaveBeenCalled();
		});

		test("opens the CAGE achievements screen if there is no local navigation", () => {
			delete mockCurrentScreen.navigation.achievements;
			gel.config(mockCurrentScreen).achievementsSmall.action({ screen: mockCurrentScreen });
			expect(mockGmi.achievements.show).toHaveBeenCalled();
		});

		test("clears the indicator", () => {
			gel.config(mockCurrentScreen).achievementsSmall.action({ screen: mockCurrentScreen });
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
			let mockGetUnique = jest.fn(() => ({ id: testLevelId }));
			collectionsModule.collections = {
				get: jest.fn(() => ({ get: jest.fn(), set: jest.fn(), getUnique: mockGetUnique })),
			};
			mockCurrentScreen.context.transientData = { "level-select": { choice: { title: testLevelId } } };
			gel.config(mockCurrentScreen).restart.action({ screen: mockCurrentScreen });
			expect(mockGmi.sendStatsEvent).toHaveBeenCalledWith("level", "playagain", { source: testLevelId });
		});
	});

	describe("Play Again Button Callback", () => {
		test("sends a stat to the GMI", () => {
			gel.config(mockCurrentScreen).playAgain.action({ screen: mockCurrentScreen });
			expect(mockGmi.sendStatsEvent).toHaveBeenCalledWith("level", "playagain");
		});

		test("appends level id to stats if it exists", () => {
			const testLevelId = "test level id";
			let mockGetUnique = jest.fn(() => ({ id: testLevelId }));
			collectionsModule.collections = {
				get: jest.fn(() => ({ get: jest.fn(), set: jest.fn(), getUnique: mockGetUnique })),
			};
			mockCurrentScreen.context.transientData = { "level-select": { choice: { title: testLevelId } } };
			gel.config(mockCurrentScreen).playAgain.action({ screen: mockCurrentScreen });
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
			let mockGetUnique = jest.fn(() => ({ id: testLevelId }));
			collectionsModule.collections = {
				get: jest.fn(() => ({ get: jest.fn(), set: jest.fn(), getUnique: mockGetUnique })),
			};
			mockCurrentScreen.context.transientData = { "level-select": { choice: { title: testLevelId } } };
			gel.config(mockCurrentScreen).continueGame.action({ screen: mockCurrentScreen });
			expect(mockGmi.sendStatsEvent).toHaveBeenCalledWith("level", "continue", { source: testLevelId });
		});

		test("Does not send level id to stats if no collection called 'levels' ", () => {
			collectionsModule.collections = {
				get: jest.fn(() => undefined),
			};
			gel.config(mockCurrentScreen).continueGame.action({ screen: mockCurrentScreen });
			expect(mockGmi.sendStatsEvent).toHaveBeenCalledWith("level", "continue");
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

	describe("Debug Button Callback", () => {
		beforeEach(() => {
			gel.config(mockCurrentScreen).debug.action({ screen: mockCurrentScreen });
		});

		test("Launches debug screen", () => {
			expect(mockCurrentScreen.navigation.debug).toHaveBeenCalled();
		});
	});

	describe("config", () => {
		test("Returns a buttons channel for every item", () => {
			const configChannels = Object.values(gel.config(mockCurrentScreen)).map(a => a.channel);
			expect(configChannels.every(channel => channel === "gel-buttons-current-screen")).toBe(true);
		});
	});
});
