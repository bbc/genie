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
    let vPos;
    let hPos;
    let mockRoot;
    let mockPhaserGroup;
    let grid;
    let mockGelButton;

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
        vPos = "middle";
        hPos = "center";

        mockRoot = {
            add: jest.fn(),
            destroy: jest.fn(),
        };

        mockPhaserGroup = { destroy: jest.fn() };
        global.Phaser.Group = jest.fn(() => mockPhaserGroup);
        global.Phaser.GameObjects.Container = jest.fn(() => mockRoot);

        mockGelButton = {
            x: 50,
            y: 50,
        };
        accessibilify.mockImplementation(() => {});
        jest.spyOn(GelButton, "GelButton").mockImplementation(() => mockGelButton);

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
            grid = new GelGrid(mockScene, vPos, hPos, metrics, false, false);
            grid.addCell({});

            expect(grid.addAt).toHaveBeenCalledTimes(1);
        });

        test("adds a button to the grid when adding a cell", () => {
            grid = new GelGrid(mockScene, vPos, hPos, metrics, false, false);
            grid.addCell({});

            expect(GelButton.GelButton.mock.calls.length).toEqual(1);
        });

        test("adds multiple cells to the grid from theme config", () => {
            mockScene.theme.choices = [{ asset: "asset_name_1" }, { asset: "asset_name_2" }, { asset: "asset_name_3" }];

            grid = new GelGrid(mockScene, vPos, hPos, metrics, false, false);
            grid.addGridCells();

            expect(grid.addAt).toHaveBeenCalledTimes(3);
            expect(GelButton.GelButton.mock.calls.length).toEqual(3);
        });

        test("cell is added with key from config data", () => {
            mockScene.theme.choices = [{ asset: "asset_name_1" }];

            const expectedConfig = {
                key: mockScene.theme.choices[0].asset,
            };
            grid = new GelGrid(mockScene, vPos, hPos, metrics, false, false);
            grid.addGridCells();

            const resultParams = GelButton.GelButton.mock.calls[0];
            expect(resultParams[4]).toEqual(expect.objectContaining(expectedConfig));
        });

        test("cell is added with the title from config data", () => {
            mockScene.theme.choices = [{ asset: "asset_name_1", title: "asset title 1" }];

            const expectedConfig = {
                name: "asset title 1",
            };
            grid = new GelGrid(mockScene, vPos, hPos, metrics, false, false);
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

            grid = new GelGrid(mockScene, vPos, hPos, metrics, false, false);
            grid.addGridCells();

            const actualParams = GelButton.GelButton.mock.calls[0];
            expect(actualParams[3]).toEqual(metrics);
        });

        test("gel button is centered", () => {
            mockScene.theme.choices = [{ asset: "asset_name_1", title: "asset title 1" }];

            grid = new GelGrid(mockScene, vPos, hPos, metrics, false, false);
            grid.addGridCells();

            const actualParams = GelButton.GelButton.mock.calls[0];
            expect(actualParams[1]).toBe(0);
            expect(actualParams[2]).toBe(0);
        });

        test("grid breakpoint for mobile size metrics", () => {
            metrics.isMobile = true;
            grid = new GelGrid(mockScene, vPos, hPos, metrics, false, false);
            expect(grid.gridMetrics(metrics).displayWidth).toEqual(grid._displayWidth.mobile);
            expect(grid.gridMetrics(metrics).displayHeight).toEqual(grid._displayHeight.mobile);
        });

        test("grid breakpoint for desktop size metrics", () => {
            metrics.isMobile = false;
            grid = new GelGrid(mockScene, vPos, hPos, metrics, false, false);
            expect(grid.gridMetrics(metrics).displayWidth).toEqual(grid._displayWidth.desktop);
            expect(grid.gridMetrics(metrics).displayHeight).toEqual(grid._displayHeight.desktop);
        });

        test("returns keys for multiple cells", () => {
            mockScene.theme.choices = [{ asset: "asset_name_1" }, { asset: "asset_name_2" }, { asset: "asset_name_3" }];
            const expectedKeys = ["asset_name_1", "asset_name_2", "asset_name_3"];
            grid = new GelGrid(mockScene, vPos, hPos, metrics, false, false);
            grid.addGridCells();
            expect(grid.cellKeys()).toEqual(expectedKeys);
        });

        describe("accessibility", () => {
            test("adds each cell to accessibility", () => {
                mockScene.theme.choices = [{ asset: "asset_name_1" }, { asset: "asset_name_2" }];

                grid = new GelGrid(mockScene, vPos, hPos, metrics, false, false);
                grid.addGridCells();

                expect(accessibilify).toHaveBeenCalledTimes(2);
            });
        });
    });

    describe("removing cells", () => {
        test("calls destroy on cell", () => {
            grid = new GelGrid(mockScene, vPos, hPos, metrics, false, false);
            const destroySpy = jest.fn();
            grid.removeCell({ destroy: destroySpy });

            expect(destroySpy).toHaveBeenCalled();
        });

        test("removes cell from grid", () => {
            mockScene.theme.choices = [{ asset: "asset_name_1" }, { asset: "asset_name_2" }];
            grid = new GelGrid(mockScene, vPos, hPos, metrics, false, false);
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
