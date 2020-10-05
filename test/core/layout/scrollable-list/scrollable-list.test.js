/**
 * @module core/layout/scrollable-list
 * @copyright BBC 2020
 * @author BBC Children's D+E
 * @license Apache-2.0 Apache-2.0
 */
import { scrollableList } from "../../../../src/core/layout/scrollable-list/scrollable-list.js";
import * as buttons from "../../../../src/core/layout/scrollable-list/scrollable-list-buttons.js";

const mockItem = { id: "someItem", name: "someItemName" };
const mockScrollablePanel = { layout: jest.fn() };
const mockSizer = { add: jest.fn() };
const mockGridSizer = { add: jest.fn() };
const mockLabel = {};
const mockOverlay = {};
const mockScene = {
    rexUI: {
        add: {
            scrollablePanel: jest.fn().mockReturnValue(mockScrollablePanel),
            sizer: jest.fn().mockReturnValue(mockSizer),
            gridSizer: jest.fn().mockReturnValue(mockGridSizer),
            label: jest.fn().mockReturnValue(mockLabel),
        },
    },
    input: { topOnly: true },
    add: { image: jest.fn() },
    config: {
        assetKeys: {
            prefix: "test",
            background: "background",
            scrollbar: "scrollbar",
            scrollbarHandle: "scrollbarHandle",
        },
        space: 10,
        items: [mockItem],
        overlay: {
            items: [mockOverlay],
        },
    },
    layout: {
        getSafeArea: jest.fn().mockReturnValue({ width: 100, height: 100 }),
    },
};
const mockGelButton = { width: 100, setScale: jest.fn() };
buttons.createGelButton = jest.fn().mockReturnValue(mockGelButton);


describe("Scrollable List", () => {
    beforeEach(() => {
        scrollableList(mockScene);
    });

    afterEach(() => jest.clearAllMocks());

    describe("adds a rexUI scrollable panel", () => {
        describe("with appropriate panel config", () => {
            test("x and y are zero, width and height are given by layout safe area", () => {
                const config = mockScene.rexUI.add.scrollablePanel.mock.calls[0][0];
                expect(config.x).toBe(0);
                expect(config.y).toBe(0);
                expect(config.width).toBe(100);
                expect(config.width).toBe(100);
            });
            test("adds background, scrollbar and scrollbar handle images from config", () => {
                expect(mockScene.add.image).toHaveBeenCalledWith(0, 0, "test.background");
                expect(mockScene.add.image).toHaveBeenCalledWith(0, 0, "test.scrollbar");
                expect(mockScene.add.image).toHaveBeenCalledWith(0, 0, "test.scrollbarHandle");
            });
            test("with spacing from config at bottom, top, and right", () => {
                const config = mockScene.rexUI.add.scrollablePanel.mock.calls[0][0];
                const expectedSpacing = { left: 0, right: 10, top: 10, bottom: 10, panel: 0 };
                expect(config.space).toEqual(expectedSpacing);
            });
            test("with scroll mode 0", () => {
                const config = mockScene.rexUI.add.scrollablePanel.mock.calls[0][0];
                expect(config.scrollMode).toBe(0);
            });
        });

        describe("with nested rexUI elements", () => {
            test("a label is created with a gel button per item", () => {
                expect(buttons.createGelButton).toHaveBeenCalledWith(mockScene, mockItem);
                expect(mockScene.rexUI.add.label).toHaveBeenCalledWith({
                    orientation: 0,
                    icon: mockGelButton,
                    name: mockItem.name,
                    space: { icon: 3 },
                });
            });
            test("labels are added to a grid sizer", () => {
                expect(mockScene.rexUI.add.gridSizer).toHaveBeenCalledWith({
                    column: 1,
                    row: 1,
                    space: { column: 10, row: 10 },
                });
                expect(mockGridSizer.add).toHaveBeenCalledWith(mockLabel, 0, 0, "top", 0, true);
            });
            test("the grid sizer is added to a sizer", () => {
                expect(mockScene.rexUI.add.sizer).toHaveBeenCalledWith({
                    orientation: "y",
                    space: { left: 10, right: 10, top: 0, bottom: 10, item: 10 },
                });
                expect(mockSizer.add).toHaveBeenCalledWith(mockGridSizer, 1, "center", 0, true);
            });
        });
    });
    test("sets scene.input.topOnly to false", () => {
        scrollableList(mockScene);
        expect(mockScene.input.topOnly).toBe(false);
    });
    test("calls layout() on the returned panel", () => {
        scrollableList(mockScene);
        expect(mockScrollablePanel.layout).toHaveBeenCalled();
    });
});
