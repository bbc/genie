/**
 * @module core/layout/scrollable-list
 * @copyright BBC 2020
 * @author BBC Children's D+E
 * @license Apache-2.0 Apache-2.0
 */
import { ScrollableList } from "../../../../src/components/shop/scrollable-list/scrollable-list.js";
import * as buttons from "../../../../src/components/shop/scrollable-list/scrollable-list-buttons.js";
import * as confirm from "../../../../src/components/shop/confirm.js";
import * as handlers from "../../../../src/components/shop/scrollable-list/scrollable-list-handlers.js";
import * as scaler from "../../../../src/core/scaler.js";
import * as a11y from "../../../../src/core/accessibility/accessibility-layer.js";
import { collections } from "../../../../src/core/collections.js";
import fp from "../../../../lib/lodash/fp/fp.js";

jest.mock("../../../../src/core/accessibility/accessibilify.js");
jest.mock("../../../../src/components/shop/confirm.js");

const mockA11yElem = {
    addEventListener: jest.fn(),
};
const mockOverlay = {};

const mockGelButton = {
    width: 100,
    setScale: jest.fn(),
    accessibleElement: { update: jest.fn() },
    emit: jest.fn(),
    scene: { sys: { input: { activePointer: "mock" } } },
};
buttons.createListButton = jest.fn().mockReturnValue(mockGelButton);
buttons.scaleButton = jest.fn();
buttons.updateButton = jest.fn();
scaler.onScaleChange.add = jest.fn().mockReturnValue({ unsubscribe: "foo" });
const title = "shop";

