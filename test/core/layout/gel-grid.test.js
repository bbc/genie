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
    let capturedIterateFunction;
    let grid;
    let mockGelButton;
    let config;

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
        config = {};

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
        // accessibilify.mockImplementation(() => {});
        jest.spyOn(GelButton, "GelButton").mockImplementation(() => mockGelButton);

        GelGrid.prototype.list = [];
        // GelGrid.prototype.iterate = fn => { // TODO - enable
        //     capturedIterateFunction = fn;
        // };
        GelGrid.prototype.addAt = jest.fn((child, position) => {
            // grid.list.push(child); // TODO - enable
        });
    });

    afterEach(() => jest.clearAllMocks());

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

    test("multiple cells are added", () => {
        mockScene.theme.choices = [{ asset: "asset_name_1" }, { asset: "asset_name_2" }];

        grid = new GelGrid(mockScene, vPos, hPos, metrics, false, false);
        grid.addGridCells();
        expect(grid._cells.length).toEqual(2);
    });

    test("cell is added with title config data", () => {
        mockScene.theme.choices = [{ asset: "asset_name_2", title: "asset title 1" }];

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

    test.only("returns keys for multiple cells", () => {
        mockScene.theme.choices = [{ asset: "asset_name_1" }, { asset: "asset_name_2" }, { asset: "asset_name_3" }];
        const expectedKeys = ["asset_name_1", "asset_name_2", "asset_name_3"];
        grid = new GelGrid(mockScene, vPos, hPos, metrics, false, false);
        grid.addGridCells();
        console.log(JSON.stringify(mockScene));
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
