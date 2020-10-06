/**
 * @module components/shop
 * @copyright BBC 2020
 * @author BBC Children's D+E
 * @license Apache-2.0 Apache-2.0
 */
import { Shop } from "../../../src/components/shop/shop.js";
import * as scroller from "../../../src/core/layout/scrollable-list/scrollable-list.js";

describe("Shop", () => {
    let shopScreen;
    let mockData;

    beforeEach(() => {
        shopScreen = new Shop();
        mockData = { config: { shop: {}, home: {}, furniture: [] } };
        shopScreen.setData(mockData);
        shopScreen.scene = { key: "shop" };
        shopScreen.addBackgroundItems = jest.fn();
        shopScreen.setLayout = jest.fn();
        shopScreen.plugins = { installScenePlugin: jest.fn() };
        scroller.scrollableList = jest.fn().mockReturnValue("foo");
    });

    afterEach(() => jest.clearAllMocks());

    describe("preload", () => {
        beforeEach(() => shopScreen.preload());

        test("loads the rexUI plugin", () => {
            expect(shopScreen.plugins.installScenePlugin).toHaveBeenCalled();
        });
    });

    describe("create()", () => {
        beforeEach(() => shopScreen.create());

        test("adds background items", () => {
            expect(shopScreen.addBackgroundItems).toHaveBeenCalled();
        });

        test("adds GEL buttons to layout", () => {
            const expectedButtons = ["exit", "audio"];
            expect(shopScreen.setLayout).toHaveBeenCalledWith(expectedButtons);
        });

        test("adds a scrollable list panel", () => {
            expect(scroller.scrollableList).toHaveBeenCalled();
            expect(shopScreen.panel).toBe("foo");
        });
    });
});
