/**
 * @copyright BBC 2020
 * @author BBC Children's D+E
 * @license Apache-2.0
 */

import { ShopDemo, ShopDemoGame } from "../../../src/core/debug/shop-demo.js";

describe("ShopDemo", () => {
    let shopDemo;

    beforeEach(() => {
        const mockButton = { overlays: { set: jest.fn()}, config: { callback: jest.fn() } };
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
