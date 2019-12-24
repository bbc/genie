/**
 * @copyright BBC 2019
 * @author BBC Children's D+E
 * @license Apache-2.0
 */
import { accessibilify } from "../../../src/core/accessibility/accessibilify.js";
import { GelGrid } from "../../../src/core/layout/gel-grid.js";
import { GelButton } from "../../../src/core/layout/gel-button.js";

jest.mock("../../../src/core/layout/gel-button.js");
jest.mock("../../../src/core/accessibility/accessibilify.js");

describe("Grid", () => {
    let mockScene;
    let metrics;
    let vPos;
    let hPos;
    let mockRoot;
    let mockPhaserGroup;
    let capturedIterateFunction;
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

        mockGelButton = {};
        // accessibilify.mockImplementation(() => {});
        GelButton.mockImplementation(() => mockGelButton);

        GelGrid.prototype.addAt = jest.fn(() => {});
        GelGrid.prototype.list = [];
        GelGrid.prototype.iterate = fn => {
            capturedIterateFunction = fn;
        };
    });

    test("adds a cell to the grid", () => {
        grid = new GelGrid(mockScene, vPos, hPos, metrics, false, false);

        grid.addGridCells();
        expect(grid.addAt).toHaveBeenCalled();
    });

    test("adds multiple cells to the grid", () => {
        mockScene.theme.choices = [{ asset: "asset_name_1" }, { asset: "asset_name_2" }, { asset: "asset_name_3" }];
        grid = new GelGrid(mockScene, vPos, hPos, metrics, false, false);

        grid.addGridCells();
        expect(grid.addAt).toHaveBeenCalledTimes(3);
    });

    test("cell is added with key from config data", () => {
        mockScene.theme.choices = [{ asset: "asset_name_1" }];

        const expectedCell = {
            key: mockScene.theme.choices[0].asset,
        };
        grid = new GelGrid(mockScene, vPos, hPos, metrics, false, false);
        grid.addGridCells();
        expect(grid._cells[0]).toEqual(expect.objectContaining(expectedCell));
    });

    test("cell is added with title config data", () => {
        mockScene.theme.choices = [{ asset: "asset_name_1", title: "asset title 1" }];

        const expectedCell = {
            title: "asset title 1",
        };
        grid = new GelGrid(mockScene, vPos, hPos, metrics, false, false);
        grid.addGridCells();
        expect(grid._cells[0]).toEqual(expect.objectContaining(expectedCell));
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
});
