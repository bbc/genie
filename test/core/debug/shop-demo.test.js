/**
 * @copyright BBC 2020
 * @author BBC Children's D+E
 * @license Apache-2.0
 */

import { ShopDemo, ShopDemoGame } from "../../../src/core/debug/shop-demo.js";
import { collections } from "../../../src/core/collections.js";

describe("ShopDemo", () => {
    let shopDemo;

    beforeEach(() => {
        const mockButton = { overlays: { set: jest.fn() }, config: { callback: jest.fn() } };
        const mockText = { setOrigin: jest.fn() };
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
        const mockInventory = { get: jest.fn(), getAll: jest.fn() };
        collections.get = jest.fn().mockReturnValue(mockInventory);
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

    beforeEach(() => {
        shopDemoGame = new ShopDemoGame();

        shopDemoGame.scene = { key: "shopDemoGame" };
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
                    player: { spawn: { x: 0, y: 0 }, hat: { scale: 1 } },
                },
            },
        };
        shopDemoGame.anims = { create: jest.fn(), generateFrameNumbers: jest.fn() };
        shopDemoGame.setLayout = jest.fn();
        mockCursors = { space: { isDown: true } };
        shopDemoGame.input = { keyboard: { createCursorKeys: jest.fn().mockReturnValue(mockCursors) } };
        const mockCurrency = { qty: 1 };
        const mockInventory = { get: jest.fn().mockReturnValue(mockCurrency), getAll: jest.fn().mockReturnValue([]) };
        collections.get = jest.fn().mockReturnValue(mockInventory);
        shopDemoGame.add = {
            text: jest.fn(),
            container: jest.fn().mockReturnValue({ setPosition: jest.fn().mockReturnValue({ add: jest.fn() }) }),
            sprite: jest.fn().mockReturnValue({ setScale: jest.fn().mockReturnValue({ play: jest.fn() }) }),
            image: jest.fn().mockReturnValue({
                setFlipX: jest.fn().mockReturnValue({ setScale: jest.fn().mockReturnValue("foo") }),
            }),
        };
        shopDemoGame.physics = {
            add: {
                sprite: jest.fn().mockReturnValue({
                    setScale: jest
                        .fn()
                        .mockReturnValue({ setGravityY: jest.fn().mockReturnValue({ play: jest.fn() }) }),
                }),
            },
        };
    });

    describe("create", () => {
        beforeEach(() => shopDemoGame.create());

        test("creates cursors", () => {
            expect(shopDemoGame.cursors).toBe(mockCursors);
        });
    });
});
