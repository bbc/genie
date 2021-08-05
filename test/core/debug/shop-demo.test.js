/**
 * @copyright BBC 2020
 * @author BBC Children's D+E
 * @license Apache-2.0
 */

import { ShopDemo, ShopDemoGame } from "../../../src/core/debug/shop-demo.js";
import { collections } from "../../../src/core/collections.js";
import { gmi } from "../../../src/core/gmi/gmi.js";
import * as a11y from "../../../src/core/accessibility/accessibilify.js";
import { initResizers } from "../../../src/components/shop/backgrounds.js";

describe("ShopDemo", () => {
	let shopDemo;
	let mockInventory;
	let mockButton;
	let mockText;

	beforeEach(() => {
		mockButton = { overlays: { set: jest.fn() }, config: { callback: jest.fn() } };
		mockText = { setOrigin: jest.fn() };
		mockInventory = { get: jest.fn(), getAll: jest.fn() };

		collections.get = jest.fn().mockReturnValue(mockInventory);

		shopDemo = new ShopDemo();
		shopDemo.add = {
			gelButton: jest.fn().mockReturnValue(mockButton),
			text: jest.fn().mockReturnValue(mockText),
		};
		shopDemo._data = {
			config: {
				shopDemo: {
					foo: "bar",
				},
			},
		};
		shopDemo.navigation = { game: jest.fn(), shop: jest.fn() };
		shopDemo.scene = { key: "shopDemo" };
		shopDemo.setLayout = jest.fn();
		shopDemo.events = { once: jest.fn() };
		a11y.accessibilify = jest.fn();
	});

	describe("create()", () => {
		beforeEach(() => shopDemo.create());

		test("sets layout", () => {
			expect(shopDemo.setLayout).toHaveBeenCalledWith(["back"]);
		});

		test("creates two gel buttons", () => {
			expect(shopDemo.add.gelButton).toHaveBeenCalledTimes(2);
			const gameCallback = shopDemo.add.gelButton.mock.calls[0][2].callback;
			gameCallback();
			expect(shopDemo.navigation.game).toHaveBeenCalled();
			const shopCallback = shopDemo.add.gelButton.mock.calls[1][2].callback;
			shopCallback();
			expect(shopDemo.navigation.shop).toHaveBeenCalled();
		});
	});
});

