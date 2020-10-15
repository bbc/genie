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
    const mockScrollableList = {};

    beforeEach(() => {
        shopScreen = new Shop();
        mockData = { config: { shop: {}, home: {}, furniture: [] } };
        shopScreen.setData(mockData);
        shopScreen.scene = { key: "shop", layout: { getSafeArea: jest.fn() } };
        shopScreen.add = { container: jest.fn().mockReturnValue({ add: jest.fn() }) };
        shopScreen.addBackgroundItems = jest.fn();
        shopScreen.setLayout = jest.fn();
        shopScreen._layout = { addCustomGroup: jest.fn() };
        shopScreen.plugins = { installScenePlugin: jest.fn() };
        scroller.scrollableList = jest.fn().mockReturnValue(mockScrollableList);
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
            expect(shopScreen.panel).toBe(mockScrollableList);
        });

        // describe("sets up accessibility", () => {
        //     test("adds a container", () => {
        //         expect(false).toBe(true);
        //     });
        //     test("gives it a reset function", () => {
        //         expect(false).toBe(true);
        //     });
        //     test("adds the panel", () => {
        //         expect(false).toBe(true);
        //     });
        //     test("adds it as a custom layout group", () => {
        //         expect(false).toBe(true);
        //     });
        //     test("adds it to the a11y layer", () => {
        //         expect(false).toBe(true);
        //     });
        // });

        // test("sets up an a11y group and adds it as a11yWrapper", () => {
        //     expect(a11y.addGroupAt).toHaveBeenCalledWith("shop", 0);
        //     expect(mockScrollablePanel.a11yWrapper.style.position).toBe("absolute");
        //     expect(mockScrollablePanel.a11yWrapper.style.top).toBe("0px");
        // });

    });
});
