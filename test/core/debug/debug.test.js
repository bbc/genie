/**
 * @copyright BBC 2018
 * @author BBC Children's D+E
 * @license Apache-2.0
 */
import { addEvents } from "../../../src/core/debug/debug.js";

import * as debugLayoutModule from "../../../src/core/debug/layout-debug-draw.js";
import * as Scaler from "../../../src/core/scaler.js";

describe("Debug system", () => {
	let mockScreen;
	let mockOnUpEvent;
	let mockGraphicsObject;
	let mockContainer;

	beforeEach(() => {
		window.__debug = {};
		debugLayoutModule.debugLayout = jest.fn();

		mockOnUpEvent = jest.fn();
		mockGraphicsObject = {
			fillRectShape: jest.fn(),
			strokeRect: jest.fn(),
			destroy: jest.fn(),
			fillStyle: jest.fn(),
			lineStyle: jest.fn(),
			clear: jest.fn(),
		};

		const mockTileSprite = {
			setPosition: jest.fn(),
			setSize: jest.fn(),
			setTileScale: jest.fn(),
		};

		const mockRect = {
			setStrokeStyle: jest.fn(() => mockRect),
			setInteractive: jest.fn(() => mockRect),
			setOrigin: jest.fn(() => mockRect),
			on: jest.fn(),
			geom: {
				width: 100,
				height: 100,
			},
			updateDisplayOrigin: jest.fn(),
			updateData: jest.fn(),
			input: {
				hitArea: {},
			},
		};

		const mockText = {
			setOrigin: jest.fn(() => mockText),
		};

		mockContainer = {
			scene: {
				add: {
					tileSprite: jest.fn(() => mockTileSprite),
					rectangle: jest.fn(() => mockRect),
					text: jest.fn(() => mockText),
				},
				game: { scale: { parent: {} }, canvas: { height: 10, width: 10 } },
				events: {
					once: jest.fn(),
				},
				input: {
					keyboard: {
						addKeys: jest.fn(() => ({ c: { on: jest.fn() } })),
					},
				},
				layout: { getSafeArea: jest.fn().mockReturnValue({ top: 1, width: 2, height: 3 }) },
			},
			setDepth: jest.fn(),
			add: jest.fn(),
		};

		const mockMetrics = { scale: 1 };
		Scaler.getMetrics = jest.fn(() => mockMetrics);

		mockScreen = {
			config: { debugLabels: [] },
			cache: {
				json: {
					get: jest.fn(),
				},
			},
			input: {
				keyboard: {
					addKey: jest.fn(() => ({ on: mockOnUpEvent })),
					removeKey: jest.fn(),
				},
			},
			debugGraphics: mockGraphicsObject,
			add: {
				graphics: jest.fn(() => mockGraphicsObject),
				container: jest.fn(() => mockContainer),
				text: jest.fn(() => ({ setOrigin: jest.fn() })),
			},
			game: {
				canvas: { width: 800, height: 600 },
				scale: { parent: { offsetWidth: 800, offsetHeight: 600 } },
			},
			layout: {
				debug: {
					groups: jest.fn(),
					buttons: jest.fn(),
				},
			},
			events: {
				on: jest.fn(),
				once: jest.fn(),
				off: jest.fn(),
			},
			navigation: {},
			scene: { key: "sceneKey" },
		};
	});

	afterEach(() => {
		jest.clearAllMocks();
		jest.restoreAllMocks();
	});

	describe("addEvents", () => {
		test("sets up create and update methods", () => {
			addEvents(mockScreen);
			expect(mockScreen.events.on).toHaveBeenCalledWith("create", expect.any(Function), mockScreen);
			expect(mockScreen.events.on).toHaveBeenCalledWith("update", expect.any(Function), mockScreen);
		});

		test("adds shutdown single use event", () => {
			addEvents(mockScreen);
			expect(mockScreen.events.once).toHaveBeenCalledWith("shutdown", expect.any(Function));
		});
	});

	describe("create event", () => {
		test("sets up key toggles", () => {
			addEvents(mockScreen);
			const createCallback = mockScreen.events.on.mock.calls[0][1];

			createCallback.call(mockScreen);

			expect(mockScreen.input.keyboard.addKey).toHaveBeenCalledWith("q");
			expect(mockScreen.input.keyboard.addKey).toHaveBeenCalledWith("w");
			expect(mockScreen.input.keyboard.addKey).toHaveBeenCalledWith("e");
			expect(mockScreen.input.keyboard.addKey).toHaveBeenCalledWith("r");
		});

		test("sets up example key if debug mode", () => {
			mockScreen.navigation.debug = () => {};
			addEvents(mockScreen);
			const createCallback = mockScreen.events.on.mock.calls[0][1];

			createCallback.call(mockScreen);

			expect(mockScreen.input.keyboard.addKey).toHaveBeenCalledWith("t");
		});

		test("Adds no group/button toggles when no layout set (game screens during early dev)", () => {
			delete mockScreen.layout;
			addEvents(mockScreen);
			const createCallback = mockScreen.events.on.mock.calls[0][1];

			createCallback.call(mockScreen);

			expect(mockScreen.input.keyboard.addKey).toHaveBeenCalledWith("q");
			expect(mockScreen.input.keyboard.addKey).not.toHaveBeenCalledWith("w");
			expect(mockScreen.input.keyboard.addKey).not.toHaveBeenCalledWith("e");
			expect(mockScreen.input.keyboard.addKey).toHaveBeenCalledWith("r");
		});

		test("adds text labels if present in config", () => {
			mockScreen.config.debugLabels = [{ x: -390, y: 100, text: "test-description" }];
			addEvents(mockScreen);
			const createCallback = mockScreen.events.on.mock.calls[0][1];

			createCallback.call(mockScreen);

			expect(mockScreen.add.text).toHaveBeenCalledWith(-390, 100, "test-description", expect.any(Object));
		});

		test("adds text labels when not present in config", () => {
			delete mockScreen.config.debugLabels;
			addEvents(mockScreen);
			const createCallback = mockScreen.events.on.mock.calls[0][1];

			createCallback.call(mockScreen);

			expect(mockScreen.add.text).toHaveBeenCalledWith(
				-400,
				-300,
				"config: THEME/sceneKey/config.json5",
				expect.any(Object),
			);
		});

		test("adds correct path label when scene key begins with debug-", () => {
			mockScreen.scene.key = "debug-test";
			addEvents(mockScreen);
			const createCallback = mockScreen.events.on.mock.calls[0][1];

			createCallback.call(mockScreen);

			expect(mockScreen.add.text).toHaveBeenCalledWith(
				-400,
				-300,
				"config: debug/examples/test.json5",
				expect.any(Object),
			);
		});

		test("adds correct path label when scene key is debug", () => {
			mockScreen.scene.key = "debug";
			addEvents(mockScreen);
			const createCallback = mockScreen.events.on.mock.calls[0][1];

			createCallback.call(mockScreen);

			expect(mockScreen.add.text).toHaveBeenCalledWith(
				-400,
				-300,
				"config: debug/config.json5",
				expect.any(Object),
			);
		});

		test("adds correct path label if config path found when scene key is not a debug key", () => {
			mockScreen.scene.key = "testKey";

			mockScreen.cache.json.get.mockReturnValue({ config: { files: [{ key: "testKey", url: "testUrl" }] } });

			addEvents(mockScreen);
			const createCallback = mockScreen.events.on.mock.calls[0][1];

			createCallback.call(mockScreen);

			expect(mockScreen.add.text).toHaveBeenCalledWith(
				-400,
				-300,
				"config: THEME/testKey/config.json5",
				expect.any(Object),
			);
		});

		test("sets label position defaults of 0 0 if not in theme", () => {
			mockScreen.config.debugLabels = [{ text: "test-description" }];
			addEvents(mockScreen);
			const createCallback = mockScreen.events.on.mock.calls[0][1];

			createCallback.call(mockScreen);

			expect(mockScreen.add.text).toHaveBeenCalledWith(0, 0, "test-description", expect.any(Object));
		});

		test("adds screen to debug object", () => {
			addEvents(mockScreen);
			const createCallback = mockScreen.events.on.mock.calls[0][1];

			createCallback.call(mockScreen);
			expect(window.__debug.screen).toBe(mockScreen);
		});
	});

	describe("CSS toggle", () => {
		test("toggles debug class on body", () => {
			addEvents(mockScreen);
			const createCallback = mockScreen.events.on.mock.calls[0][1];
			createCallback.call(mockScreen);

			const toggleCSS = mockOnUpEvent.mock.calls[3][1];
			global.document.body.classList.toggle = jest.fn();

			toggleCSS();

			expect(document.body.classList.toggle).toHaveBeenCalledWith("debug");
		});
	});

	describe("shutdown event", () => {
		test("removes key events", () => {
			addEvents(mockScreen);
			const createCallback = mockScreen.events.on.mock.calls[0][1];
			const destroyCallback = mockScreen.events.once.mock.calls[0][1];

			createCallback.call(mockScreen);
			destroyCallback.call(mockScreen);

			expect(mockScreen.input.keyboard.removeKey).toHaveBeenCalledWith(
				"q",
				expect.any(Number),
				expect.any(Array),
			);
			expect(mockScreen.input.keyboard.removeKey).toHaveBeenCalledWith(
				"w",
				expect.any(Number),
				expect.any(Array),
			);
			expect(mockScreen.input.keyboard.removeKey).toHaveBeenCalledWith(
				"e",
				expect.any(Number),
				expect.any(Array),
			);
			expect(mockScreen.input.keyboard.removeKey).toHaveBeenCalledWith(
				"r",
				expect.any(Number),
				expect.any(Array),
			);
			expect(mockScreen.input.keyboard.removeKey).toHaveBeenCalledWith(
				"t",
				expect.any(Number),
				expect.any(Array),
			);
			expect(mockScreen.input.keyboard.removeKey).toHaveBeenCalledWith(
				"y",
				expect.any(Number),
				expect.any(Array),
			);
			expect(mockScreen.input.keyboard.removeKey).toHaveBeenCalledWith(
				"u",
				expect.any(Number),
				expect.any(Array),
			);
		});
	});

	describe("update method", () => {
		test("does not draw to the debug layer until enabled via keys", () => {
			addEvents(mockScreen);
			const createCallback = mockScreen.events.on.mock.calls[0][1];
			const drawCallback = mockScreen.events.on.mock.calls[1][1];

			createCallback.call(mockScreen);
			drawCallback.call(mockScreen);

			expect(mockGraphicsObject.fillRectShape).not.toHaveBeenCalled();
		});

		test("does not draw to the debug layer when toggled on then off again", () => {
			addEvents(mockScreen);
			const createCallback = mockScreen.events.on.mock.calls[0][1];
			const drawCallback = mockScreen.events.on.mock.calls[1][1];
			createCallback.call(mockScreen);

			const toggle1 = mockOnUpEvent.mock.calls[1][1];
			toggle1();
			toggle1();

			drawCallback.call(mockScreen);
			expect(mockGraphicsObject.fillRectShape).not.toHaveBeenCalled();
			expect(mockScreen.layout.debug.groups).not.toHaveBeenCalled();
			expect(mockScreen.layout.debug.buttons).not.toHaveBeenCalled();
		});

		test("does not draw to the debug layer when this.debug does not exist (update called before create)", () => {
			addEvents(mockScreen);
			const drawCallback = mockScreen.events.on.mock.calls[1][1];

			drawCallback.call(mockScreen);
			expect(mockGraphicsObject.fillRectShape).not.toHaveBeenCalled();
			expect(mockScreen.layout.debug.groups).not.toHaveBeenCalled();
			expect(mockScreen.layout.debug.buttons).not.toHaveBeenCalled();
		});

		test("debugs draws groups when enabled", () => {
			addEvents(mockScreen);
			const createCallback = mockScreen.events.on.mock.calls[0][1];
			const drawCallback = mockScreen.events.on.mock.calls[1][1];
			createCallback.call(mockScreen);

			const toggle2 = mockOnUpEvent.mock.calls[1][1];
			toggle2();

			drawCallback.call(mockScreen);

			expect(mockScreen.layout.debug.groups).toHaveBeenCalled();
		});

		test("debugs draws buttons when enabled", () => {
			addEvents(mockScreen);
			const createCallback = mockScreen.events.on.mock.calls[0][1];
			const drawCallback = mockScreen.events.on.mock.calls[1][1];
			createCallback.call(mockScreen);

			const toggle3 = mockOnUpEvent.mock.calls[2][1];
			toggle3();

			drawCallback.call(mockScreen);

			expect(mockScreen.layout.debug.buttons).toHaveBeenCalled();
		});
	});
});