describe("ShopDemoGame", () => {
	let shopDemoGame;
	let mockCursors;
	let mockContainer;
	let mockSprite;
	let mockArcadeSprite;
	let mockImage;
	let mockText;
	let mockInventory;
	let mockCurrency;
	let mockHatCollection;
	let mockButton;
	let mockEventHandler;

	beforeEach(() => {
		shopDemoGame = new ShopDemoGame();

		shopDemoGame.plugins = {
			addToScene: jest.fn(),
		};

		mockHatCollection = [];
		mockCursors = { space: { isDown: false } };
		mockCurrency = { qty: 1 };
		mockInventory = {
			get: jest.fn().mockReturnValue(mockCurrency),
			getAll: jest.fn().mockReturnValue(mockHatCollection),
			set: jest.fn(),
		};
		mockContainer = { add: jest.fn(), x: 0, setX: jest.fn(), destroy: jest.fn() };
		mockSprite = {
			play: jest.fn(),
			setFlipX: jest.fn(),
			anims: { chain: jest.fn() },
			destroy: jest.fn(),
			lastChopTime: 1,
		};
		mockEventHandler = { on: jest.fn() };
		mockImage = { x: 0, y: 0, setInteractive: jest.fn().mockReturnValue(mockEventHandler) };
		mockText = { setText: jest.fn(), setOrigin: jest.fn() };
		mockArcadeSprite = {
			play: jest.fn(),
			body: { gravity: { y: 100 } },
			setGravityY: jest.fn().mockReturnValue({ setVelocityY: jest.fn().mockReturnValue({ setY: jest.fn() }) }),
			setPosition: jest.fn(),
			x: 0,
			y: 0,
		};
		mockButton = { overlays: { set: jest.fn() }, config: { callback: jest.fn() }, scene: shopDemoGame };

		collections.get = jest.fn().mockReturnValue(mockInventory);
		gmi.setGameData = jest.fn();

		shopDemoGame.scene = { key: "shopDemoGame" };
		shopDemoGame.time = { now: 1000 };
		shopDemoGame.sys = { scale: {}, accessibleButtons: [] };
		shopDemoGame._data = {
			config: {
				shopDemoGame: {
					assets: {
						coin: { key: "foo", scale: 1 },
						coinPop: { key: "bar", scale: 1 },
						player: { key: "baz", scale: 1 },
						tree: { key: "qaz", scale: 1 },
						hit: { key: "wix" },
						whiff: { key: "sop" },
						coinGet: { key: "bap" },
					},
					paneCollections: { manage: "inventory" },
					balance: { value: { key: "qux" } },
					treeSpawns: [{ key: "tree", x: 0, y: 0, flip: true }],
					coinSpawns: [{ x: 0, y: 0 }],
					player: { spawn: { x: 0, y: 0 }, hat: { scale: 1, yOffset: 3 }, xLimit: 50 },
					timers: { chopDebounce: 100, coinSpawn: -1 },
					colliderSize: 10,
					gravity: 100,
					groundY: 0,
				},
			},
		};
		shopDemoGame.anims = { create: jest.fn(), generateFrameNumbers: jest.fn(), remove: jest.fn() };
		shopDemoGame.setLayout = jest.fn();
		shopDemoGame.add = {
			text: jest.fn().mockReturnValue(mockText),
			container: jest.fn().mockReturnValue({ setPosition: jest.fn().mockReturnValue(mockContainer) }),
			sprite: jest.fn().mockReturnValue({ setScale: jest.fn().mockReturnValue(mockSprite) }),
			image: jest.fn().mockReturnValue({
				setFlipX: jest.fn().mockReturnValue({ setScale: jest.fn().mockReturnValue(mockImage) }),
			}),
			gelButton: jest.fn().mockReturnValue(mockButton),
		};
		shopDemoGame.physics = {
			add: {
				sprite: jest.fn().mockReturnValue({
					setScale: jest.fn().mockReturnValue({ setGravityY: jest.fn().mockReturnValue(mockArcadeSprite) }),
				}),
			},
			start: jest.fn(),
		};
		shopDemoGame.sound = { add: jest.fn().mockReturnValue({ play: jest.fn() }) };
		shopDemoGame.input = {
			keyboard: { createCursorKeys: jest.fn().mockReturnValue(mockCursors) },
			activePointer: { isDown: false },
		};
		shopDemoGame.children = { list: [mockImage] };
		shopDemoGame.events = { once: jest.fn() };
		shopDemoGame.transientData = {
			shop: {
				config: {
					shopCollections: {
						shop: "",
						manage: "",
					},
				},
			},
		};

		global.RexPlugins = { GameObjects: { NinePatch: jest.fn() } };
		initResizers();
	});

	describe("preload", () => {
		beforeEach(() => shopDemoGame.preload());

		test("loads and starts arcade physics ", () => {
			expect(shopDemoGame.plugins.addToScene).toHaveBeenCalled();
			expect(shopDemoGame.physics.start).toHaveBeenCalled();
		});
	});

	describe("create", () => {
		beforeEach(() => {
			shopDemoGame.create();
		});

		test("creates cursors", () => {
			expect(shopDemoGame.cursors).toBe(mockCursors);
		});
		test("creates a balance UI component with a setBalance fn", () => {
			shopDemoGame.balanceUI.setBalance("foo");
			expect(mockText.setText).toHaveBeenCalledWith("Coins: foo");
		});
		test("adds a getCoin fn that updates the balance and UI", () => {
			shopDemoGame.getCoin();
			expect(mockInventory.set).toHaveBeenCalled();
			expect(mockText.setText).toHaveBeenCalledWith("Coins: 2");
		});
		test("makes the background interactive", () => {
			const callback = mockEventHandler.on.mock.calls[0][1];
			callback();
		});
		test("picks the spritesheet for the best equipped hat", () => {
			const expectedFrameNumbers = { start: 0, end: 7 };
			expect(shopDemoGame.anims.generateFrameNumbers).toHaveBeenCalledWith(
				"shopDemo.ironHat",
				expectedFrameNumbers,
			);
			mockHatCollection = [
				{ userData: { key: "someOther.key" }, price: 10, tags: ["demo-hat"], state: "equipped" },
				{ userData: { key: "some.key" }, price: 100, tags: ["demo-hat"], state: "equipped" },
				{ userData: { key: "yetAnother.key" }, price: 30, tags: ["demo-hat"], state: "equipped" },
			];
			mockInventory.getAll = jest.fn().mockReturnValue(mockHatCollection);
			shopDemoGame.create();
			expect(shopDemoGame.anims.generateFrameNumbers).toHaveBeenCalledWith("some.key", expectedFrameNumbers);
		});
		test("makes some cheat buttons that reset the inventory and add coins", () => {
			const addCoinCallback = shopDemoGame.add.gelButton.mock.calls[1][2].callback;
			const resetCallback = shopDemoGame.add.gelButton.mock.calls[0][2].callback;
			addCoinCallback();
			expect(mockInventory.set).toHaveBeenCalledTimes(1);
			resetCallback();
			expect(gmi.setGameData).toHaveBeenCalled();
		});
	});

	describe("update", () => {
		beforeEach(() => shopDemoGame.create());

		describe("updates the player", () => {
			test("by setting X", () => {
				shopDemoGame.update();
				expect(mockContainer.setX).toHaveBeenCalled();
			});
			test("x-flipping the player once past limits", () => {
				shopDemoGame.entities.player.container.x = 100;
				shopDemoGame.update();
				expect(mockSprite.setFlipX).toHaveBeenCalled();
			});
			test("and trying a chop action if space is down", () => {
				mockCursors.space.isDown = true;
				shopDemoGame.update();
				expect(mockSprite.play).toHaveBeenCalledWith("chop");
			});
		});
		describe("updates coins", () => {
			test("falling coins that have landed have their fall stopped", () => {
				shopDemoGame.update();
				expect(mockArcadeSprite.setGravityY).toHaveBeenCalled();
			});
			test("coins that are to be collected are despawned", () => {
				shopDemoGame.update();
				expect(mockArcadeSprite.play).toHaveBeenCalledWith("coinPop");
			});
			test("coins that have despawned are checked for respawn", () => {
				shopDemoGame.update();
				expect(mockArcadeSprite.play).toHaveBeenCalledWith("coinSpin");
			});
		});
	});
	describe("woodChop()", () => {
		beforeEach(() => shopDemoGame.create());
		test("when called when player is within range of tree, drops coins", () => {
			shopDemoGame.woodChop(mockContainer);
			expect(mockArcadeSprite.setGravityY).toHaveBeenCalledWith(100);
		});
		test("when called during debounce timer, nothing happens", () => {
			jest.clearAllMocks();
			shopDemoGame.entities.player.sprite.lastChopTime = 999;
			shopDemoGame.entities.player.chopWood();
			expect(shopDemoGame.entities.player.sprite.play).not.toHaveBeenCalled();
		});
		test("coins don't fall if off their spawn points", () => {
			shopDemoGame.entities.coins[0].sprite.y = 100;
			shopDemoGame.woodChop(mockContainer);
			expect(mockArcadeSprite.setGravityY).not.toHaveBeenCalledWith(100);
		});
	});
});
