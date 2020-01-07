/**
 * @copyright BBC 2019
 * @author BBC Children's D+E
 * @license Apache-2.0
 */
import { accessibilify } from "../../../src/core/accessibility/accessibilify.js";
import { GelGrid } from "../../../src/core/layout/gel-grid.js";
import * as GelButton from "../../../src/core/layout/gel-button.js";

jest.mock("../../../src/core/layout/gel-button.js");
jest.mock("../../../src/core/accessibility/accessibilify.js");

describe("Grid", () => {
    let mockScene;
    let metrics;
    let mockRoot;
    let mockPhaserGroup;
    let grid;
    let safeArea;
    let desktopCellPadding;
    let mobileCellPadding;

    beforeEach(() => {
        mockScene = {
            theme: {
                choices: [{ asset: "asset_name" }],
            },
            scene: {
                key: "item-select",
            },
            sys: {
                queueDepthSort: () => {},
                anims: {
                    once: jest.fn(),
                },
            },
        };
        metrics = {
            borderPad: 100,
            buttonPad: 50,
            horizontals: { left: -1000, center: 0, right: 1000 },
            safeHorizontals: { left: -300, center: 0, right: 300 },
            verticals: { top: -1500, middle: 0, bottom: 1500 },
            scale: 1,
        };
        safeArea = {
            top: -1000,
            bottom: 1000,
            left: -280,
            right: 280,
        };
        desktopCellPadding = 24;
        mobileCellPadding = 16;

        mockRoot = {
            add: jest.fn(),
            destroy: jest.fn(),
        };

        mockPhaserGroup = { destroy: jest.fn() };
        global.Phaser.Group = jest.fn(() => mockPhaserGroup);
        global.Phaser.GameObjects.Container = jest.fn(() => mockRoot);

        accessibilify.mockImplementation(() => {});
        jest.spyOn(GelButton, "GelButton").mockImplementation(() => ({
            x: 50,
            y: 50,
            input: { enabled: false },
        }));

        GelGrid.prototype.list = [];
        GelGrid.prototype.iterate = fn => {
            capturedIterateFunction = fn;
        };
        GelGrid.prototype.addAt = jest.fn(child => {
            grid.list.push(child);
        });
    });

    afterEach(() => jest.clearAllMocks());

    describe("adding cells", () => {
        test("add a cell to the grid", () => {
            grid = new GelGrid(mockScene, metrics, safeArea);
            grid.addCell({});

            expect(grid.addAt).toHaveBeenCalledTimes(1);
        });

        test("adds a button to the grid when adding a cell", () => {
            grid = new GelGrid(mockScene, metrics, safeArea);
            grid.addCell({});

            expect(GelButton.GelButton.mock.calls.length).toEqual(1);
        });

        test("adds multiple cells to the grid from theme config", () => {
            mockScene.theme.choices = [{ asset: "asset_name_1" }, { asset: "asset_name_2" }, { asset: "asset_name_3" }];

            grid = new GelGrid(mockScene, metrics, safeArea);
            grid.addGridCells();

            expect(grid.addAt).toHaveBeenCalledTimes(3);
            expect(GelButton.GelButton.mock.calls.length).toEqual(3);
        });

        test("cell is added with key from config data", () => {
            mockScene.theme.choices = [{ asset: "asset_name_1" }];

            const expectedConfig = {
                key: mockScene.theme.choices[0].asset,
            };
            grid = new GelGrid(mockScene, metrics, safeArea);
            grid.addGridCells();

            const resultParams = GelButton.GelButton.mock.calls[0];
            expect(resultParams[4]).toEqual(expect.objectContaining(expectedConfig));
        });

        test("cell is added with the title from config data", () => {
            mockScene.theme.choices = [{ asset: "asset_name_1", title: "asset title 1" }];

            const expectedConfig = {
                name: "asset title 1",
            };
            grid = new GelGrid(mockScene, metrics, safeArea);
            grid.addGridCells();

            const actualParams = GelButton.GelButton.mock.calls[0];
            // expect(actualParams[0]).toEqual(mockScene); // TODO - another test for these?
            // expect(actualParams[1]).toBe(0);
            // expect(actualParams[2]).toBe(0);
            // expect(actualParams[3]).toEqual(metrics);
            expect(actualParams[4]).toEqual(expect.objectContaining(expectedConfig));
        });

        test("gel button is created using metrics passed from the grid", () => {
            mockScene.theme.choices = [{ asset: "asset_name_1", title: "asset title 1" }];

            grid = new GelGrid(mockScene, metrics, safeArea);
            grid.addGridCells();

            const actualParams = GelButton.GelButton.mock.calls[0];
            expect(actualParams[3]).toEqual(metrics);
        });

        test("gel button is centered", () => {
            mockScene.theme.choices = [{ asset: "asset_name_1", title: "asset title 1" }];

            grid = new GelGrid(mockScene, metrics, safeArea);
            grid.addGridCells();

            const actualParams = GelButton.GelButton.mock.calls[0];
            expect(actualParams[1]).toBe(0);
            expect(actualParams[2]).toBe(0);
        });

        test("returns keys for multiple cells", () => {
            mockScene.theme.choices = [{ asset: "asset_name_1" }, { asset: "asset_name_2" }, { asset: "asset_name_3" }];
            const expectedKeys = ["asset_name_1", "asset_name_2", "asset_name_3"];
            grid = new GelGrid(mockScene, metrics, safeArea);
            grid.addGridCells();
            expect(grid.cellKeys()).toEqual(expectedKeys);
        });

        describe("accessibility", () => {
            test("adds each cell to accessibility", () => {
                mockScene.theme.choices = [{ asset: "asset_name_1" }, { asset: "asset_name_2" }];

                grid = new GelGrid(mockScene, metrics, safeArea);
                grid.addGridCells();

                expect(accessibilify).toHaveBeenCalledTimes(2);
            });
        });
    });

    describe("grid contents", () => {
        test("first grid cell is visible", () => {
            mockScene.theme.choices = [{ asset: "asset_name_1" }, { asset: "asset_name_2" }, { asset: "asset_name_3" }];

            grid = new GelGrid(mockScene, metrics, safeArea);
            const resultCells = grid.addGridCells();

            expect(resultCells[0].visible).toBe(true);
        });

        test("subsequent grid cells are not visible", () => {
            mockScene.theme.choices = [{ asset: "asset_name_1" }, { asset: "asset_name_2" }, { asset: "asset_name_3" }];

            grid = new GelGrid(mockScene, metrics, safeArea);
            const resultCells = grid.addGridCells();

            expect(resultCells[1].visible).toBe(false);
            expect(resultCells[2].visible).toBe(false);
        });

        test("first two cells are visible when `columns = 2` in config", () => {
            mockScene.theme.choices = [{ asset: "asset_name_1" }, { asset: "asset_name_2" }];
            mockScene.theme.columns = 2;

            grid = new GelGrid(mockScene, metrics, safeArea);
            const resultCells = grid.addGridCells();

            expect(resultCells[0].visible).toBe(true);
            expect(resultCells[1].visible).toBe(true);
        });

        test("first two cells are visible when `rows = 2` in config", () => {
            mockScene.theme.choices = [{ asset: "asset_name_1" }, { asset: "asset_name_2" }];
            mockScene.theme.rows = 2;

            grid = new GelGrid(mockScene, metrics, safeArea);
            const resultCells = grid.addGridCells();

            expect(resultCells[0].visible).toBe(true);
            expect(resultCells[1].visible).toBe(true);
        });

        test("additional cells are not visible when `columns < choices` in config", () => {
            mockScene.theme.choices = [
                { asset: "asset_name_1" },
                { asset: "asset_name_2" },
                { asset: "asset_name_3" },
                { asset: "asset_name_4" },
            ];
            mockScene.theme.columns = 2;

            grid = new GelGrid(mockScene, metrics, safeArea);
            const resultCells = grid.addGridCells();

            expect(resultCells[2].visible).toBe(false);
            expect(resultCells[3].visible).toBe(false);
        });

        test("first four cells are visible when `columns = 2` and `rows = 2`", () => {
            mockScene.theme.choices = [
                { asset: "asset_name_1" },
                { asset: "asset_name_2" },
                { asset: "asset_name_3" },
                { asset: "asset_name_4" },
            ];
            mockScene.theme.columns = 2;
            mockScene.theme.rows = 2;

            grid = new GelGrid(mockScene, metrics, safeArea);
            const resultCells = grid.addGridCells();

            expect(resultCells[0].visible).toBe(true);
            expect(resultCells[1].visible).toBe(true);
            expect(resultCells[2].visible).toBe(true);
            expect(resultCells[3].visible).toBe(true);
        });

        test("additional cells are not visible when `columns = 2` and `rows = 2`", () => {
            mockScene.theme.choices = [
                { asset: "asset_name_0" },
                { asset: "asset_name_1" },
                { asset: "asset_name_2" },
                { asset: "asset_name_3" },
                { asset: "asset_name_4" },
                { asset: "asset_name_5" },
            ];
            mockScene.theme.columns = 2;
            mockScene.theme.rows = 2;

            grid = new GelGrid(mockScene, metrics, safeArea);
            const resultCells = grid.addGridCells();

            expect(resultCells[4].visible).toBe(false);
            expect(resultCells[5].visible).toBe(false);
        });

        test("first six cells are visible when `columns = 3` and `rows = 2`", () => {
            mockScene.theme.choices = [
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

            grid = new GelGrid(mockScene, metrics, safeArea);
            const resultCells = grid.addGridCells();

            expect(resultCells[0].visible).toBe(true);
            expect(resultCells[1].visible).toBe(true);
            expect(resultCells[2].visible).toBe(true);
            expect(resultCells[3].visible).toBe(true);
            expect(resultCells[4].visible).toBe(true);
            expect(resultCells[5].visible).toBe(true);
            expect(resultCells[6].visible).toBe(false);
            expect(resultCells[7].visible).toBe(false);
        });
    });

    describe("grid cell sizes", () => {
        test("single cell has full width and height of the safe area", () => {
            mockScene.theme.choices = [{ asset: "asset_name_0" }];

            grid = new GelGrid(mockScene, metrics, safeArea);
            const resultCells = grid.addGridCells();

            expect(resultCells[0].displayWidth).toEqual(safeArea.right - safeArea.left);
            expect(resultCells[0].displayHeight).toEqual(safeArea.bottom - safeArea.top);
        });

        test("cell width when 2 columns with desktop grid padding", () => {
            mockScene.theme.choices = [{ asset: "asset_name_0" }, { asset: "asset_name_1" }];
            mockScene.theme.columns = 2;
            safeArea.left = -400;
            safeArea.right = 400;

            grid = new GelGrid(mockScene, metrics, safeArea);
            const resultCells = grid.addGridCells();

            const expectedCellWidth = (800 - 24) / 2;

            expect(resultCells[0].displayWidth).toEqual(expectedCellWidth);
        });

        test("cell width when 4 columns with desktop grid padding", () => {
            metrics.isMobile = true;
            mockScene.theme.choices = [
                { asset: "asset_name_0" },
                { asset: "asset_name_1" },
                { asset: "asset_name_2" },
                { asset: "asset_name_3" },
            ];
            mockScene.theme.columns = 4;
            safeArea.left = -400;
            safeArea.right = 400;

            grid = new GelGrid(mockScene, metrics, safeArea);
            const resultCells = grid.addGridCells();

            const expectedCellWidth = (800 - 48) / 4;

            expect(resultCells[0].displayWidth).toEqual(expectedCellWidth);
        });

        test("cell height when 2 rows with desktop grid padding", () => {
            mockScene.theme.choices = [{ asset: "asset_name_0" }, { asset: "asset_name_1" }];
            mockScene.theme.rows = 2;
            safeArea.top = -400;
            safeArea.bottom = 400;

            const expectedCellHeight = (800 - 24) / 2;

            grid = new GelGrid(mockScene, metrics, safeArea);
            const resultCells = grid.addGridCells();

            expect(resultCells[0].displayHeight).toEqual(expectedCellHeight);
        });

        test("cell width when 2 columns with mobile grid padding", () => {
            metrics.isMobile = true;
            mockScene.theme.choices = [{ asset: "asset_name_0" }, { asset: "asset_name_1" }];
            mockScene.theme.columns = 2;
            safeArea.left = -400;
            safeArea.right = 400;

            grid = new GelGrid(mockScene, metrics, safeArea);
            const resultCells = grid.addGridCells();

            const expectedCellWidth = (800 - 16) / 2;

            expect(resultCells[0].displayWidth).toEqual(expectedCellWidth);
        });

        test("cell width when 3 columns with mobile grid padding", () => {
            metrics.isMobile = true;
            mockScene.theme.choices = [{ asset: "asset_name_0" }, { asset: "asset_name_1" }, { asset: "asset_name_2" }];
            mockScene.theme.columns = 3;
            safeArea.left = -300;
            safeArea.right = 300;

            grid = new GelGrid(mockScene, metrics, safeArea);
            const resultCells = grid.addGridCells();

            const expectedCellWidth = (600 - 32) / 3;

            expect(resultCells[0].displayWidth).toEqual(expectedCellWidth);
        });

        test("cell height when 2 rows with mobile grid padding", () => {
            metrics.isMobile = true;
            mockScene.theme.choices = [{ asset: "asset_name_0" }, { asset: "asset_name_1" }];
            mockScene.theme.rows = 2;
            safeArea.top = -400;
            safeArea.bottom = 400;

            const expectedCellHeight = (800 - 16) / 2;

            grid = new GelGrid(mockScene, metrics, safeArea);
            const resultCells = grid.addGridCells();

            expect(resultCells[0].displayHeight).toEqual(expectedCellHeight);
        });
    });

    describe("grid cell positions", () => {
        test("single cell is added at the centre of the safe area", () => {
            mockScene.theme.choices = [{ asset: "asset_name_0" }];

            grid = new GelGrid(mockScene, metrics, safeArea);
            const resultCells = grid.addGridCells();

            expect(resultCells[0].x).toEqual(0);
            expect(resultCells[0].y).toEqual(0);
        });

        test("2 cells are aligned to the edges of the safe area in a 2 column layout", () => {
            mockScene.theme.choices = [{ asset: "asset_name_0" }, { asset: "asset_name_1" }];
            mockScene.theme.columns = 2;
            safeArea.left = -400;
            safeArea.right = 400;
            safeArea.top = -300;
            safeArea.bottom = 300;

            grid = new GelGrid(mockScene, metrics, safeArea);
            const resultCells = grid.addGridCells();

            const expectedPositions = [
                { x: safeArea.left + resultCells[0].displayWidth / 2 },
                { x: safeArea.right - resultCells[1].displayWidth / 2 },
            ];

            expect(resultCells[0].x).toEqual(expectedPositions[0].x);
            expect(resultCells[1].x).toEqual(expectedPositions[1].x);
        });

        test("3 cells are aligned in a 3 column layout", () => {
            mockScene.theme.choices = [{ asset: "asset_name_0" }, { asset: "asset_name_1" }, { asset: "asset_name_2" }];
            mockScene.theme.columns = 3;
            safeArea.left = -300;
            safeArea.right = 300;
            safeArea.top = -200;
            safeArea.bottom = 200;

            grid = new GelGrid(mockScene, metrics, safeArea);
            const resultCells = grid.addGridCells();

            const expectedPositions = [
                {
                    x: safeArea.left + 92,
                    y: 0,
                },
                {
                    x: safeArea.left + 184 + 24 + 92,
                    y: 0,
                },
                {
                    x: safeArea.left + 184 + 24 + 92 + 24,
                    y: 0,
                },
            ];

            expect(resultCells[0].x).toEqual(expectedPositions[0].x);
            expect(resultCells[1].x).toEqual(expectedPositions[1].x);
        });

        test("2 cells are aligned in a 1 column, 2 row layout", () => {
            mockScene.theme.choices = [{ asset: "asset_name_0" }, { asset: "asset_name_1" }];
            mockScene.theme.rows = 2;
            safeArea.top = -200;
            safeArea.bottom = 200;
            safeArea.top = -200;
            safeArea.bottom = 200;

            grid = new GelGrid(mockScene, metrics, safeArea);
            const resultCells = grid.addGridCells();

            const expectedPositions = [
                {
                    x: 0,
                    y: safeArea.top + 94,
                },
                {
                    x: 0,
                    y: safeArea.top + 188 + 24 + 94,
                },
            ];

            expect(resultCells[0].y).toEqual(expectedPositions[0].y);
            expect(resultCells[1].y).toEqual(expectedPositions[1].y);
            expect(resultCells[0].x).toEqual(expectedPositions[0].x);
            expect(resultCells[1].x).toEqual(expectedPositions[1].x);
        });
    });

    describe("removing cells", () => {
        // This functionality is not yet implemented in the module
        // it should be tested where implemented rather than using internal values (_cells)
        test("calls destroy on cell", () => {
            grid = new GelGrid(mockScene, metrics, safeArea);

            const destroySpy = jest.fn();
            grid.removeCell({ destroy: destroySpy });

            expect(destroySpy).toHaveBeenCalled();
        });

        test("removes cell from grid", () => {
            mockScene.theme.choices = [{ asset: "asset_name_1" }, { asset: "asset_name_2" }];

            grid = new GelGrid(mockScene, metrics, safeArea);
            grid.addGridCells();
            grid._cells[0].destroy = jest.fn();
            const cell0 = grid._cells[0];
            const cell1 = grid._cells[1];

            grid.removeCell(cell0);

            expect(grid._cells.length).toBe(1);
            expect(grid._cells[0]).toBe(cell1);
        });
    });
});
