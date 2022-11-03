/**
 * @copyright BBC 2018
 * @author BBC Children's D+E
 * @license Apache-2.0
 */

import { createMockGmi } from "../../mock/gmi.js";

import { Boot } from "../../../src/core/loader/boot.js";
import * as Scaler from "../../../src/core/scaler.js";
import * as a11y from "../../../src/core/accessibility/accessibility-layer.js";
import { eventBus } from "../../../src/core/event-bus.js";
import * as getThemeString from "../../../src/core/get-theme.js";

const createBootScreen = (config, mockGame, mockAudioButton) => {

	const bootScreen = new Boot(config);

		bootScreen.game = mockGame;
		bootScreen.load = {
			setCORS: jest.fn(),
			setBaseURL: jest.fn(),
			setPath: jest.fn(),
			json: jest.fn(),
			pack: jest.fn(),
		};
		bootScreen.scene = {
			key: "boot",
			start: jest.fn(),
			manager: { getScenes: jest.fn(() => [{ layout: { buttons: { audio: mockAudioButton } } }]) },
		};

		bootScreen.navigation = { next: jest.fn() };

		bootScreen.sound = { mute: false };

		return bootScreen
}



describe("Boot", () => {
	let bootScreen;
	let mockGmi;
	let mockGame;
	let mockAudioButton;
	let mockSettings;
	let mockNavigationConfig;

	beforeEach(() => {
		jest.spyOn(getThemeString, "getTheme").mockImplementation(() => "theme-name");

		mockSettings = { audio: true };
		mockGmi = {
			gameLoaded: jest.fn(),
			sendStatsEvent: jest.fn(),
			achievements: { init: jest.fn() },
			gameDir: "test-game-dir",
			getAllSettings: jest.fn(() => mockSettings),
		};
		createMockGmi(mockGmi);
		mockGame = {
			canvas: {
				setAttribute: jest.fn(),
				parentElement: { appendChild: jest.fn() },
				focus: jest.fn(),
			},
			scale: {
				parentSize: 600,
			},
		};

		mockAudioButton = {
			setImage: jest.fn(),
		};

		mockNavigationConfig = {};
		bootScreen = createBootScreen(mockNavigationConfig, mockGame, mockAudioButton);


		Scaler.init = jest.fn();
		a11y.create = jest.fn();
	});

	afterEach(() => jest.clearAllMocks());

	describe("preload method", () => {
		test("Sets up loader paths correctly", () => {
			bootScreen.preload();

			expect(bootScreen.load.setBaseURL).toHaveBeenCalledWith(mockGmi.gameDir);
			expect(bootScreen.load.setPath).toHaveBeenCalledWith("theme-name");
		});

		test("sets CORS crossorigin attribute to anonymous", () => {
			bootScreen.preload();
			expect(bootScreen.load.setCORS).toHaveBeenCalledWith("anonymous");
		});

		test("Loads the asset master pack as json", () => {
			bootScreen.preload();
			expect(bootScreen.load.json).toHaveBeenCalledWith("asset-master-pack", "asset-master-pack.json");
		});

		test("Loads the font pack as json", () => {
			bootScreen.preload();
			expect(bootScreen.load.json).toHaveBeenCalledWith("font-pack", "fonts.json");
		});

		test("Calls this.SetData with correct navigation and empty parentScreens array", () => {
			bootScreen.setData = jest.fn();
			bootScreen.preload();

			const expectedData = {

				parentScreens: [],
				transient: {},
				navigation: {

					boot: { routes: { next: "loader" } },
					loader: { routes: { next: "home" } },
				},
			};
			expect(bootScreen.setData).toHaveBeenCalledWith(expectedData);
		});

		test("Calls this.SetData with correct start screen when a default is provided", () => {
			mockNavigationConfig.testScreen = {default: true}
			bootScreen = createBootScreen(mockNavigationConfig, mockGame);
			bootScreen.setData = jest.fn();
			bootScreen.preload();

			const expectedData = {
				parentScreens: [],
				transient: {},
				navigation: {
					testScreen: {default: true},
					boot: { routes: { next: "loader" } },
					loader: { routes: { next: "testScreen" } },
				},
			};
			expect(bootScreen.setData).toHaveBeenCalledWith(expectedData);
		});


		test("focuses the canvas when settings are closed", () => {
			bootScreen.preload();
			eventBus.publish({ channel: "genie-settings", name: "settings-closed" });
			expect(mockGame.canvas.focus).toHaveBeenCalled();
		});

		describe("audio setting callback", () => {
			test("Disables audio and sets button image to audio-on when mute is false", () => {
				bootScreen.preload();
				eventBus.publish({ channel: "genie-settings", name: "audio", data: false });
				expect(bootScreen.sound.mute).toBe(false);
				expect(mockAudioButton.setImage).toHaveBeenCalledWith("audio-on");
			});

			test("Enables audio and sets button image to audio-off when mute is true", () => {
				mockSettings.audio = false;
				bootScreen.preload();
				eventBus.publish({ channel: "genie-settings", name: "audio", data: true });
				expect(bootScreen.sound.mute).toBe(true);
				expect(mockAudioButton.setImage).toHaveBeenCalledWith("audio-off");
			});

			test("Toggles audio on the scenes that are sleeping as well as the active ones", () => {
				const mockAudioButton2 = { setImage: jest.fn() };
				const mockScenes = [
					{ layout: { buttons: { audio: mockAudioButton } } },
					{ layout: { buttons: { audio: mockAudioButton2 } } },
					undefined,
				];
				bootScreen.scene.manager.getScenes.mockReturnValue(mockScenes);
				bootScreen.preload();
				eventBus.publish({ channel: "genie-settings", name: "audio", data: false });
				expect(bootScreen.sound.mute).toBe(false);
				expect(mockAudioButton.setImage).toHaveBeenCalledWith("audio-on");
				expect(mockAudioButton2.setImage).toHaveBeenCalledWith("audio-on");
			});
		});
	});

	describe("create method", () => {
		test("Sets game canvas attributes", () => {
			bootScreen.preload();
			bootScreen.create();

			expect(bootScreen.game.canvas.setAttribute).toHaveBeenCalledWith("tabindex", "-1");
			expect(bootScreen.game.canvas.setAttribute).toHaveBeenCalledWith("aria-hidden", "true");
		});

		test("Initialise scaler, font loader and accessibility", () => {
			bootScreen.preload();
			bootScreen.create();

			expect(Scaler.init).toHaveBeenCalledWith(600, mockGame);
			expect(bootScreen.navigation.next).toHaveBeenCalled();
		});
	});
});
