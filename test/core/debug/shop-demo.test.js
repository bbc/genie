/**
 * @copyright BBC 2020
 * @author BBC Children's D+E
 * @license Apache-2.0
 */

import { ShopDemo, ShopDemoGame } from "../../../src/core/debug/shop-demo.js";
import { collections } from "../../../src/core/collections.js";

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

    beforeEach(() => {
        shopDemoGame = new ShopDemoGame();

        
        mockCursors = { space: { isDown: false } };
        mockCurrency = { qty: 1 };
        mockInventory = {
            get: jest.fn().mockReturnValue(mockCurrency),
            getAll: jest.fn().mockReturnValue([]),
            set: jest.fn(),
        };
        mockContainer = { add: jest.fn(), x: 0, setX: jest.fn() };
        mockSprite = { play: jest.fn(), setFlipX: jest.fn(), anims: { chain: jest.fn() }, lastChopTime: 1 };
        mockImage = { x: 0, y: 0 };
        mockText = { setText: jest.fn() };
        mockArcadeSprite = {
            play: jest.fn(),
            body: { gravity: { y: 100 } },
            setGravityY: jest.fn().mockReturnValue({ setVelocityY: jest.fn().mockReturnValue({ setY: jest.fn() }) }),
            y: 0,
        };
        
        collections.get = jest.fn().mockReturnValue(mockInventory);
        
        shopDemoGame.scene = { key: "shopDemoGame" };
        shopDemoGame.time = { now: 1000 };
        shopDemoGame._data = {
            config: {
                shopDemoGame: {
                    assets: {
                        coin: { key: "foo", scale: 1 },
                        coinPop: { key: "bar", scale: 1 },
                        player: { key: "baz", scale: 1 },
                        tree: { key: "qaz", scale: 1 },
                    },
                    paneCollections: { manage: "inventory" },
                    balance: { value: { key: "qux" } },
                    treeSpawns: [{ key: "tree", x: 0, y: 0, flip: true }],
                    coinSpawns: [{ x: 0, y: 0 }],
                    player: { spawn: { x: 0, y: 0 }, hat: { scale: 1 }, xLimit: 50 },
                    timers: { chopDebounce: 100 },
                    colliderSize: 10,
                    gravity: 100,
                },
            },
        };
        shopDemoGame.anims = { create: jest.fn(), generateFrameNumbers: jest.fn() };
        shopDemoGame.setLayout = jest.fn();
        shopDemoGame.add = {
            text: jest.fn().mockReturnValue(mockText),
            container: jest.fn().mockReturnValue({ setPosition: jest.fn().mockReturnValue(mockContainer) }),
            sprite: jest.fn().mockReturnValue({ setScale: jest.fn().mockReturnValue(mockSprite) }),
            image: jest.fn().mockReturnValue({
                setFlipX: jest.fn().mockReturnValue({ setScale: jest.fn().mockReturnValue(mockImage) }),
            }),
        };
        shopDemoGame.physics = {
            add: {
                sprite: jest.fn().mockReturnValue({
                    setScale: jest.fn().mockReturnValue({ setGravityY: jest.fn().mockReturnValue(mockArcadeSprite) }),
                }),
            },
        };
        shopDemoGame.input = { keyboard: { createCursorKeys: jest.fn().mockReturnValue(mockCursors) } };
    });

    describe("create", () => {
        beforeEach(() => shopDemoGame.create());

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
    });
    describe("woodChop()", () => {
        beforeEach(() => shopDemoGame.create());
        test("when called when player is within range of tree, drops coins", () => {
            shopDemoGame.woodChop(mockContainer);
            expect(mockArcadeSprite.setGravityY).toHaveBeenCalledWith(100);
        });
    });
});
