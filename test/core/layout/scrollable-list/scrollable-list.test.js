/**
 * @module core/layout/scrollable-list
 * @copyright BBC 2020
 * @author BBC Children's D+E
 * @license Apache-2.0 Apache-2.0
 */
import { ScrollableList } from "../../../../src/core/layout/scrollable-list/scrollable-list.js";
import * as buttons from "../../../../src/core/layout/scrollable-list/scrollable-list-buttons.js";
import * as handlers from "../../../../src/core/layout/scrollable-list/scrollable-list-handlers.js";
import * as scaler from "../../../../src/core/scaler.js";
import * as a11y from "../../../../src/core/accessibility/accessibility-layer.js";
import * as catalogue from "../../../../src/core/collections.js";
import fp from "../../../../lib/lodash/fp/fp.js";

const mockItem = { id: "someItem", name: "someItemName" };
const mockA11yElem = {
    addEventListener: jest.fn(),
};
const mockLabel = {
    children: [{ input: { enabled: true }, accessibleElement: { el: mockA11yElem, update: jest.fn() } }],
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
    once: jest.fn(),
    off: jest.fn(),
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
        listPadding: { x: 10, y: 8 },
        overlay: {
            items: [mockOverlay],
        },
        itemsCatalogueSection: "testCatalogue",
    },
    layout: {
        getSafeArea: jest.fn().mockReturnValue({ y: 0, x: 0, width: 100, height: 100 }),
        addCustomGroup: jest.fn(),
    },
    scale: { on: jest.fn() },
    scene: { key: "shop" },
    sys: {
        queueDepthSort: jest.fn(),
        displayList: {
            remove: jest.fn(),
        },
    },
};
const mockCollection = { getAll: jest.fn().mockReturnValue([mockItem]) };
catalogue.collections = { get: jest.fn().mockReturnValue(mockCollection) };
const mockGelButton = {
    width: 100,
    setScale: jest.fn(),
    accessibleElement: { update: jest.fn() },
};
buttons.createGelButton = jest.fn().mockReturnValue(mockGelButton);
buttons.scaleButton = jest.fn();

describe("Scrollable List", () => {
    afterEach(jest.clearAllMocks);
    beforeEach(() => {
        a11y.addGroupAt = jest.fn();
    });

    describe("instantiation", () => {
        beforeEach(() => {
            scaler.getMetrics = jest.fn().mockReturnValue({ scale: 1 });
            new ScrollableList(mockScene);
        });
        describe("adds a rexUI scrollable panel", () => {
            describe("with appropriate panel config", () => {
                test("height and y are given by layout safe area", () => {
                    const config = mockScene.rexUI.add.scrollablePanel.mock.calls[0][0];
                    expect(config.height).toBe(100);
                    expect(config.y).toBe(50);
                });
                test("adds background, scrollbar and scrollbar handle images from config", () => {
                    expect(mockScene.add.image).toHaveBeenCalledWith(0, 0, "test.background");
                    expect(mockScene.add.image).toHaveBeenCalledWith(0, 0, "test.scrollbar");
                    expect(mockScene.add.image).toHaveBeenCalledWith(0, 0, "test.scrollbarHandle");
                });
                test("with spacing from config", () => {
                    const config = mockScene.rexUI.add.scrollablePanel.mock.calls[0][0];
                    const expectedSpacing = { left: 10, right: 10, top: 8, bottom: 8, panel: 10 };
                    expect(config.space).toEqual(expectedSpacing);
                });
                test("with scroll mode 0", () => {
                    const config = mockScene.rexUI.add.scrollablePanel.mock.calls[0][0];
                    expect(config.scrollMode).toBe(0);
                });
                test("with items from a collection in the catalogue", () => {
                    expect(catalogue.collections.get).toHaveBeenCalledWith("testCatalogue");
                    expect(mockCollection.getAll).toHaveBeenCalled();
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
                        space: { row: 8 },
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
                new ScrollableList(mockScene);
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
                new ScrollableList(mockScene);
            });
            test("adds an updatePanelOnScroll", () => {
                expect(typeof mockScrollablePanel.updateOnScroll).toBe("function");
                expect(mockScrollablePanel.on).toHaveBeenCalledWith("scroll", mockScrollablePanel.updateOnScroll);
            });
            test("adds an updatePanelOnFocus", () => {
                expect(typeof mockScrollablePanel.updateOnFocus).toBe("function");
            });
            test("adds a focus event listener to each a11y elem that calls updateOnFocus", () => {
                expect(mockA11yElem.addEventListener.mock.calls[0][0]).toBe("focus");
                mockA11yElem.addEventListener.mock.calls[0][1]();
                expect(mockScrollablePanel.updateOnFocus).toHaveBeenCalled();
            });
        });
    });
    describe("Accessibility setup", () => {
        let list;

        beforeEach(() => {
            list = new ScrollableList(mockScene);
        });

        test("adds the list as a custom group by scene key", () => {
            expect(mockScene.layout.addCustomGroup).toHaveBeenCalledWith("shop", list, 0);
        });
        test("adds a matching group to the accessibility layer", () => {
            expect(a11y.addGroupAt).toHaveBeenCalledWith("shop", 0);
        });
    });

    describe("Class methods", () => {
        let list;

        beforeEach(() => {
            list = new ScrollableList(mockScene);
        });

        test("reset method that calls resizePanel", () => {
            list.reset();
            expect(buttons.scaleButton).toHaveBeenCalled();
        });

        test("getBoundingRect method returns current safe area", () => {
            expect(list.getBoundingRect()).toEqual({
                height: 100,
                width: 100,
                x: 0,
                y: 0,
            });
        });

        test("setVisible method that sets visibility", () => {
            list.setVisible(false);
            expect(list.panel.visible).toBe(false);
            expect(mockLabel.children[0].input.enabled).toBe(false);
            expect(mockLabel.children[0].accessibleElement.update).toHaveBeenCalled();
        });
    });
});
