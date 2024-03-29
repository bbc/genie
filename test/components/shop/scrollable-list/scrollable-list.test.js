/**
 * @module core/layout/scrollable-list
 * @copyright BBC 2020
 * @author BBC Children's D+E
 * @license Apache-2.0
 */
import { ScrollableList } from "../../../../src/components/shop/scrollable-list/scrollable-list.js";
import * as panel from "../../../../src/components/shop/scrollable-list/scrollable-panel.js";
import * as buttons from "../../../../src/components/shop/scrollable-list/scrollable-list-buttons.js";
import * as handlers from "../../../../src/components/shop/scrollable-list/scrollable-list-handlers.js";
import * as scaler from "../../../../src/core/scaler.js";
import * as a11y from "../../../../src/core/accessibility/accessibility-layer.js";
import * as backgroundsModule from "../../../../src/components/shop/backgrounds.js";
import * as coversModule from "../../../../src/components/shop/scrollable-list/scrollable-list-covers.js";
import { collections } from "../../../../src/core/collections.js";
import * as text from "../../../../src/core/layout/text.js";
import fp from "../../../../lib/lodash/fp/fp.js";
import * as gmiModule from "../../../../src/core/gmi/gmi.js";

jest.mock("../../../../src/core/accessibility/accessibility-layer.js");
jest.mock("../../../../src/core/accessibility/accessibilify.js");
jest.mock("../../../../src/core/collections.js");
jest.mock("../../../../src/components/shop/scrollable-list/scrollable-list-handlers.js");
jest.mock("../../../../src/components/shop/scrollable-list/scrollable-list-buttons.js");
jest.mock("../../../../src/components/shop/scrollable-list/scrollable-list-covers.js");
jest.mock("../../../../src/core/scaler.js");
jest.mock("../../../../src/components/shop/backgrounds.js");
jest.mock("../../../../src/components/shop/scrollable-list/scrollable-panel.js");
jest.mock("../../../../src/core/layout/text.js");

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

const mockText = {
	setOrigin: jest.fn(() => mockText),
	setPosition: jest.fn(() => mockText),
};

