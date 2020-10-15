/**
 * @module core/layout/scrollable-list
 * @copyright BBC 2020
 * @author BBC Children's D+E
 * @license Apache-2.0 Apache-2.0
 */
import { scrollableList } from "../../../../src/core/layout/scrollable-list/scrollable-list.js";
import * as buttons from "../../../../src/core/layout/scrollable-list/scrollable-list-buttons.js";
import * as handlers from "../../../../src/core/layout/scrollable-list/scrollable-list-handlers.js";
import * as scaler from "../../../../src/core/scaler.js";
import * as a11y from "../../../../src/core/accessibility/accessibility-layer.js";
import fp from "../../../../lib/lodash/fp/fp.js";

const mockItem = { id: "someItem", name: "someItemName" };
const mockA11yElem = {
    addEventListener: jest.fn(),
};
const mockLabel = {
    children: [{ accessibleElement: { el: mockA11yElem } }],
    height: 50,
};
const mockGridSizer = {
    add: jest.fn(),
    getElement: jest.fn().mockReturnValue([mockLabel]),
};
const mockScrollablePanel = {
    layout: jest.fn(),
    getByName: jest.fn().mockReturnValue(mockGridSizer),
    on: jest.fn(),
    space: { top: 10 },
    t: 0,
    height: 100,
    minHeight: 100,
    setT: jest.fn(),
};
const mockSizer = { add: jest.fn() };
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
        getSafeArea: jest.fn().mockReturnValue({ y: 0, x: 0, width: 100, height: 100 }),
    },
    scale: { on: jest.fn() },
};
const mockGelButton = { width: 100, setScale: jest.fn() };
buttons.createGelButton = jest.fn().mockReturnValue(mockGelButton);
buttons.scaleButton = jest.fn();

describe("Scrollable List", () => {
    afterEach(() => jest.clearAllMocks());

    describe("instantiation", () => {
        beforeEach(() => {
            a11y.addGroupAt = jest.fn();
            scaler.getMetrics = jest.fn().mockReturnValue({ scale: 1 });
            scrollableList(mockScene);
        });
        describe("adds a rexUI scrollable panel", () => {
            describe("with appropriate panel config", () => {
                test("height is given by layout safe area", () => {
                    const config = mockScene.rexUI.add.scrollablePanel.mock.calls[0][0];
                    expect(config.height).toBe(100);
                });
                test("adds background, scrollbar and scrollbar handle images from config", () => {
                    expect(mockScene.add.image).toHaveBeenCalledWith(0, 0, "test.background");
                    expect(mockScene.add.image).toHaveBeenCalledWith(0, 0, "test.scrollbar");
                    expect(mockScene.add.image).toHaveBeenCalledWith(0, 0, "test.scrollbarHandle");
                });
                test("with spacing from config at bottom, top, and right", () => {
                    const config = mockScene.rexUI.add.scrollablePanel.mock.calls[0][0];
                    const expectedSpacing = { left: 10, right: 10, top: 10, bottom: 10, panel: 10 };
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
                        name: mockItem.id,
                    });
                });
                test("labels are added to a grid sizer", () => {
                    expect(mockScene.rexUI.add.gridSizer).toHaveBeenCalledWith({
                        column: 1,
                        row: 1,
                        name: "grid",
                        space: { row: 10 },
                    });
                    expect(mockGridSizer.add).toHaveBeenCalledWith(mockLabel, 0, 0, "top", 0, true);
                });
                test("the grid sizer is added to a sizer", () => {
                    expect(mockScene.rexUI.add.sizer).toHaveBeenCalledWith({
                        orientation: "y",
                    });
                    expect(mockSizer.add).toHaveBeenCalledWith(mockGridSizer, 1, "center", 0, true);
                });
            });
        });
        test("assigns a callback to scene on resize", () => {
            expect(mockScene.scale.on.mock.calls[0][0]).toBe("resize");
        });
        test("sets scene.input.topOnly to false", () => {
            expect(mockScene.input.topOnly).toBe(false);
        });
        test("calls layout() on the returned panel", () => {
            expect(mockScrollablePanel.layout).toHaveBeenCalled();
        });
    });

    describe("event setup", () => {
        describe("resizing", () => {
            beforeEach(() => {
                jest.spyOn(fp, "debounce").mockImplementation((value, callback) => callback);
                scrollableList(mockScene);
                mockScene.scale.on.mock.calls[0][1]();
            });
            test("calls layout on the panel", () => {
                expect(mockScrollablePanel.layout).toHaveBeenCalledTimes(2);
            });
            test("sets the panel minHeight and y from the safe area", () => {
                expect(mockScrollablePanel.minHeight).toBe(100);
                expect(mockScrollablePanel.y).toBe(50);
            });
            test("calls scaleButton on each gel button", () => {
                expect(buttons.scaleButton).toHaveBeenCalled();
            });
            test("sets T to resolve an edge case where an aspect ratio change creates an illegal T value", () => {
                expect(mockScrollablePanel.setT).toHaveBeenCalled();
            });
        });
        describe("scrolling", () => {
            beforeEach(() => {
                handlers.updatePanelOnFocus = jest.fn().mockReturnValue(jest.fn());
                handlers.updatePanelOnScroll = jest.fn().mockReturnValue(jest.fn());
                scrollableList(mockScene);
            });
            test("adds an updatePanelOnScroll", () => {
                expect(typeof mockScrollablePanel.updateOnScroll).toBe("function");
                expect(mockScrollablePanel.on).toHaveBeenCalledWith("scroll", mockScrollablePanel.updateOnScroll);
            });
            test("adds an updatePanelOnFocus", () => {
                expect(typeof mockScrollablePanel.updateOnFocus).toBe("function");
            });
            test("adds a focus event listener to each a11y elem", () => {
                expect(mockA11yElem.addEventListener.mock.calls[0][0]).toBe("focus");
            });
        });
    });
});
