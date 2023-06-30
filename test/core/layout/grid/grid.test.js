/**
 * @copyright BBC 2019
 * @author BBC Children's D+E
 * @license Apache-2.0
 */
import { accessibilify } from "../../../../src/core/accessibility/accessibilify.js";
import { collections } from "../../../../src/core/collections.js";
import { GelGrid } from "../../../../src/core/layout/grid/grid.js";
import * as Cell from "../../../../src/core/layout/grid/cell.js";
import * as gmiModule from "../../../../src/core/gmi/gmi.js";
import * as ScalerModule from "../../../../src/core/scaler.js";

jest.mock("../../../../src/core/accessibility/accessibilify.js");
jest.mock("../../../../src/core/collections.js");

describe("Grid", () => {
	let mockScene;
	let mockMetrics;
	let mockRoot;
	let mockPhaserGroup;
	let mockSprite;
	let grid;
	let mockSafeArea;
	let desktopCellPadding;
	let transitionCallback;
	let collectionGetAll;
	let mockCollection;
	let mockItem;

	beforeEach(() => {
		mockSprite = {
			width: 2,
			height: 1,
		};
		transitionCallback = () => {};

		mockSafeArea = {
			left: -300,
			top: -300,
			width: 600,
			height: 600,
		};

		mockScene = {
			layout: {
				getSafeArea: jest.fn(() => mockSafeArea),
			},
			theme: {},
			scene: {
				key: "item-select",
			},
			time: {
				addEvent: jest.fn(({ callback, callbackScope, args }) => {
					transitionCallback = (pageNumber = args) => {
						callback.apply(callbackScope, pageNumber);
					};
				}),
			},
			add: {
				gelButton: jest.fn((x, y, config) => ({
					visible: false,
					input: { enabled: false },
					x: 50,
					y: 50,
					scaleY: 1,
					scaleX: 1,
					setSize: function (width, height) {
						this.width = width;
						this.height = height;
					},
					setDisplaySize: function (width, height) {
						this.displayWidth = width;
						this.displayHeight = height;
					},
					on: jest.fn(),
					sprite: mockSprite,
					config: {
						gameButton: false,
						id: config.id,
						title: config.title,
					},
					accessibleElement: {
						update: jest.fn(),
					},
				})),
			},
			input: { enabled: false },
			sys: {
				queueDepthSort: () => {},
				anims: {
					once: jest.fn(),
				},
			},
		};
		mockMetrics = {
			verticalBorderPad: 100,
			horizontalBorderPad: 100,
			buttonPad: 50,
			horizontals: { left: -1000, center: 0, right: 1000 },
			safeHorizontals: { left: -300, center: 0, right: 300 },
			verticals: { top: -1500, middle: 0, bottom: 1500 },
			scale: 1,
			screenToCanvas: jest.fn(n => n),
		};

		ScalerModule.getMetrics = jest.fn(() => mockMetrics);

		desktopCellPadding = 24;

		mockRoot = {
			add: jest.fn(),
			destroy: jest.fn(),
		};

		mockPhaserGroup = { destroy: jest.fn() };
		global.Phaser.Group = jest.fn(() => mockPhaserGroup);
		global.Phaser.GameObjects.Container = jest.fn(() => mockRoot);

		accessibilify.mockImplementation(() => {});

		GelGrid.prototype.list = [];
		GelGrid.prototype.add = jest.fn(child => {
			grid.list.push(child);
		});

		gmiModule.gmi = {
			getAllSettings: jest.fn(() => ({})),
		};

		mockItem = {
			id: "id",
			key: "key",
			title: "title",
			ariaLabel: "description",
		};
		collectionGetAll = [mockItem];
		mockCollection = { getAll: jest.fn(() => collectionGetAll), get: () => mockCollection };
		collections.get = jest.fn(() => mockCollection);
	});

	afterEach(() => jest.clearAllMocks());

	describe("adding cells", () => {
		test("adds multiple cells to the grid from theme config", () => {
			const mockChoices = [
				{ asset: "asset_name_1", id: "asset_id_1" },
				{ asset: "asset_name_2", id: "asset_id_2" },
				{ asset: "asset_name_3", id: "asset_id_3" },
			];

			grid = new GelGrid(mockScene);
			grid.addGridCells(mockChoices);

			expect(grid.add).toHaveBeenCalledTimes(3);
			expect(mockScene.add.gelButton).toHaveBeenCalledTimes(3);
		});

		test("cells are created with correct params", () => {
			jest.spyOn(Cell, "createCell");
			const mockChoices = [{ asset: "asset_name_1" }, { asset: "asset_name_2" }, { asset: "asset_name_3" }];

			grid = new GelGrid(mockScene);
			grid.addGridCells(mockChoices);

			expect(Cell.createCell).toHaveBeenCalledWith(grid, mockChoices[0], 0, grid._config);
			expect(Cell.createCell).toHaveBeenCalledWith(grid, mockChoices[1], 1, grid._config);
			expect(Cell.createCell).toHaveBeenCalledWith(grid, mockChoices[2], 2, grid._config);
		});

		test("cell is added with key from config data", () => {
			const mockChoices = [{ key: "asset_name_1", id: "asset_id_1" }];

			const expectedConfig = {
				key: mockChoices[0].key,
			};
			grid = new GelGrid(mockScene);
			grid.addGridCells(mockChoices);

			const resultParams = mockScene.add.gelButton.mock.calls[0];
			expect(resultParams[2]).toEqual(expect.objectContaining(expectedConfig));
		});

		test("multiple gel buttons are created", () => {
			const mockChoices = [{ asset: "asset_name_1", title: "asset title 1" }];

			grid = new GelGrid(mockScene);
			grid.addGridCells(mockChoices);

			const actualParams = mockScene.add.gelButton.mock.calls[0];
			expect(actualParams[0]).toBe(0);
		});

		test("returns ids for multiple cells", () => {
			const mockChoices = [{ id: "asset_name_1" }, { id: "asset_name_2" }, { id: "asset_name_3" }];
			const expectedIds = ["asset_name_1", "asset_name_2", "asset_name_3"];
			grid = new GelGrid(mockScene);
			grid.addGridCells(mockChoices);
			expect(grid.cellIds()).toEqual(expectedIds);
		});

		test("returns choices for multiple cells", () => {
			const mockChoices = [
				{ id: "asset_name_1", title: "Asset Ttile 1" },
				{ id: "asset_name_2", title: "Asset Ttile 2" },
			];
			const expectedChoices = [
				{ id: "asset_name_1", title: "Asset Ttile 1" },
				{ id: "asset_name_2", title: "Asset Ttile 2" },
			];
			grid = new GelGrid(mockScene);
			grid.addGridCells(mockChoices);
			expect(grid.choices()).toEqual(expectedChoices);
		});

		describe("accessibility", () => {
			test("adds each cell to accessibility", () => {
				const mockChoices = [{ asset: "asset_name_1" }, { asset: "asset_name_2" }];

				grid = new GelGrid(mockScene);
				grid.addGridCells(mockChoices);

				expect(accessibilify).toHaveBeenCalledTimes(2);
			});

			test("calls cell reset method when making the screen accessible", () => {
				grid = new GelGrid(mockScene);
				grid.addGridCells([{ asset: "asset_name" }]);
				grid._cells.forEach(cell => (cell.reset = jest.fn()));
				grid.makeAccessible();
				grid._cells.forEach(cell => expect(cell.reset).toHaveBeenCalledTimes(1));
			});
		});
	});

	describe("grid contents", () => {
		test("first grid cell is visible", () => {
			const mockChoices = [{ asset: "asset_name_1" }, { asset: "asset_name_2" }, { asset: "asset_name_3" }];

			grid = new GelGrid(mockScene);
			const resultCells = grid.addGridCells(mockChoices);

			expect(resultCells[0].button.visible).toBe(true);
		});

		test("subsequent grid cells are not visible", () => {
			const mockChoices = [{ asset: "asset_name_1" }, { asset: "asset_name_2" }, { asset: "asset_name_3" }];

			grid = new GelGrid(mockScene);
			const resultCells = grid.addGridCells(mockChoices);

			expect(resultCells[1].button.visible).toBe(false);
			expect(resultCells[2].button.visible).toBe(false);
		});

		test("first two cells are visible when `columns = 2` in config", () => {
			const mockChoices = [{ asset: "asset_name_1" }, { asset: "asset_name_2" }];
			mockScene.theme.columns = 2;

			grid = new GelGrid(mockScene, mockScene.theme);
			const resultCells = grid.addGridCells(mockChoices);

			expect(resultCells[0].button.visible).toBe(true);
			expect(resultCells[1].button.visible).toBe(true);
		});

		test("first two cells are visible when `rows = 2` in config", () => {
			const mockChoices = [{ asset: "asset_name_1" }, { asset: "asset_name_2" }];
			mockScene.theme.rows = 2;

			grid = new GelGrid(mockScene, mockScene.theme);
			const resultCells = grid.addGridCells(mockChoices);

			expect(resultCells[0].button.visible).toBe(true);
			expect(resultCells[1].button.visible).toBe(true);
		});

		test("additional cells are not visible when `columns < choices` in config", () => {
			const mockChoices = [
				{ asset: "asset_name_1" },
				{ asset: "asset_name_2" },
				{ asset: "asset_name_3" },
				{ asset: "asset_name_4" },
			];
			mockScene.theme.columns = 2;

			grid = new GelGrid(mockScene, mockScene.theme);
			const resultCells = grid.addGridCells(mockChoices);

			expect(resultCells[2].button.visible).toBe(false);
			expect(resultCells[3].button.visible).toBe(false);
		});

		test("only the first 4 cells are visible when `columns > 4` in config", () => {
			const mockChoices = [
				{ asset: "asset_name_0" },
				{ asset: "asset_name_1" },
				{ asset: "asset_name_2" },
				{ asset: "asset_name_3" },
				{ asset: "asset_name_4" },
			];
			mockScene.theme.columns = 5;

			grid = new GelGrid(mockScene, mockScene.theme);
			const resultCells = grid.addGridCells(mockChoices);

			expect(resultCells[0].button.visible).toBe(true);
			expect(resultCells[1].button.visible).toBe(true);
			expect(resultCells[2].button.visible).toBe(true);
			expect(resultCells[3].button.visible).toBe(true);
			expect(resultCells[4].button.visible).toBe(false);
		});

		test("first four cells are visible when `columns = 2` and `rows = 2`", () => {
			const mockChoices = [
				{ asset: "asset_name_1" },
				{ asset: "asset_name_2" },
				{ asset: "asset_name_3" },
				{ asset: "asset_name_4" },
			];
			mockScene.theme.columns = 2;
			mockScene.theme.rows = 2;

			grid = new GelGrid(mockScene, mockScene.theme);
			const resultCells = grid.addGridCells(mockChoices);

			expect(resultCells[0].button.visible).toBe(true);
			expect(resultCells[1].button.visible).toBe(true);
			expect(resultCells[2].button.visible).toBe(true);
			expect(resultCells[3].button.visible).toBe(true);
		});

		test("additional cells are not visible when `columns = 2` and `rows = 2`", () => {
			const mockChoices = [
				{ asset: "asset_name_0" },
				{ asset: "asset_name_1" },
				{ asset: "asset_name_2" },
				{ asset: "asset_name_3" },
				{ asset: "asset_name_4" },
				{ asset: "asset_name_5" },
			];
			mockScene.theme.columns = 2;
			mockScene.theme.rows = 2;

			grid = new GelGrid(mockScene, mockScene.theme);
			const resultCells = grid.addGridCells(mockChoices);

			expect(resultCells[4].button.visible).toBe(false);
			expect(resultCells[5].button.visible).toBe(false);
		});

		test("first six cells are visible when `columns = 3` and `rows = 2`", () => {
			const mockChoices = [
				{ asset: "asset_name_0" },
				{ asset: "asset_name_1" },
				{ asset: "asset_name_2" },
				{ asset: "asset_name_3" },
				{ asset: "asset_name_4" },
				{ asset: "asset_name_5" },
				{ asset: "asset_name_6" },
				{ asset: "asset_name_7" },
			];
			mockScene.theme.columns = 3;
			mockScene.theme.rows = 2;

			grid = new GelGrid(mockScene, mockScene.theme);
			const resultCells = grid.addGridCells(mockChoices);

			expect(resultCells[0].button.visible).toBe(true);
			expect(resultCells[1].button.visible).toBe(true);
			expect(resultCells[2].button.visible).toBe(true);
			expect(resultCells[3].button.visible).toBe(true);
			expect(resultCells[4].button.visible).toBe(true);
			expect(resultCells[5].button.visible).toBe(true);
			expect(resultCells[6].button.visible).toBe(false);
			expect(resultCells[7].button.visible).toBe(false);
		});

		test("empty choices do not get added as cells", () => {
			const mockChoices = [{ asset: "asset_name_0" }, { asset: "asset_name_1" }];
			mockScene.theme.columns = 3;

			grid = new GelGrid(mockScene, mockScene.theme);
			const resultCells = grid.addGridCells(mockChoices);

			expect(resultCells[0]).toBeTruthy();
			expect(resultCells[1]).toBeTruthy();
			expect(resultCells[2]).toBeFalsy();
		});
	});

	describe("grid cell positions", () => {
		test("single cell is added at the centre of the safe area", () => {
			const mockChoices = [{ asset: "asset_name_0" }];

			grid = new GelGrid(mockScene);
			const resultCells = grid.addGridCells(mockChoices);

			expect(resultCells[0].button.x).toEqual(0);
			expect(resultCells[0].button.y).toEqual(0);
		});

		test("2 cells are aligned to the centre in a 2 column layout", () => {
			const mockChoices = [{ asset: "asset_name_0" }, { asset: "asset_name_1" }];
			mockScene.theme.columns = 2;
			mockSafeArea.left = -400;
			mockSafeArea.top = -300;
			mockSafeArea.width = 700;
			mockSafeArea.height = 700;

			grid = new GelGrid(mockScene, mockScene.theme);
			const resultCells = grid.addGridCells(mockChoices);

			const expectedPositions = [
				{ x: -resultCells[0].button.displayWidth / 2 - 12 },
				{ x: resultCells[1].button.displayWidth / 2 + 12 },
			];

			expect(resultCells[0].button.x).toEqual(expectedPositions[0].x);
			expect(resultCells[1].button.x).toEqual(expectedPositions[1].x);
		});

		test("3 cells are aligned in a 3 column layout", () => {
			const mockChoices = [{ asset: "asset_name_0" }, { asset: "asset_name_1" }, { asset: "asset_name_2" }];
			mockScene.theme.columns = 3;
			mockSafeArea.left = -300;
			mockSafeArea.top = -200;
			mockSafeArea.width = 600;
			mockSafeArea.height = 400;

			grid = new GelGrid(mockScene, mockScene.theme);
			const resultCells = grid.addGridCells(mockChoices);

			const expectedPositions = [
				{
					x: mockSafeArea.left + 92,
					y: 0,
				},
				{
					x: mockSafeArea.left + 184 + desktopCellPadding + 92,
					y: 0,
				},
				{
					x: mockSafeArea.left + 184 + desktopCellPadding + 92 + desktopCellPadding,
					y: 0,
				},
			];

			expect(resultCells[0].button.x).toEqual(expectedPositions[0].x);
			expect(resultCells[1].button.x).toEqual(expectedPositions[1].x);
		});

		test("2 cells are aligned in a 1 column, 2 row layout", () => {
			const mockChoices = [{ key: "asset_name_0" }, { key: "asset_name_1" }];
			mockScene.theme.rows = 2;
			mockSafeArea.top = -200;
			mockSafeArea.left = -200;
			mockSafeArea.width = 400;
			mockSafeArea.height = 400;

			grid = new GelGrid(mockScene, mockScene.theme);
			const resultCells = grid.addGridCells(mockChoices);

			const expectedPositions = [
				{
					x: 0,
					y: mockSafeArea.top + 94,
				},
				{
					x: 0,
					y: mockSafeArea.top + 188 + desktopCellPadding + 94,
				},
			];

			expect(resultCells[0].button.y).toEqual(expectedPositions[0].y);
			expect(resultCells[1].button.y).toEqual(expectedPositions[1].y);
			expect(resultCells[0].button.x).toEqual(expectedPositions[0].x);
			expect(resultCells[1].button.x).toEqual(expectedPositions[1].x); //expected 0 received 400
		});

		test("wide aspect ratio assets are vertically spaced in 2 row layout", () => {
			mockSprite = {
				width: 600,
				height: 100,
			};
			const mockChoices = [{ key: "asset_name_0" }, { key: "asset_name_1" }];
			mockScene.theme.rows = 2;
			mockSafeArea.top = -200;
			mockSafeArea.left = -300;
			mockSafeArea.width = 600;
			mockSafeArea.height = 400;

			grid = new GelGrid(mockScene, mockScene.theme);
			const resultCells = grid.addGridCells(mockChoices);

			const expectedPositions = [
				{
					x: 0,
					y: -mockSprite.height / 2 - desktopCellPadding / 2,
				},
				{
					x: 0,
					y: mockSprite.height / 2 + desktopCellPadding / 2,
				},
			];

			expect(resultCells[0].button.y).toEqual(expectedPositions[0].y);
			expect(resultCells[1].button.y).toEqual(expectedPositions[1].y);
		});

		test("resize method sets cell positions", () => {
			const mockChoices = [{ asset: "asset_name_0" }, { asset: "asset_name_1" }];
			mockScene.theme.columns = 2;
			const resizedSafeArea = {
				left: -800,
				top: -600,
				width: 1600,
				height: 1200,
			};

			grid = new GelGrid(mockScene, mockScene.theme);
			grid.addGridCells(mockChoices);
			grid.resize(resizedSafeArea);

			const expectedPositions = [
				{
					x: -406,
					y: 0,
				},
				{
					x: 406,
					y: 0,
				},
			];

			expect(grid._cells[0].button.x).toEqual(expectedPositions[0].x);
			expect(grid._cells[1].button.x).toEqual(expectedPositions[1].x);
		});

		test("resize method sets correct cell positions when mobile", () => {
			const mockChoices = [{ asset: "asset_name_0" }, { asset: "asset_name_1" }];
			mockScene.theme.columns = 2;
			mockMetrics.isMobile = true;
			const resizedSafeArea = {
				left: -800,
				top: -600,
				width: 1600,
				height: 1200,
			};

			grid = new GelGrid(mockScene, mockScene.theme);
			grid.addGridCells(mockChoices);
			grid.resize(resizedSafeArea);

			const expectedPositions = [
				{
					x: -404,
					y: 0,
				},
				{
					x: 404,
					y: 0,
				},
			];

			expect(grid._cells[0].button.x).toEqual(expectedPositions[0].x);
			expect(grid._cells[1].button.x).toEqual(expectedPositions[1].x);
		});

		test("remainder of 2 cells in a 3 column layout are centre justified", () => {
			const mockChoices = [{ asset: "asset_name_0" }, { asset: "asset_name_1" }];
			mockScene.theme.columns = 3;

			const expectedPositions = [
				{
					x: -104,
				},
				{
					x: 104,
				},
			];

			grid = new GelGrid(mockScene, mockScene.theme);
			const resultCells = grid.addGridCells(mockChoices);

			// expect(resultCells[0].x).toEqual(expectedPositions[0].x);
			expect(resultCells[1].button.x).toEqual(expectedPositions[1].x);
		});

		test("remainder of 2 cells in a 3 column layout are left justified from config", () => {
			const mockChoices = [{ asset: "asset_name_0" }, { asset: "asset_name_1" }];
			mockScene.theme.columns = 3;
			mockScene.theme.align = "left";

			const expectedPositions = [
				{
					x: -208,
				},
				{
					x: 0,
				},
			];

			grid = new GelGrid(mockScene, mockScene.theme);
			const resultCells = grid.addGridCells(mockChoices);

			expect(resultCells[0].button.x).toEqual(expectedPositions[0].x);
			expect(resultCells[1].button.x).toEqual(expectedPositions[1].x);
		});

		test("remainder of 2 cells in a 3 column layout are right justified from config", () => {
			const mockChoices = [{ asset: "asset_name_0" }, { asset: "asset_name_1" }];
			mockScene.theme.columns = 3;
			mockScene.theme.align = "right";

			const expectedPositions = [
				{
					x: 0,
				},
				{
					x: 208,
				},
			];

			grid = new GelGrid(mockScene, mockScene.theme);
			const resultCells = grid.addGridCells(mockChoices);

			expect(resultCells[0].button.x).toEqual(expectedPositions[0].x);
			expect(resultCells[1].button.x).toEqual(expectedPositions[1].x);
		});
	});

	describe("resize method", () => {
		test("stores safeArea on class", () => {
			grid = new GelGrid(mockScene, { rows: 1, columns: 3 });
			grid.resize(mockSafeArea);
			expect(grid._safeArea).toBe(mockSafeArea);
		});

		test("sets correct cellpadding when desktop mode", () => {
			mockMetrics.isMobile = false;
			grid = new GelGrid(mockScene, { rows: 1, columns: 3 });
			grid.resize(mockSafeArea);
			expect(grid._cellPadding).toBe(24);
		});

		test("sets correct cellpadding when mobile mode", () => {
			mockMetrics.isMobile = true;
			grid = new GelGrid(mockScene, { rows: 1, columns: 3 });
			grid.resize(mockSafeArea);
			expect(grid._cellPadding).toBe(16);
		});

		test("resets grid", () => {
			grid = new GelGrid(mockScene, { rows: 1, columns: 3 });
			grid.reset = jest.fn();
			grid.resize(mockSafeArea);
			expect(grid.reset).toHaveBeenCalled();
		});
	});

	describe("cell sprite sizes", () => {
		test("square cell sprite is scaled to fit into portrait aspect cell", () => {
			mockSprite = {
				width: 200,
				height: 200,
			};
			const mockChoices = [{ asset: "asset_name_0" }, { asset: "asset_name_1" }, { asset: "asset_name_1" }];
			grid = new GelGrid(mockScene, { rows: 1, columns: 3 });
			grid.addGridCells(mockChoices);
			expect(grid._cells[0].button.displayWidth).toBe(184);
			expect(grid._cells[0].button.displayHeight).toBe(184);
		});

		test("portrait cell sprite is scaled to fit into portrait aspect cell", () => {
			mockSprite = {
				width: 200,
				height: 400,
			};
			const mockChoices = [{ asset: "asset_name_0" }, { asset: "asset_name_1" }, { asset: "asset_name_1" }];
			grid = new GelGrid(mockScene, { rows: 1, columns: 3 });
			grid.addGridCells(mockChoices);
			expect(grid._cells[0].button.displayWidth).toBe(184);
			expect(grid._cells[0].button.displayHeight).toBe(368);
		});

		test("landscape cell sprite is scaled to fit into portrait aspect cell", () => {
			mockSprite = {
				width: 400,
				height: 200,
			};
			const mockChoices = [{ asset: "asset_name_0" }, { asset: "asset_name_1" }, { asset: "asset_name_1" }];
			grid = new GelGrid(mockScene, { rows: 1, columns: 3 });
			grid.addGridCells(mockChoices);
			expect(grid._cells[0].button.displayWidth).toBe(184);
			expect(grid._cells[0].button.displayHeight).toBe(92);
		});

		test("square cell sprite is scaled to fit into landscape aspect cell", () => {
			mockSprite = {
				width: 200,
				height: 200,
			};
			const mockChoices = [{ asset: "asset_name_0" }, { asset: "asset_name_1" }];
			grid = new GelGrid(mockScene, { rows: 2, columns: 1 });
			grid.addGridCells(mockChoices);
			expect(grid._cells[0].button.displayWidth).toBe(288);
			expect(grid._cells[0].button.displayHeight).toBe(288);
		});

		test("portrait cell sprite is scaled to fit into landscape aspect cell", () => {
			mockSprite = {
				width: 200,
				height: 400,
			};
			const mockChoices = [{ asset: "asset_name_0" }, { asset: "asset_name_1" }];
			grid = new GelGrid(mockScene, { rows: 2, columns: 1 });

			grid.addGridCells(mockChoices);
			expect(grid._cells[0].button.displayWidth).toBe(144);
			expect(grid._cells[0].button.displayHeight).toBe(288);
		});

		test("landscape cell sprite is scaled to fit into landscape aspect cell", () => {
			mockSprite = {
				width: 400,
				height: 200,
			};
			const mockChoices = [{ asset: "asset_name_0" }, { asset: "asset_name_1" }];
			grid = new GelGrid(mockScene, { rows: 2, columns: 1 });

			grid.addGridCells(mockChoices);
			expect(grid._cells[0].button.displayWidth).toBe(576);
			expect(grid._cells[0].button.displayHeight).toBe(288);
		});
	});

	describe("pagination", () => {
		beforeEach(() => {
			mockScene.add.tween = jest.fn();
		});

		test("same page behaviour", () => {
			const mockChoices = [{ asset: "asset_name_1" }, { asset: "asset_name_2" }];

			grid = new GelGrid(mockScene, { rows: 1, columns: 1 });
			grid.addGridCells(mockChoices);

			grid.showPage(0);

			expect(grid.page).toBe(0);
			expect(grid._cells[0].button.visible).toEqual(true);
			expect(grid._cells[1].button.visible).toEqual(false);
		});

		describe("next page behaviour", () => {
			beforeEach(() => {
				const mockChoices = [
					{ asset: "asset_name_0" },
					{ asset: "asset_name_1" },
					{ asset: "asset_name_2" },
					{ asset: "asset_name_3" },
					{ asset: "asset_name_4" },
					{ asset: "asset_name_5" },
					{ asset: "asset_name_6" },
					{ asset: "asset_name_7" },
					{ asset: "asset_name_8" },
					{ asset: "asset_name_9" },
				];
				grid = new GelGrid(mockScene, { rows: 2, columns: 2 });
				grid.addGridCells(mockChoices);
			});

			test("sets visibility of cells after paginating", () => {
				const mockChoices = [{ asset: "asset_name_1" }, { asset: "asset_name_2" }];

				grid = new GelGrid(mockScene);
				grid.addGridCells(mockChoices);

				grid.showPage(1);
				transitionCallback();

				expect(grid._cells[0].button.visible).toEqual(false);
				expect(grid._cells[1].button.visible).toEqual(true);
			});

			test("sets tabbable to match visibility in multi-item mode", () => {
				const mockChoices = [
					{ asset: "asset_name_1", id: "id_1" },
					{ asset: "asset_name_2", id: "id_2" },
					{ asset: "asset_name_3", id: "id_3" },
					{ asset: "asset_name_4", id: "id_4" },
				];

				grid = new GelGrid(mockScene);
				grid.addGridCells(mockChoices);
				grid.cellsPerPage = 2;

				grid.showPage(1);
				transitionCallback();

				expect(grid._cells[0].button.config.tabbable).toEqual(false);
				expect(grid._cells[1].button.config.tabbable).toEqual(false);
				expect(grid._cells[2].button.config.tabbable).toEqual(true);
				expect(grid._cells[3].button.config.tabbable).toEqual(true);
			});

			test("does not set cell tabbable in single-item mode", () => {
				const mockChoices = [
					{ asset: "asset_name_1", id: "id_1" },
					{ asset: "asset_name_2", id: "id_2" },
					{ asset: "asset_name_3", id: "id_3" },
					{ asset: "asset_name_4", id: "id_4" },
				];

				grid = new GelGrid(mockScene);
				grid.addGridCells(mockChoices);
				grid.cellsPerPage = 1;

				grid.showPage(1);
				transitionCallback();

				expect(grid._cells[0].button.config.tabbable).not.toBeDefined();
				expect(grid._cells[1].button.config.tabbable).not.toBeDefined();
				expect(grid._cells[2].button.config.tabbable).not.toBeDefined();
				expect(grid._cells[3].button.config.tabbable).not.toBeDefined();
			});

			test("transition callback does not set page visibility when pageToDisable is the visible page", () => {
				const mockChoices = [
					{ asset: "asset_name_1", id: "id_1" },
					{ asset: "asset_name_2", id: "id_2" },
					{ asset: "asset_name_3", id: "id_3" },
					{ asset: "asset_name_4", id: "id_4" },
				];

				grid = new GelGrid(mockScene);
				grid.addGridCells(mockChoices);

				grid.showPage(1);
				const transitionArgsList = [1];
				transitionCallback(transitionArgsList);

				expect(grid._cells[0].button.visible).toEqual(true);
				expect(grid._cells[1].button.visible).toEqual(true);
				expect(grid._cells[2].button.visible).toEqual(false);
				expect(grid._cells[3].button.visible).toEqual(false);
			});
		});

		describe("previous page behaviour", () => {
			beforeEach(() => {
				const mockChoices = [
					{ key: "asset_name_0" },
					{ key: "asset_name_1" },
					{ key: "asset_name_2" },
					{ key: "asset_name_3" },
					{ key: "asset_name_4" },
					{ key: "asset_name_5" },
					{ key: "asset_name_6" },
					{ key: "asset_name_7" },
					{ key: "asset_name_8" },
					{ key: "asset_name_9" },
				];
				grid = new GelGrid(mockScene, { rows: 2, columns: 2 });
				grid.addGridCells(mockChoices);
			});

			test("tweens all the cells on this and the previous page", () => {
				grid.page = 1;
				grid.showPage(0);
				expect(mockScene.add.tween).toHaveBeenCalledTimes(8);
			});
		});

		test("get page for a given cell", () => {
			const mockChoices = [
				{ id: "asset_name_1", title: "Asset Ttile 1" },
				{ id: "asset_name_2", title: "Asset Ttile 2" },
			];
			const expectedPage = 0;
			grid = new GelGrid(mockScene, mockScene.theme);
			grid.addGridCells(mockChoices);
			expect(grid.getCellPage(mockChoices, "asset_name_1")).toEqual(expectedPage);
		});

		test("get page for a given cell on the second page", () => {
			const mockChoices = [
				{ id: "asset_name_1", title: "Asset Ttile 1" },
				{ id: "asset_name_2", title: "Asset Ttile 2" },
			];
			const expectedPage = 1;
			grid = new GelGrid(mockScene, mockScene.theme);
			grid.addGridCells(mockChoices);
			expect(grid.getCellPage(mockChoices, "asset_name_2")).toEqual(expectedPage);
		});

		test("get page for a given cell when multiple cells per page", () => {
			const mockChoices = [
				{ id: "asset_name_1", title: "Asset Ttile 1" },
				{ id: "asset_name_2", title: "Asset Ttile 2" },
				{ id: "asset_name_3", title: "Asset Ttile 3" },
				{ id: "asset_name_4", title: "Asset Ttile 4" },
			];
			const expectedPage = 1;
			mockScene.theme.rows = 2;
			grid = new GelGrid(mockScene, mockScene.theme);
			grid.addGridCells(mockChoices);
			expect(grid.getCellPage(mockChoices, "asset_name_3")).toEqual(expectedPage);
		});

		describe("looping behaviour when single item is showing", () => {
			beforeEach(() => {
				const mockChoices = [
					{ asset: "asset_name_1", id: "id_1" },
					{ asset: "asset_name_2", id: "id_2" },
					{ asset: "asset_name_3", id: "id_3" },
				];
				grid = new GelGrid(mockScene, { rows: 1, columns: 1 });
				grid.addGridCells(mockChoices);
			});

			test("tweens backwards when on the first page looping to the last", () => {
				grid.page = 0;
				grid.showPage(2);
				const tweenCalls = mockScene.add.tween.mock.calls;
				expect(tweenCalls[0][0].x).toEqual({ from: -600, to: 0 });
				expect(tweenCalls[1][0].x).toEqual({ from: 0, to: 600 });
			});

			test("tweens forwards when on the last page looping to the first", () => {
				grid.page = 2;
				grid.showPage(0);
				const tweenCalls = mockScene.add.tween.mock.calls;
				expect(tweenCalls[0][0].x).toEqual({ from: 600, to: 0 });
				expect(tweenCalls[1][0].x).toEqual({ from: 0, to: -600 });
			});

			test("Does nothing if only one page exists", () => {
				grid.page = 0;
				grid.showPage(0);
				expect(mockScene.add.tween).not.toHaveBeenCalled();
			});
		});

		describe("looping behaviour when multiple items are showing", () => {
			beforeEach(() => {
				const mockChoices = [
					{ asset: "asset_name_1", id: "id_1" },
					{ asset: "asset_name_2", id: "id_2" },
					{ asset: "asset_name_3", id: "id_3" },
					{ asset: "asset_name_4", id: "id_4" },
					{ asset: "asset_name_5", id: "id_5" },
					{ asset: "asset_name_6", id: "id_6" },
					{ asset: "asset_name_7", id: "id_7" },
					{ asset: "asset_name_8", id: "id_8" },
				];
				grid = new GelGrid(mockScene, { rows: 2, columns: 3 });
				grid.addGridCells(mockChoices);
			});

			test("still tweens forwards when on the first page moving forward to the next", () => {
				grid.page = 0;
				grid.showPage(-1);
				const tweenCalls = mockScene.add.tween.mock.calls;
				expect(tweenCalls[0][0].x).toEqual({ from: -704, to: -104 });
				expect(tweenCalls[1][0].x).toEqual({ from: -496, to: 104 });
				expect(tweenCalls[2][0].x).toEqual({ from: -208, to: 392 });
				expect(tweenCalls[3][0].x).toEqual({ from: 0, to: 600 });
				expect(tweenCalls[4][0].x).toEqual({ from: 208, to: 808 });
				expect(tweenCalls[5][0].x).toEqual({ from: -208, to: 392 });
				expect(tweenCalls[6][0].x).toEqual({ from: 0, to: 600 });
				expect(tweenCalls[7][0].x).toEqual({ from: 208, to: 808 });
			});
		});

		test("page names are returned correctly", () => {
			const mockChoices = [{ id: "asset_id_0", key: "asset_name_0" }, { key: "asset_name_1" }];
			grid = new GelGrid(mockScene);
			grid.addGridCells(mockChoices);
			const result = grid.getCurrentPageId();
			expect(result).toEqual("asset_id_0");
		});

		test("page title and IDs are returned correctly", () => {
			const mockChoices = [
				{ title: "asset_name_0", id: "asset0" },
				{ title: "asset_name_1", id: "asset1" },
			];
			grid = new GelGrid(mockScene);
			grid.addGridCells(mockChoices);
			grid.page = 1;
			const result = grid.getCurrentSelection();
			expect(result).toEqual({ title: "asset_name_1", id: "asset1" });
		});
	});

	describe("getBoundingRect method", () => {
		test("returns the current safe area for use by layout.js debug draw methods on groups", () => {
			grid = new GelGrid(mockScene);
			expect(grid.getBoundingRect()).toEqual(mockSafeArea);
		});
	});
});
