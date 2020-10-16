/**
 * @module components/shop
 * @copyright BBC 2020
 * @author BBC Children's D+E
 * @license Apache-2.0 Apache-2.0
 */
import { Shop } from "../../../src/components/shop/shop.js";
import * as scroller from "../../../src/core/layout/scrollable-list/scrollable-list.js";
import * as a11y from "../../../src/core/accessibility/accessibility-layer.js";

describe("Shop", () => {
    let shopScreen;
    let mockData;
    const mockScrollableList = {};
    const mockContainer = { add: jest.fn() };
    beforeEach(() => {
        shopScreen = new Shop();
        mockData = { config: { shop: {}, home: {}, furniture: [] } };
        shopScreen.setData(mockData);
        shopScreen.scene = { key: "shop", layout: { getSafeArea: jest.fn() } };
        shopScreen.add = { container: jest.fn().mockReturnValue(mockContainer) };
        shopScreen.addBackgroundItems = jest.fn();
        shopScreen.setLayout = jest.fn();
        shopScreen._layout = { addCustomGroup: jest.fn() };
        shopScreen.plugins = { installScenePlugin: jest.fn() };
        scroller.scrollableList = jest.fn().mockReturnValue(mockScrollableList);
        scroller.resizePanel = jest.fn();
        a11y.addGroupAt = jest.fn();
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

        describe("calls setupScrollableList", () => {
            test("adds a scrollable list panel", () => {
                expect(scroller.scrollableList).toHaveBeenCalled();
                expect(shopScreen.panel).toBe(mockScrollableList);
            });
            test("adds a container", () => {
                expect(shopScreen.add.container).toHaveBeenCalled();
            });
            test("gives it a reset function that calls resizePanel", () => {
                expect(typeof mockContainer.reset).toBe("function");
                mockContainer.reset();
                expect(scroller.resizePanel).toHaveBeenCalled();
            });
            test("adds the panel to the container", () => {
                expect(mockContainer.add).toHaveBeenCalledWith(mockScrollableList);
            });
            test("adds the container as a custom group by scene key", () => {
                expect(shopScreen._layout.addCustomGroup).toHaveBeenCalledWith("shop", mockContainer, 0);
            });
            test("adds a matching group to the accessibility layer", () => {
                expect(a11y.addGroupAt).toHaveBeenCalledWith("shop", 0);
            });
        });
    });
});
