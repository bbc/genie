/**
 * @copyright BBC 2018
 * @author BBC Children's D+E
 * @license Apache-2.0
 */

import { createMockGmi } from "../../mock/gmi.js";

import { Loader } from "../../../src/core/loader/loader.js";
import * as a11y from "../../../src/core/accessibility/accessibility-layer.js";
import * as Scaler from "../../../src/core/scaler.js";
import { gmi } from "../../../src/core/gmi/gmi.js";
import * as debugModeModule from "../../../src/core/debug/debug-mode.js";
import * as Config from "../../../src/core/loader/get-config.js";
import * as LoadCollectionsModule from "../../../src/core/loader/load-collections.js";
import * as getThemeString from "../../../src/core/get-theme.js";

jest.mock("../../../src/core/loader/get-config.js");
jest.mock("../../../src/core/loader/load-collections.js");

describe("Loader", () => {
	let loader;
	let mockGmi;
	let mockImage;
	let mockConfig;
	let mockMasterPack;
	let loadComplete;
	let mockFontConfig;
	let mockLoaderConfig;

	beforeEach(() => {
		global.window.__debug = undefined;
		jest.spyOn(a11y, "destroy").mockImplementation(() => {});
		jest.spyOn(getThemeString, "getTheme").mockImplementation(() => "theme-name");

		mockGmi = {
			gameLoaded: jest.fn(),
			sendStatsEvent: jest.fn(),
			achievements: { init: jest.fn() },
			gameDir: "test-game-dir",
		};
		createMockGmi(mockGmi);

		Config.getConfig = () => "mocked getConfig return value";

		loadComplete = new Promise(resolve => resolve());
		LoadCollectionsModule.loadCollections = jest.fn(() => loadComplete);
		mockImage = {
			width: 1,
			frame: {
				cutWidth: 0,
				updateUVs: jest.fn(),
			},
			setOrigin: jest.fn(),
		};

		mockMasterPack = {
			default: {},
			boot: {},
			one: {},
			two: {},
		};

		mockFontConfig = {
			custom: {
				families: "mock",
				urls: ["mock urls"],
			},
		};

		mockLoaderConfig = {};

		const mockConfigFiles = {
			files: [{ key: "testOne" }],
			prefix: "testPrefix.",
		};

		mockConfig = {};
		const mockContext = {
			config: mockConfig,
		};

		loader = new Loader();
		Object.defineProperty(loader, "context", {
			get: jest.fn(() => mockContext),
		});

		loader.load = {
			audio: jest.fn(),
			setBaseURL: jest.fn(),
			setPath: jest.fn(),
			addPack: jest.fn(),
			pack: jest.fn(),
			on: jest.fn(),
			once: jest.fn(),
			json5: jest.fn(),
			webfont: jest.fn(),
			start: jest.fn(),
		};
		loader.cache = {
			json: {
				get: jest.fn(packName => {
					if (packName === "asset-master-pack") {
						return mockMasterPack;
					} else if (packName === "config/files") {
						return {
							config: mockConfigFiles,
						};
					} else if (packName === "testPrefix.testOne") {
						return mockConfig;
					} else if (packName === "font-pack") {
						return mockFontConfig;
					} else if (packName === "config") {
						return mockLoaderConfig;
					}
				}),
			},
		};

		loader.add = {
			image: jest.fn(() => mockImage),
		};

		const mockData = { navigation: { loader: { routes: { next: "test" } } } };

		loader.events = { emit: jest.fn() };
		loader.scene = {
			key: "loader",
			manager: { keys: [] },
			start: jest.fn(),
			stop: () => {},
			bringToTop: jest.fn(),
		};
		loader.cameras = { main: {} };
		loader.setConfig = jest.fn();
		loader.init(mockData);

		const mockGame = {
			canvas: {
				style: {
					height: 250,
				},
				getBoundingClientRect: () => {
					return { width: 225, height: 350 };
				},
			},
			scale: {
				parentSize: 100,
				parent: {
					offsetWidth: 300,
					offsetHeight: 200,
				},
				refresh: () => {},
			},
		};
		Scaler.init(mockGame);
	});

	afterEach(() => jest.clearAllMocks());

	describe("updateLoadBar method", () => {
		test("updates the loading bar fill when called", () => {
			const progress = 42;

			loader.preload();
			loader.updateLoadBar(progress);
			expect(mockImage.frame.cutWidth).toEqual(progress);
		});

		test("does not update the loading bar fill when progress is backwards", () => {
			const progress = 42;

			loader.preload();
			loader.updateLoadBar(progress);
			loader.updateLoadBar(41);
			expect(mockImage.frame.cutWidth).toEqual(progress);
		});
	});

	describe("createBrandLogo method", () => {
		test("adds logo image at correct position", () => {
			const mockMetrics = {
				horizontalBorderPad: 10,
				verticalBorderPad: 10,
				scale: 1,
				horizontals: {
					right: 100,
				},
				verticals: {
					bottom: 100,
				},
			};
			Scaler.getMetrics = jest.fn(() => mockMetrics);
			loader.createBrandLogo();

			expect(loader.add.image).toHaveBeenCalledWith(90, 90, "loader.brandLogo");
			expect(mockImage.setOrigin).toHaveBeenCalledWith(1, 1);
		});
	});

	describe("createLoadBar method", () => {
		test("adds loadbar images and sets progress to zero", () => {
			loader.updateLoadBar = jest.fn();
			loader.preload();
			loader.createLoadBar();

			expect(loader.add.image).toHaveBeenCalledWith(0, 130, "loader.loadbarBackground");
			expect(loader.add.image).toHaveBeenCalledWith(0, 130, "loader.loadbar");
			expect(loader.updateLoadBar).toHaveBeenCalledWith(0);
		});

		test("adds loadbar images at y position specified in config", () => {
			mockLoaderConfig = { loadingBarYPos: 200 };
			loader.updateLoadBar = jest.fn();

			loader.preload();
			loader.createLoadBar();

			expect(loader.add.image).toHaveBeenCalledWith(0, 200, "loader.loadbarBackground");
			expect(loader.add.image).toHaveBeenCalledWith(0, 200, "loader.loadbar");
			expect(loader.updateLoadBar).toHaveBeenCalledWith(0);
		});
	});

	describe("preload method", () => {
		test("Sets up loader paths correctly", () => {
			loader.preload();

			expect(loader.load.setBaseURL).toHaveBeenCalledWith(mockGmi.gameDir);
			expect(loader.load.setPath).toHaveBeenCalledWith("theme-name");
		});

		test("Adds the master asset pack to the load", () => {
			loader.preload();

			expect(loader.load.addPack).toHaveBeenCalledWith(mockMasterPack);
		});

		test("loads the font pack using the fonts.json file config", () => {
			loader.preload();

			expect(loader.load.webfont).toHaveBeenCalledWith({
				key: "font-pack",
				config: mockFontConfig,
			});
		});

		test("calls load.pack with the gel pack and screen packs", () => {
			loader.scene.manager.keys = { one: {}, two: {}, three: {} };
			loader.preload();

			expect(loader.load.pack).toHaveBeenCalledWith("gel/assets");
			expect(loader.load.pack).toHaveBeenCalledWith("one/assets");
			expect(loader.load.pack).toHaveBeenCalledWith("two/assets");
			expect(loader.load.pack).toHaveBeenCalledWith("three/assets");
			expect(loader.load.pack).toHaveBeenCalledTimes(4);
		});

		test("does not load boot and loader screen packs", () => {
			loader.scene.manager.keys = { boot: {}, loader: {}, three: {} };
			loader.preload();

			expect(loader.load.pack).toHaveBeenCalledWith("gel/assets");
			expect(loader.load.pack).not.toHaveBeenCalledWith("boot");
			expect(loader.load.pack).not.toHaveBeenCalledWith("loader");
			expect(loader.load.pack).toHaveBeenCalledWith("three/assets");
		});

		test("adds background and title images", () => {
			loader.preload();

			expect(loader.add.image).toHaveBeenCalledWith(0, 0, "loader.background");
			expect(loader.add.image).toHaveBeenCalledWith(0, -120, "loader.title");
		});
	});

	describe("create method", () => {
		test("sets config to the return value of getConfig", () => {
			loader.screenKeys = [];
			loader.create();
			expect(loader.setConfig).toHaveBeenCalledWith("mocked getConfig return value");
		});

		test("calls this.navigation.next", () => {
			loader.screenKeys = [];
			loader.navigation = { next: jest.fn() };
			loader.create();

			loadComplete.then(() => {
				expect(loader.navigation.next).toHaveBeenCalled();
			});
		});

		test("sends gmi game loaded stats", () => {
			loader.screenKeys = [];
			loader.create();
			loadComplete.then(() => {
				expect(gmi.sendStatsEvent).toHaveBeenCalledWith("gameloaded", "true");
				expect(gmi.gameLoaded).toHaveBeenCalled();
			});
		});
	});

	describe("debug mode", () => {
		beforeEach(() => {
			global.window.__debug = true;
			debugModeModule.isDebug = () => true;
			loader.preload();
		});

		test("logs the progress to the console when debug is true", () => {
			jest.spyOn(console, "log").mockImplementation(() => {});
			global.window.__debug = true;
			loader.updateLoadBar("50");
			expect(console.log.mock.calls[0]).toEqual(["Loader progress:", "50"]); // eslint-disable-line no-console
		});

		test("adds the debug asset pack", () => {
			loader.scene.manager.keys = { one: {}, two: {}, three: {} };
			loader.preload();

			expect(loader.load.pack).toHaveBeenCalledWith("../../debug/assets");
		});
	});

	describe("achievements", () => {
		test("calls achievements init", () => {
			loader.screenKeys = [];
			loader.create();
			expect(mockGmi.achievements.init).toHaveBeenCalled();
		});

		test("loads the achievements config", () => {
			loader.preload();
			expect(loader.load.json5).toHaveBeenCalledWith({
				key: "achievements-data",
				url: "achievements/config.json5",
			});
		});
	});
});