buttons.createListButton = jest.fn(() => mockGelButton);
scaler.onScaleChange.add = jest.fn(() => ({ unsubscribe: "foo" }));
backgroundsModule.resizeBackground = jest.fn(() => jest.fn());
coversModule.createCovers = jest.fn();
coversModule.resizeCovers = jest.fn();
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
	let mockGmi;
	let mockPointer;
	let mockChild;
	let mockText;

	afterEach(jest.clearAllMocks);
	beforeEach(() => {
		ScrollableList.prototype.add = jest.fn();
		backgroundsModule.createBackground = jest.fn(() => () => {});
		mockText = { setOrigin: jest.fn(() => mockText), setPosition: jest.fn(() => mockText) };
		text.addText = jest.fn(() => mockText);
		panel.getPanelY = jest.fn(() => ({ height: 100, y: 50 }));
		mockChild = { add: jest.fn() };
		panel.createScrollablePanel = jest.fn(() => ({ scrollablePanel: mockScrollablePanel, child: mockChild }));
		mockGmi = { sendStatsEvent: jest.fn() };
		gmiModule.gmi = mockGmi;
		mockItem = {
			id: "someItem",
			name: "someItemName",
			title: "title",
			description: "description",
			slot: "someSlot",
		};
		collectionGetAll = [mockItem];
		mockCollection = { getAll: jest.fn(() => collectionGetAll), get: () => mockCollection };
		collections.get = jest.fn(() => mockCollection);

		mockLabel = {
			children: [
				{
					input: { enabled: true },
					item: mockItem,
					accessibleElement: { el: mockA11yElem, update: jest.fn() },
					config: { tabbable: true },
				},
			],
			childrenMap: { icon: { setInteractive: jest.fn(), disableInteractive: jest.fn() } },
			height: 50,
			setInteractive: jest.fn(),
			on: jest.fn(),
			off: jest.fn(),
		};
		mockGridSizer = {
			add: jest.fn(),
			getElement: jest.fn(() => [mockLabel]),
		};
		mockSizer = {
			clear: jest.fn(),
			add: jest.fn(),
		};
		mockScrollablePanel = {
			childrenMap: { scroller: { state: "DRAGBEGIN" } },
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
			addToDisplayList: jest.fn(),
			removeFromDisplayList: jest.fn(),
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
			add: {
				image: jest.fn(),
				rectangle: jest.fn(),
				text: jest.fn(() => mockText),
			},
			config: {
				assetKeys: {
					background: { shop: "background" },
					scrollbar: "scrollbar",
					scrollbarHandle: "scrollbarHandle",
				},
				listPadding: { x: 10, y: 8, outerPadFactor: 2 },
				listCovers: {
					shop: {
						top: { key: "mockTopCover" },
						bottom: { key: "mockBottomCover" },
					},
				},
				overlay: {
					items: [mockOverlay],
				},
				paneCollections: { shop: "testCatalogue" },
				menu: { buttonsRight: true },
			},
			layout: {
				getSafeArea: jest.fn(() => ({ y: 0, x: 0, width: 100, height: 100 })),
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
		mockPointer = {
			screen: {
				input: {
					keyboard: {
						prevType: "",
					},
				},
			},
		};
		global.RexPlugins = {
			GameObjects: {
				NinePatch: jest.fn(),
			},
		};
		backgroundsModule.initResizers();
	});

	describe("instantiation", () => {
		beforeEach(() => {
			scaler.getMetrics = jest.fn(() => ({ scale: 1 }));
			new ScrollableList(mockScene, title);
		});
		describe("adds a rexUI scrollable panel", () => {
			describe("with appropriate panel config", () => {
				test("calls create scrollable panel correctly", () => {
					jest.clearAllMocks();
					collectionGetAll = [mockItem, mockItem, { mock: "otherItem", qty: 0 }];
					const expectedCoversConfig = {
						...mockScene.config.listCovers.shop,
						...mockScene.config.listPadding,
					};
					const list = new ScrollableList(mockScene, title);
					expect(panel.createScrollablePanel).toHaveBeenCalledWith(mockScene, title, list);
					expect(coversModule.createCovers).toHaveBeenCalledWith(mockScene, expectedCoversConfig);
				});
				test("with items from a collection", () => {
					expect(collections.get).toHaveBeenCalledWith("testCatalogue");
					expect(mockCollection.getAll).toHaveBeenCalled();
					expect(collectionGetAll.length).toBe(1);
					expect(buttons.createListButton).toHaveBeenCalledTimes(1);
				});
				test("with zero-quantity items filtered out and qty undefined counted as 1", () => {
					jest.clearAllMocks();
					collectionGetAll = [mockItem, mockItem, { mock: "otherItem", qty: 0 }, { mock: "noQtySet" }];
					new ScrollableList(mockScene, title);
					expect(buttons.createListButton).toHaveBeenCalledTimes(3);
				});
				test("no items table added if the catalogue collection is empty", () => {
					jest.clearAllMocks();
					mockGridSizer = undefined;
					collectionGetAll = [];

					new ScrollableList(mockScene, title);

					expect(mockScene.rexUI.add.gridSizer).not.toHaveBeenCalled();
				});
				test("Empty collection text added if the catalogue collection is empty", () => {
					jest.clearAllMocks();
					mockGridSizer = undefined;
					collectionGetAll = [];

					new ScrollableList(mockScene, title);

					expect(text.addText).toHaveBeenCalledWith(mockScene, 0, 0, "No items", undefined);
				});
				test("Empty collection custom text is set if defined in config", () => {
					jest.clearAllMocks();
					mockGridSizer = undefined;
					collectionGetAll = [];
					const expectedEmptyText = "Your bags are empty";
					mockScene.config.emptyList = {
						shop: {
							value: expectedEmptyText,
						},
					};

					new ScrollableList(mockScene, title);

					expect(text.addText).toHaveBeenCalledWith(
						mockScene,
						0,
						0,
						expectedEmptyText,
						mockScene.config.emptyList.shop,
					);
				});
				test("Empty collection text position is set if offset is defined in config", () => {
					jest.clearAllMocks();
					mockGridSizer = undefined;
					collectionGetAll = [];
					mockScene.config.emptyList = {
						shop: {
							position: {
								offsetX: 100,
								offsetY: -100,
							},
						},
					};

					new ScrollableList(mockScene, title);

					expect(mockText.setPosition).toHaveBeenCalledWith(100, -100);
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

				beforeEach(() => {
					callback = buttons.createListButton.mock.calls[0][3];
				});
				afterEach(() => {
					jest.clearAllMocks();
				});
				test("creates a confirm pane", () => {
					callback(mockPointer);
					expect(mockScene.transientData.shop.mode).toBe("shop");
					expect(mockScene.transientData.shop.item).toBe(mockItem);
					expect(mockScene.scene.pause).toHaveBeenCalled();
					expect(mockScene.addOverlay).toHaveBeenCalledWith("shop-confirm");
				});
				test("don't fire if the label is scrolled off the panel", () => {
					mockScrollablePanel.isInTouching = jest.fn(() => false);
					callback(mockPointer);
					expect(mockScene.addOverlay).not.toHaveBeenCalledWith("shop-confirm");
				});
				test("don't fire if the item is locked", () => {
					mockItem.state = "locked";
					callback(mockPointer);
					expect(mockScene.addOverlay).not.toHaveBeenCalledWith("shop-confirm");
				});
				test("show confirm if the label is fired by keydown event", () => {
					mockPointer.screen.input.keyboard.prevType = "keydown";
					callback(mockPointer);
					expect(mockScene.addOverlay).toHaveBeenCalledWith("shop-confirm");
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
	});

	describe("event setup", () => {
		describe("resizing", () => {
			beforeEach(() => {
				jest.spyOn(fp, "debounce").mockImplementation((value, callback) => callback);
				new ScrollableList(mockScene);
				mockScene.scale.on.mock.calls[0][1]();
			});
			test("calls layout on the panel", () => {
				expect(mockScrollablePanel.layout).toHaveBeenCalledTimes(1);
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
				handlers.updatePanelOnFocus.mockImplementation(() => onFocusSpy);
				handlers.updatePanelOnWheel.mockImplementation(() => onWheelSpy);
				new ScrollableList(mockScene);
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
				expect(mockScene.input.on.mock.calls[1][0]).toBe("gameobjectwheel");
				mockScene.input.on.mock.calls[1][1]();
				expect(onWheelSpy).toHaveBeenCalled();
			});
			test("adds a scroll listener", () => {
				expect(mockScrollablePanel.on).toHaveBeenCalledWith("scroll", expect.any(Function));
			});
			test("scroll listener disables icons while panel scroller is in the dragged state", () => {
				mockScrollablePanel.childrenMap.scroller.state = "DRAG";
				mockScrollablePanel.on.mock.calls[0][1]();
				expect(mockLabel.childrenMap.icon.disableInteractive).toHaveBeenCalled();
			});
			test("scroll listener enables icons while panel scroller is not in the dragged state", () => {
				mockScrollablePanel.on.mock.calls[0][1]();
				expect(mockLabel.childrenMap.icon.setInteractive).toHaveBeenCalled();
			});
			test("adds a pointerup listener", () => {
				expect(mockScene.input.on).toHaveBeenCalledWith("pointerup", expect.any(Function));
			});
			test("pointerup listener enables icons while panel scroller is in the dragged state", () => {
				mockScrollablePanel.childrenMap.scroller.state = "DRAG";
				mockScene.input.on.mock.calls[0][1]();
				expect(mockLabel.childrenMap.icon.setInteractive).toHaveBeenCalled();
			});
			test("pointerup listener does not enable icons while panel scroller is not in the dragged state", () => {
				mockScene.input.on.mock.calls[0][1]();
				expect(mockLabel.childrenMap.icon.setInteractive).not.toHaveBeenCalled();
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
		describe("panel", () => {
			test("event listener is not created when collection is empty", () => {
				collectionGetAll = [];
				new ScrollableList(mockScene);
				expect(mockA11yElem.addEventListener).not.toHaveBeenCalled();
			});
		});
	});
	describe("Accessibility setup", () => {
		beforeEach(() => {
			new ScrollableList(mockScene);
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

		test("reset method calls resizeBackground", () => {
			list.reset();
			expect(backgroundsModule.resizeBackground).toHaveBeenCalled();
		});
		test("reset method calls resizeCovers", () => {
			list.reset();
			expect(coversModule.resizeCovers).toHaveBeenCalled();
		});

		test("reset method calls resizeBackground when collection is empty", () => {
			jest.clearAllMocks();
			collectionGetAll = [];
			list = new ScrollableList(mockScene, title);
			list.reset();
			expect(backgroundsModule.resizeBackground).toHaveBeenCalled();
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
		const filterFn = jest.fn(() => true);

		beforeEach(() => new ScrollableList(mockScene, "title", filterFn));

		test("if a filter function is passed to the list, it is run against the collection", () => {
			expect(filterFn).toHaveBeenCalledTimes(1);
		});
	});
});