describe("Scrollable List", () => {
    let collectionGetAll;
    let mockCollection;
    let mockGridSizer;
    let mockScrollablePanel;
    let mockScene;
    let mockSizer;
    let mockItem;
    let mockLabel;

    afterEach(jest.clearAllMocks);
    beforeEach(() => {
        mockItem = {
            id: "someItem",
            name: "someItemName",
            title: "title",
            description: "description",
            slot: "someSlot",
        };
        collectionGetAll = [mockItem];
        mockCollection = { getAll: jest.fn(() => collectionGetAll), get: () => mockCollection };
        collections.get = jest.fn().mockReturnValue(mockCollection);

        mockLabel = {
            children: [
                {
                    input: { enabled: true },
                    item: mockItem,
                    accessibleElement: { el: mockA11yElem, update: jest.fn() },
                    config: { tabbable: true },
                },
            ],
            height: 50,
            setInteractive: jest.fn(),
            on: jest.fn(),
            off: jest.fn(),
        };
        mockGridSizer = {
            add: jest.fn(),
            getElement: jest.fn().mockReturnValue([mockLabel]),
        };
        mockSizer = {
            clear: jest.fn(),
            add: jest.fn(),
        };
        mockScrollablePanel = {
            isInTouching: jest.fn(() => true),
            layout: jest.fn(),
            getByName: jest.fn(name => (name === "grid" ? mockGridSizer : mockSizer)),
            on: jest.fn(),
            once: jest.fn(),
            off: jest.fn(),
            space: { top: 10 },
            t: 0,
            height: 100,
            minHeight: 100,
            setT: jest.fn(),
            emit: jest.fn(),
        };

        mockScene = {
            addOverlay: jest.fn(),
            assetPrefix: "test",
            paneStack: { push: jest.fn() },
            panes: {
                shop: { setVisible: jest.fn() },
                manage: { setVisible: jest.fn() },
            },
            rexUI: {
                add: {
                    scrollablePanel: jest.fn(() => mockScrollablePanel),
                    sizer: jest.fn(() => mockSizer),
                    gridSizer: jest.fn(() => mockGridSizer),
                    label: jest.fn(() => mockLabel),
                },
            },
            events: { once: jest.fn() },
            input: { topOnly: true, on: jest.fn(), removeListener: jest.fn() },
            add: { image: jest.fn(), rectangle: jest.fn() },
            config: {
                assetKeys: {
                    background: { shop: "background" },
                    scrollbar: "scrollbar",
                    scrollbarHandle: "scrollbarHandle",
                },
                listPadding: { x: 10, y: 8, outerPadFactor: 2 },
                overlay: {
                    items: [mockOverlay],
                },
                paneCollections: { shop: "testCatalogue" },
                menu: { buttonsRight: true },
            },
            layout: {
                getSafeArea: jest.fn().mockReturnValue({ y: 0, x: 0, width: 100, height: 100 }),
                addCustomGroup: jest.fn(),
            },
            scale: { on: jest.fn(), removeListener: jest.fn() },
            scene: { key: "shop-list", pause: jest.fn() },
            stack: jest.fn(),
            sys: {
                queueDepthSort: jest.fn(),
                displayList: {
                    remove: jest.fn(),
                    exists: jest.fn(),
                },
            },
            transientData: {
                shop: {
                    config: {
                        shopCollections: {
                            shop: "testCatalogue",
                        },
                    },
                },
            },
        };

        a11y.addGroupAt = jest.fn();
    });

    describe("instantiation", () => {
        beforeEach(() => {
            scaler.getMetrics = jest.fn().mockReturnValue({ scale: 1 });
            new ScrollableList(mockScene, title);
        });
        describe("adds a rexUI scrollable panel", () => {
            describe("with appropriate panel config", () => {
                test("height and y are given by layout safe area", () => {
                    const config = mockScene.rexUI.add.scrollablePanel.mock.calls[0][0];
                    expect(config.height).toBe(100);
                    expect(config.y).toBe(50);
                });
                test("adds scrollbar and scrollbar handle images from config", () => {
                    expect(mockScene.add.image).toHaveBeenCalledWith(0, 0, "test.scrollbar");
                    expect(mockScene.add.image).toHaveBeenCalledWith(0, 0, "test.scrollbarHandle");
                });
                test("with spacing from config", () => {
                    const config = mockScene.rexUI.add.scrollablePanel.mock.calls[0][0];
                    const expectedSpacing = { left: 20, right: 20, top: 16, bottom: 16, panel: 10 };
                    expect(config.space).toEqual(expectedSpacing);
                });
                test("with scroll mode 0", () => {
                    const config = mockScene.rexUI.add.scrollablePanel.mock.calls[0][0];
                    expect(config.scrollMode).toBe(0);
                });
                test("with items from a collection", () => {
                    expect(collections.get).toHaveBeenCalledWith("testCatalogue");
                    expect(mockCollection.getAll).toHaveBeenCalled();
                    expect(collectionGetAll.length).toBe(1);
                    expect(buttons.createListButton).toHaveBeenCalledTimes(1);
                });
                test("with zero-quantity items filtered out", () => {
                    jest.clearAllMocks();
                    collectionGetAll = [mockItem, mockItem, { mock: "otherItem", qty: 0 }];
                    new ScrollableList(mockScene, title);
                    expect(buttons.createListButton).toHaveBeenCalledTimes(2);
                });

                test("no items table added if the catalogue collection is empty", () => {
                    jest.clearAllMocks();
                    mockGridSizer = undefined;
                    collectionGetAll = [];

                    new ScrollableList(mockScene, title);

                    expect(mockScene.rexUI.add.gridSizer).not.toHaveBeenCalled();
                });
            });

            describe("with nested rexUI elements", () => {
                test("a label is created with a gel button per item", () => {
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
                    expect(mockScene.rexUI.add.gridSizer).toHaveBeenCalled();
                    expect(mockSizer.add).toHaveBeenCalledWith(mockGridSizer, 1, "center", 0, true);
                });
            });

            describe("callbacks on labels", () => {
                let callback;

                confirm.createConfirm = jest.fn();

                beforeEach(() => {
                    callback = buttons.createListButton.mock.calls[0][3];
                });

                test("creates a confirm pane", () => {
                    callback();
                    expect(mockScene.transientData.shop.mode).toBe("shop");
                    expect(mockScene.transientData.shop.item).toBe(mockItem);
                    expect(mockScene.scene.pause).toHaveBeenCalled();
                    expect(mockScene.addOverlay).toHaveBeenCalledWith("shop-confirm");
                });
                test("don't fire if the label is scrolled off the panel", () => {
                    jest.clearAllMocks();
                    mockScrollablePanel.isInTouching = jest.fn(() => false);
                    callback("mockPointer");
                    expect(confirm.createConfirm).not.toHaveBeenCalled();
                });
            });
        });
        test("adds a resize fn to the scaler's onScaleChange", () => {
            const callback = scaler.onScaleChange.add.mock.calls[0][0];
            callback();
            expect(mockScrollablePanel.layout).toHaveBeenCalled();
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
            const onWheelSpy = jest.fn();
            const onFocusSpy = jest.fn();
            beforeEach(() => {
                handlers.updatePanelOnFocus = jest.fn().mockReturnValue(onFocusSpy);
                handlers.updatePanelOnScroll = jest.fn().mockReturnValue(jest.fn());
                handlers.updatePanelOnWheel = jest.fn().mockReturnValue(onWheelSpy);
                new ScrollableList(mockScene);
            });
            test("adds an updatePanelOnScroll", () => {
                expect(mockScrollablePanel.on).toHaveBeenCalledWith("scroll", expect.any(Function));
                mockScrollablePanel.on.mock.calls[0][1]();
                expect(handlers.updatePanelOnScroll).toHaveBeenCalledWith(mockScrollablePanel);
            });
            test("adds an updatePanelOnFocus", () => {
                expect(typeof mockScrollablePanel.updateOnFocus).toBe("function");
            });
            test("adds a focus event listener to each a11y elem that calls updateOnFocus", () => {
                expect(mockA11yElem.addEventListener.mock.calls[0][0]).toBe("focus");
                mockA11yElem.addEventListener.mock.calls[0][1]();
                expect(mockScrollablePanel.updateOnFocus).toHaveBeenCalled();
                expect(onFocusSpy).toHaveBeenCalled();
            });
            test("adds a mousewheel listener to pick up mousewheel and touch scroll events", () => {
                expect(mockScene.input.on.mock.calls[0][0]).toBe("gameobjectwheel");
                mockScene.input.on.mock.calls[0][1]();
                expect(onWheelSpy).toHaveBeenCalled();
            });
        });
        describe("shutdown", () => {
            beforeEach(() => {
                new ScrollableList(mockScene);
                const shutdownListener = mockScene.events.once.mock.calls[1][1];
                shutdownListener();
            });
            test("removes the debounced resize listener", () => {
                expect(mockScene.scale.removeListener).toHaveBeenCalled();
            });
            test("removes the mousewheel listener", () => {
                expect(mockScene.input.removeListener).toHaveBeenCalled();
            });
        });
    });
    describe("Accessibility setup", () => {
        let list;

        beforeEach(() => {
            list = new ScrollableList(mockScene);
        });

        test("adds the list as a custom group by scene key", () => {
            expect(mockScene.layout.addCustomGroup).toHaveBeenCalledWith("shop-list", mockScrollablePanel, 0);
        });
        test("adds a matching group to the accessibility layer", () => {
            expect(a11y.addGroupAt).toHaveBeenCalledWith("shop-list", 0);
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
    });
    describe("collection filtering", () => {
        const filterFn = jest.fn().mockReturnValue(true);

        beforeEach(() => new ScrollableList(mockScene, "title", filterFn));

        test("if a filter function is passed to the list, it is run against the collection", () => {
            expect(filterFn).toHaveBeenCalledTimes(1);
        });
    });
});
