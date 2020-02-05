/**
 * @copyright BBC 2019
 * @author BBC Children's D+E
 * @license Apache-2.0
 */
import { accessibilify } from "../../../../src/core/accessibility/accessibilify.js";
import { GelGrid } from "../../../../src/core/layout/grid/grid.js";
import * as gmiModule from "../../../../src/core/gmi/gmi.js";

jest.mock("../../../../src/core/accessibility/accessibilify.js");

describe("Grid", () => {
    let mockScene;
    let metrics;
    let mockRoot;
    let mockPhaserGroup;
    let mockSprite;
    let grid;
    let mockSafeArea;
    let desktopCellPadding;
    let transitionCallback;

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
            theme: {
                choices: [{ asset: "asset_name" }],
            },
            scene: {
                key: "item-select",
            },
            time: {
                addEvent: jest.fn(({ callback, callbackScope, args }) => {
                    transitionCallback = () => {
                        callback.apply(callbackScope, args);
                    };
                }),
            },
            add: {
                gelButton: jest.fn((x, y, metrics, config) => ({
                    visible: false,
                    input: { enabled: false },
                    x: 50,
                    y: 50,
                    scaleY: 1,
                    scaleX: 1,
                    setSize: function(width, height) {
                        this.width = width;
                        this.height = height;
                    },
                    setDisplaySize: function(width, height) {
                        this.displayWidth = width;
                        this.displayHeight = height;
                    },
                    on: jest.fn(),
                    sprite: mockSprite,
                    config: {
                        gameButton: false,
                        id: config.id,
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
        metrics = {
            borderPad: 100,
            buttonPad: 50,
            horizontals: { left: -1000, center: 0, right: 1000 },
            safeHorizontals: { left: -300, center: 0, right: 300 },
            verticals: { top: -1500, middle: 0, bottom: 1500 },
            scale: 1,
            screenToCanvas: jest.fn(n => n),
        };

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
    });

    afterEach(() => jest.clearAllMocks());

    describe("adding cells", () => {
        //test("add a cell to the grid", () => {
        //    grid = new GelGrid(mockScene, metrics, mockSafeArea);
        //    grid.addCell({});
        //
        //    expect(grid.addAt).toHaveBeenCalledTimes(1);
        //});
        //
        //test("adds a button to the grid when adding a cell", () => {
        //    grid = new GelGrid(mockScene, metrics, mockSafeArea);
        //    grid.addCell({});
        //
        //    expect(mockScene.add.gelButton).toHaveBeenCalledTimes(1);
        //});

        test("adds multiple cells to the grid from theme config", () => {
            mockScene.theme.choices = [{ asset: "asset_name_1" }, { asset: "asset_name_2" }, { asset: "asset_name_3" }];

            grid = new GelGrid(mockScene, metrics);
            grid.addGridCells(mockScene.theme.choices);

            expect(grid.add).toHaveBeenCalledTimes(3);
            expect(mockScene.add.gelButton).toHaveBeenCalledTimes(3);
        });

        test("cell is added with key from config data", () => {
            mockScene.theme.choices = [{ key: "asset_name_1" }];

            const expectedConfig = {
                key: mockScene.theme.choices[0].key,
            };
            grid = new GelGrid(mockScene, metrics);
            grid.addGridCells(mockScene.theme.choices);

            const resultParams = mockScene.add.gelButton.mock.calls[0];
            expect(resultParams[3]).toEqual(expect.objectContaining(expectedConfig));
        });

        test("gel button is created using metrics passed from the grid", () => {
            mockScene.theme.choices = [{ asset: "asset_name_1", title: "asset title 1" }];

            grid = new GelGrid(mockScene, metrics);
            grid.addGridCells(mockScene.theme.choices);

            const actualParams = mockScene.add.gelButton.mock.calls[0];
            expect(actualParams[2]).toEqual(metrics);
        });

        test("multiple gel buttons are created", () => {
            mockScene.theme.choices = [{ asset: "asset_name_1", title: "asset title 1" }];

            grid = new GelGrid(mockScene, metrics);
            grid.addGridCells(mockScene.theme.choices);

            const actualParams = mockScene.add.gelButton.mock.calls[0];
            expect(actualParams[0]).toBe(0);
            expect(actualParams[1]).toBe(0);
        });

        test("returns ids for multiple cells", () => {
            mockScene.theme.choices = [{ id: "asset_name_1" }, { id: "asset_name_2" }, { id: "asset_name_3" }];
            const expectedIds = ["asset_name_1", "asset_name_2", "asset_name_3"];
            grid = new GelGrid(mockScene, metrics);
            grid.addGridCells(mockScene.theme.choices);
            expect(grid.cellIds()).toEqual(expectedIds);
        });

        describe("accessibility", () => {
            test("adds each cell to accessibility", () => {
                mockScene.theme.choices = [{ asset: "asset_name_1" }, { asset: "asset_name_2" }];

                grid = new GelGrid(mockScene, metrics);
                grid.addGridCells(mockScene.theme.choices);

                expect(accessibilify).toHaveBeenCalledTimes(2);
            });
        });
    });

    describe("grid contents", () => {
        test("first grid cell is visible", () => {
            mockScene.theme.choices = [{ asset: "asset_name_1" }, { asset: "asset_name_2" }, { asset: "asset_name_3" }];

            grid = new GelGrid(mockScene, metrics);
            const resultCells = grid.addGridCells(mockScene.theme.choices);

            expect(resultCells[0].button.visible).toBe(true);
        });

        test("subsequent grid cells are not visible", () => {
            mockScene.theme.choices = [{ asset: "asset_name_1" }, { asset: "asset_name_2" }, { asset: "asset_name_3" }];

            grid = new GelGrid(mockScene, metrics);
            const resultCells = grid.addGridCells(mockScene.theme.choices);

            expect(resultCells[1].button.visible).toBe(false);
            expect(resultCells[2].button.visible).toBe(false);
        });

        test("first two cells are visible when `columns = 2` in config", () => {
            mockScene.theme.choices = [{ asset: "asset_name_1" }, { asset: "asset_name_2" }];
            mockScene.theme.columns = 2;

            grid = new GelGrid(mockScene, metrics, mockScene.theme);
            const resultCells = grid.addGridCells(mockScene.theme.choices);

            expect(resultCells[0].button.visible).toBe(true);
            expect(resultCells[1].button.visible).toBe(true);
        });

        test("first two cells are visible when `rows = 2` in config", () => {
            mockScene.theme.choices = [{ asset: "asset_name_1" }, { asset: "asset_name_2" }];
            mockScene.theme.rows = 2;

            grid = new GelGrid(mockScene, metrics, mockScene.theme);
            const resultCells = grid.addGridCells(mockScene.theme.choices);

            expect(resultCells[0].button.visible).toBe(true);
            expect(resultCells[1].button.visible).toBe(true);
        });

        test("additional cells are not visible when `columns < choices` in config", () => {
            mockScene.theme.choices = [
                { asset: "asset_name_1" },
                { asset: "asset_name_2" },
                { asset: "asset_name_3" },
                { asset: "asset_name_4" },
            ];
            mockScene.theme.columns = 2;

            grid = new GelGrid(mockScene, metrics, mockScene.theme);
            const resultCells = grid.addGridCells(mockScene.theme.choices);

            expect(resultCells[2].button.visible).toBe(false);
            expect(resultCells[3].button.visible).toBe(false);
        });

        test("only the first 4 cells are visible when `columns > 4` in config", () => {
            mockScene.theme.choices = [
                { asset: "asset_name_0" },
                { asset: "asset_name_1" },
                { asset: "asset_name_2" },
                { asset: "asset_name_3" },
                { asset: "asset_name_4" },
            ];
            mockScene.theme.columns = 5;

            grid = new GelGrid(mockScene, metrics, mockScene.theme);
            const resultCells = grid.addGridCells(mockScene.theme.choices);

            expect(resultCells[0].button.visible).toBe(true);
            expect(resultCells[1].button.visible).toBe(true);
            expect(resultCells[2].button.visible).toBe(true);
            expect(resultCells[3].button.visible).toBe(true);
            expect(resultCells[4].button.visible).toBe(false);
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

            grid = new GelGrid(mockScene, metrics, mockScene.theme);
            const resultCells = grid.addGridCells(mockScene.theme.choices);

            expect(resultCells[0].button.visible).toBe(true);
            expect(resultCells[1].button.visible).toBe(true);
            expect(resultCells[2].button.visible).toBe(true);
            expect(resultCells[3].button.visible).toBe(true);
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

            grid = new GelGrid(mockScene, metrics, mockScene.theme);
            const resultCells = grid.addGridCells(mockScene.theme.choices);

            expect(resultCells[4].button.visible).toBe(false);
            expect(resultCells[5].button.visible).toBe(false);
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

            grid = new GelGrid(mockScene, metrics, mockScene.theme);
            const resultCells = grid.addGridCells(mockScene.theme.choices);

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
            mockScene.theme.choices = [{ asset: "asset_name_0" }, { asset: "asset_name_1" }];
            mockScene.theme.columns = 3;

            grid = new GelGrid(mockScene, metrics, mockScene.theme);
            const resultCells = grid.addGridCells(mockScene.theme.choices);

            expect(resultCells[0]).toBeTruthy();
            expect(resultCells[1]).toBeTruthy();
            expect(resultCells[2]).toBeFalsy();
        });
    });

    // TODO These tests should be retained for possible inclusion of hit area adjustment, currently being skipped due to unexplained behaviour with the scaling calculations.
    //describe.skip("grid cell sizes", () => {
    //    test("single cell hit area is full width and height of the safe area", () => {
    //        mockScene.theme.choices = [{ asset: "asset_name_0" }];
    //
    //        grid = new GelGrid(mockScene, metrics, mockSafeArea);
    //        const resultCells = grid.addGridCells(mockScene.theme.choices);
    //
    //        expect(resultCells[0].input.hitArea.width).toEqual(mockSafeArea.width);
    //        expect(resultCells[0].input.hitArea.height).toEqual(mockSafeArea.height);
    //    });
    //
    //    test("cell hit area width when 2 columns with desktop grid padding", () => {
    //        mockScene.theme.choices = [{ asset: "asset_name_0" }, { asset: "asset_name_1" }];
    //        mockScene.theme.columns = 2;
    //        mockSafeArea.left = -400;
    //        mockSafeArea.top = -400;
    //        mockSafeArea.width = 800;
    //        mockSafeArea.height = 800;
    //
    //        grid = new GelGrid(mockScene, metrics, mockSafeArea, mockScene.theme);
    //        const resultCells = grid.addGridCells(mockScene.theme.choices);
    //
    //        const expectedCellWidth = (800 - desktopCellPadding) / 2;
    //
    //        expect(resultCells[0].input.hitArea.width).toEqual(expectedCellWidth);
    //    });
    //
    //    test("cell hit area width when 4 columns with mobile grid padding", () => {
    //        metrics.isMobile = true;
    //        mockScene.theme.choices = [
    //            { asset: "asset_name_0" },
    //            { asset: "asset_name_1" },
    //            { asset: "asset_name_2" },
    //            { asset: "asset_name_3" },
    //        ];
    //        mockScene.theme.columns = 4;
    //        mockSafeArea.left = -400;
    //        mockSafeArea.top = -400;
    //        mockSafeArea.width = 800;
    //        mockSafeArea.height = 800;
    //
    //        grid = new GelGrid(mockScene, metrics, mockSafeArea, mockScene.theme);
    //        const resultCells = grid.addGridCells(mockScene.theme.choices);
    //
    //        const expectedCellWidth = (800 - mobileCellPadding * 3) / 4;
    //
    //        expect(resultCells[0].input.hitArea.width).toEqual(expectedCellWidth);
    //    });
    //
    //    test("cell hit area height when 2 rows with desktop grid padding", () => {
    //        mockScene.theme.choices = [{ asset: "asset_name_0" }, { asset: "asset_name_1" }];
    //        mockScene.theme.rows = 2;
    //        mockSafeArea.top = -400;
    //        mockSafeArea.left = -400;
    //        mockSafeArea.width = 800;
    //        mockSafeArea.height = 800;
    //
    //        const expectedCellHeight = (800 - 24) / 2;
    //
    //        grid = new GelGrid(mockScene, metrics, mockSafeArea, mockScene.theme);
    //        const resultCells = grid.addGridCells(mockScene.theme.choices);
    //
    //        expect(resultCells[0].input.hitArea.height).toEqual(expectedCellHeight);
    //    });
    //
    //    test("cell hit area width when 2 columns with mobile grid padding", () => {
    //        metrics.isMobile = true;
    //        mockScene.theme.choices = [{ asset: "asset_name_0" }, { asset: "asset_name_1" }];
    //        mockScene.theme.columns = 2;
    //        mockSafeArea.top = -400;
    //        mockSafeArea.left = -400;
    //        mockSafeArea.width = 800;
    //        mockSafeArea.height = 800;
    //
    //        grid = new GelGrid(mockScene, metrics, mockSafeArea, mockScene.theme);
    //        const resultCells = grid.addGridCells(mockScene.theme.choices);
    //
    //        const expectedCellWidth = (800 - mobileCellPadding) / 2;
    //
    //        expect(resultCells[0].input.hitArea.width).toEqual(expectedCellWidth);
    //    });
    //
    //    test("cell hit area width when 3 columns with mobile grid padding", () => {
    //        metrics.isMobile = true;
    //        mockScene.theme.choices = [{ asset: "asset_name_0" }, { asset: "asset_name_1" }, { asset: "asset_name_2" }];
    //        mockScene.theme.columns = 3;
    //        mockSafeArea.left = -300;
    //        mockSafeArea.right = 300;
    //
    //        grid = new GelGrid(mockScene, metrics, mockSafeArea, mockScene.theme);
    //        const resultCells = grid.addGridCells(mockScene.theme.choices);
    //
    //        const expectedCellWidth = (600 - 32) / 3;
    //
    //        expect(resultCells[0].input.hitArea.width).toEqual(expectedCellWidth);
    //    });
    //
    //    test("cell hit area height when 2 rows with mobile grid padding", () => {
    //        metrics.isMobile = true;
    //        mockScene.theme.choices = [{ asset: "asset_name_0" }, { asset: "asset_name_1" }];
    //        mockScene.theme.rows = 2;
    //        mockSafeArea.top = -400;
    //        mockSafeArea.left = -400;
    //        mockSafeArea.width = 800;
    //        mockSafeArea.height = 800;
    //
    //        const expectedCellHeight = (800 - mobileCellPadding) / 2;
    //
    //        grid = new GelGrid(mockScene, metrics, mockSafeArea, mockScene.theme);
    //        const resultCells = grid.addGridCells(mockScene.theme.choices);
    //
    //        expect(resultCells[0].input.hitArea.height).toEqual(expectedCellHeight);
    //    });
    //});

    describe("grid cell positions", () => {
        test("single cell is added at the centre of the safe area", () => {
            mockScene.theme.choices = [{ asset: "asset_name_0" }];

            grid = new GelGrid(mockScene, metrics);
            const resultCells = grid.addGridCells(mockScene.theme.choices);

            expect(resultCells[0].button.x).toEqual(0);
            expect(resultCells[0].button.y).toEqual(0);
        });

        test("2 cells are aligned to the edges of the safe area in a 2 column layout", () => {
            mockScene.theme.choices = [{ asset: "asset_name_0" }, { asset: "asset_name_1" }];
            mockScene.theme.columns = 2;
            mockSafeArea.left = -400;
            mockSafeArea.top = -300;
            mockSafeArea.width = 700;
            mockSafeArea.height = 700;

            grid = new GelGrid(mockScene, metrics, mockScene.theme);
            const resultCells = grid.addGridCells(mockScene.theme.choices);

            const expectedPositions = [
                { x: mockSafeArea.left + resultCells[0].button.displayWidth / 2 },
                { x: mockSafeArea.left + mockSafeArea.width - resultCells[1].button.displayWidth / 2 },
            ];

            expect(resultCells[0].button.x).toEqual(expectedPositions[0].x);
            expect(resultCells[1].button.x).toEqual(expectedPositions[1].x);
        });

        test("3 cells are aligned in a 3 column layout", () => {
            mockScene.theme.choices = [{ asset: "asset_name_0" }, { asset: "asset_name_1" }, { asset: "asset_name_2" }];
            mockScene.theme.columns = 3;
            mockSafeArea.left = -300;
            mockSafeArea.top = -200;
            mockSafeArea.width = 600;
            mockSafeArea.height = 400;

            grid = new GelGrid(mockScene, metrics, mockScene.theme);
            const resultCells = grid.addGridCells(mockScene.theme.choices);

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
            mockScene.theme.choices = [{ key: "asset_name_0" }, { key: "asset_name_1" }];
            mockScene.theme.rows = 2;
            mockSafeArea.top = -200;
            mockSafeArea.left = -200;
            mockSafeArea.width = 400;
            mockSafeArea.height = 400;

            grid = new GelGrid(mockScene, metrics, mockScene.theme);
            const resultCells = grid.addGridCells(mockScene.theme.choices);

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

        test("resize method sets cell positions", () => {
            mockScene.theme.choices = [{ asset: "asset_name_0" }, { asset: "asset_name_1" }];
            mockScene.theme.columns = 2;
            const resizedSafeArea = {
                left: -800,
                top: -600,
                width: 1600,
                height: 1200,
            };

            grid = new GelGrid(mockScene, metrics, mockScene.theme);
            grid.addGridCells(mockScene.theme.choices);
            grid.resize(metrics, resizedSafeArea);

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
            mockScene.theme.choices = [{ asset: "asset_name_0" }, { asset: "asset_name_1" }];
            mockScene.theme.columns = 2;
            metrics.isMobile = true;
            const resizedSafeArea = {
                left: -800,
                top: -600,
                width: 1600,
                height: 1200,
            };

            grid = new GelGrid(mockScene, metrics, mockScene.theme);
            grid.addGridCells(mockScene.theme.choices);
            grid.resize(metrics, resizedSafeArea);

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
            mockScene.theme.choices = [{ asset: "asset_name_0" }, { asset: "asset_name_1" }];
            mockScene.theme.columns = 3;

            const expectedPositions = [
                {
                    x: -104,
                },
                {
                    x: 104,
                },
            ];

            grid = new GelGrid(mockScene, metrics, mockScene.theme);
            const resultCells = grid.addGridCells(mockScene.theme.choices);

            // expect(resultCells[0].x).toEqual(expectedPositions[0].x);
            expect(resultCells[1].button.x).toEqual(expectedPositions[1].x);
        });

        test("remainder of 2 cells in a 3 column layout are left justified from config", () => {
            mockScene.theme.choices = [{ asset: "asset_name_0" }, { asset: "asset_name_1" }];
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

            grid = new GelGrid(mockScene, metrics, mockScene.theme);
            const resultCells = grid.addGridCells(mockScene.theme.choices);

            expect(resultCells[0].button.x).toEqual(expectedPositions[0].x);
            expect(resultCells[1].button.x).toEqual(expectedPositions[1].x);
        });

        test("remainder of 2 cells in a 3 column layout are right justified from config", () => {
            mockScene.theme.choices = [{ asset: "asset_name_0" }, { asset: "asset_name_1" }];
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

            grid = new GelGrid(mockScene, metrics, mockScene.theme);
            const resultCells = grid.addGridCells(mockScene.theme.choices);

            expect(resultCells[0].button.x).toEqual(expectedPositions[0].x);
            expect(resultCells[1].button.x).toEqual(expectedPositions[1].x);
        });
    });

    describe("resize method", () => {
        test("stores safeArea and metrics on class", () => {
            grid = new GelGrid(mockScene, metrics, { rows: 1, columns: 3 });
            grid.resize(metrics, mockSafeArea);
            expect(grid._safeArea).toBe(mockSafeArea);
            expect(grid._metrics).toBe(metrics);
        });

        test("sets correct cellpadding when desktop mode", () => {
            metrics.isMobile = false;
            grid = new GelGrid(mockScene, metrics, { rows: 1, columns: 3 });
            grid.resize(metrics, mockSafeArea);
            expect(grid._cellPadding).toBe(24);
        });

        test("sets correct cellpadding when mobile mode", () => {
            metrics.isMobile = true;
            grid = new GelGrid(mockScene, metrics, { rows: 1, columns: 3 });
            grid.resize(metrics, mockSafeArea);
            expect(grid._cellPadding).toBe(16);
        });

        test("resets grid", () => {
            grid = new GelGrid(mockScene, metrics, { rows: 1, columns: 3 });
            grid.reset = jest.fn();
            grid.resize(metrics, mockSafeArea);
            expect(grid.reset).toHaveBeenCalled();
        });
    });

    describe("cell sprite sizes", () => {
        test("square cell sprite is scaled to fit into portrait aspect cell", () => {
            mockSprite = {
                width: 200,
                height: 200,
            };
            mockScene.theme.choices = [{ asset: "asset_name_0" }, { asset: "asset_name_1" }, { asset: "asset_name_1" }];
            grid = new GelGrid(mockScene, metrics, { rows: 1, columns: 3 });
            grid.addGridCells(mockScene.theme.choices);
            expect(grid._cells[0].button.displayWidth).toBe(184);
            expect(grid._cells[0].button.displayHeight).toBe(184);
        });

        test("portrait cell sprite is scaled to fit into portrait aspect cell", () => {
            mockSprite = {
                width: 200,
                height: 400,
            };
            mockScene.theme.choices = [{ asset: "asset_name_0" }, { asset: "asset_name_1" }, { asset: "asset_name_1" }];
            grid = new GelGrid(mockScene, metrics, { rows: 1, columns: 3 });
            grid.addGridCells(mockScene.theme.choices);
            expect(grid._cells[0].button.displayWidth).toBe(184);
            expect(grid._cells[0].button.displayHeight).toBe(368);
        });

        test("landscape cell sprite is scaled to fit into portrait aspect cell", () => {
            mockSprite = {
                width: 400,
                height: 200,
            };
            mockScene.theme.choices = [{ asset: "asset_name_0" }, { asset: "asset_name_1" }, { asset: "asset_name_1" }];
            grid = new GelGrid(mockScene, metrics, { rows: 1, columns: 3 });
            grid.addGridCells(mockScene.theme.choices);
            expect(grid._cells[0].button.displayWidth).toBe(184);
            expect(grid._cells[0].button.displayHeight).toBe(92);
        });

        test("square cell sprite is scaled to fit into landscape aspect cell", () => {
            mockSprite = {
                width: 200,
                height: 200,
            };
            mockScene.theme.choices = [{ asset: "asset_name_0" }, { asset: "asset_name_1" }];
            grid = new GelGrid(mockScene, metrics, { rows: 2, columns: 1 });
            grid.addGridCells(mockScene.theme.choices);
            expect(grid._cells[0].button.displayWidth).toBe(288);
            expect(grid._cells[0].button.displayHeight).toBe(288);
        });

        test("portrait cell sprite is scaled to fit into landscape aspect cell", () => {
            mockSprite = {
                width: 200,
                height: 400,
            };
            mockScene.theme.choices = [{ asset: "asset_name_0" }, { asset: "asset_name_1" }];
            grid = new GelGrid(mockScene, metrics, { rows: 2, columns: 1 });

            grid.addGridCells(mockScene.theme.choices);
            expect(grid._cells[0].button.displayWidth).toBe(144);
            expect(grid._cells[0].button.displayHeight).toBe(288);
        });

        test("landscape cell sprite is scaled to fit into landscape aspect cell", () => {
            mockSprite = {
                width: 400,
                height: 200,
            };
            mockScene.theme.choices = [{ asset: "asset_name_0" }, { asset: "asset_name_1" }];
            grid = new GelGrid(mockScene, metrics, { rows: 2, columns: 1 });

            grid.addGridCells(mockScene.theme.choices);
            expect(grid._cells[0].button.displayWidth).toBe(576);
            expect(grid._cells[0].button.displayHeight).toBe(288);
        });
    });

    describe("pagination", () => {
        beforeEach(() => {
            mockScene.add.tween = jest.fn();
        });

        describe("next page behaviour", () => {
            beforeEach(() => {
                mockScene.theme.choices = [
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
                grid = new GelGrid(mockScene, metrics, { rows: 2, columns: 2 });
                grid.addGridCells(mockScene.theme.choices);
            });

            //test("tweens all the cells on this and the next page", () => {
            //    grid.nextPage();
            //    expect(mockScene.add.tween).toHaveBeenCalledTimes(8);
            //});

            //test("disables input on start of animation", () => {
            //    grid.nextPage();
            //    expect(mockScene.input.enabled).toBe(false);
            //});
            //
            //test("enables input in end timer", () => {
            //    grid.nextPage();
            //    transitionCallback();
            //    expect(mockScene.input.enabled).toBe(true);
            //});

            //test("tweens in all the cells on the next page taking into account the safe area", () => {
            //    grid.nextPage();
            //    const tweenCalls = mockScene.add.tween.mock.calls;
            //    expect(tweenCalls[0][0]).toEqual({
            //        targets: grid._cells[4],
            //        ease: "Cubic.easeInOut",
            //        x: { from: 444, to: -156 },
            //        alpha: { from: 0, to: 1 },
            //        duration: 500,
            //    });
            //    expect(tweenCalls[1][0]).toEqual({
            //        targets: grid._cells[5],
            //        ease: "Cubic.easeInOut",
            //        x: { from: 756, to: 156 },
            //        alpha: { from: 0, to: 1 },
            //        duration: 500,
            //    });
            //    expect(tweenCalls[2][0]).toEqual({
            //        targets: grid._cells[6],
            //        ease: "Cubic.easeInOut",
            //        x: { from: 444, to: -156 },
            //        alpha: { from: 0, to: 1 },
            //        duration: 500,
            //    });
            //    expect(tweenCalls[3][0]).toEqual({
            //        targets: grid._cells[7],
            //        ease: "Cubic.easeInOut",
            //        x: { from: 756, to: 156 },
            //        alpha: { from: 0, to: 1 },
            //        duration: 500,
            //    });
            //});

            //test("tweens out all the cells on the current page taking into account the safe area", () => {
            //    grid.nextPage();
            //    const tweenCalls = mockScene.add.tween.mock.calls;
            //    expect(tweenCalls[4][0]).toEqual({
            //        targets: grid._cells[0],
            //        ease: "Cubic.easeInOut",
            //        x: { from: -156, to: -756 },
            //        alpha: { from: 1, to: 0 },
            //        duration: 500,
            //    });
            //    expect(tweenCalls[5][0]).toEqual({
            //        targets: grid._cells[1],
            //        ease: "Cubic.easeInOut",
            //        x: { from: 156, to: -444 },
            //        alpha: { from: 1, to: 0 },
            //        duration: 500,
            //    });
            //    expect(tweenCalls[6][0]).toEqual({
            //        targets: grid._cells[2],
            //        ease: "Cubic.easeInOut",
            //        x: { from: -156, to: -756 },
            //        alpha: { from: 1, to: 0 },
            //        duration: 500,
            //    });
            //    expect(tweenCalls[7][0]).toEqual({
            //        targets: grid._cells[3],
            //        ease: "Cubic.easeInOut",
            //        x: { from: 156, to: -444 },
            //        alpha: { from: 1, to: 0 },
            //        duration: 500,
            //    });
            //});

            test("sets visibility of cells after paginating", () => {
                mockScene.theme.choices = [{ asset: "asset_name_1" }, { asset: "asset_name_2" }];

                grid = new GelGrid(mockScene, metrics);
                grid.addGridCells(mockScene.theme.choices);

                grid.showPage(1);
                transitionCallback();

                expect(grid._cells[0].button.visible).toEqual(false);
                expect(grid._cells[1].button.visible).toEqual(true);
            });

            test("sets alwaysTab to match visibility", () => {
                mockScene.theme.choices = [{ asset: "asset_name_1" }, { asset: "asset_name_2" }];

                grid = new GelGrid(mockScene, metrics);
                grid.addGridCells(mockScene.theme.choices);

                grid.showPage(1);
                transitionCallback();

                expect(grid._cells[0].button.config.alwaysTab).toEqual(false);
                expect(grid._cells[1].button.config.alwaysTab).toEqual(true);
            });
        });

        describe("previous page behaviour", () => {
            beforeEach(() => {
                mockScene.theme.choices = [
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
                grid = new GelGrid(mockScene, metrics, { rows: 2, columns: 2 });
                grid.addGridCells(mockScene.theme.choices);
            });

            test("tweens all the cells on this and the previous page", () => {
                grid.page = 1;
                grid.showPage(0);
                expect(mockScene.add.tween).toHaveBeenCalledTimes(8);
            });

            //test("tweens in all the cells on the previous page taking into account the safe area", () => {
            //    grid.previousPage();
            //    const tweenCalls = mockScene.add.tween.mock.calls;
            //    expect(tweenCalls[0][0]).toEqual({
            //        targets: grid._cells[8],
            //        ease: "Cubic.easeInOut",
            //        x: { from: -756, to: -156 },
            //        alpha: { from: 0, to: 1 },
            //        duration: 500,
            //    });
            //    expect(tweenCalls[1][0]).toEqual({
            //        targets: grid._cells[9],
            //        ease: "Cubic.easeInOut",
            //        x: { from: -444, to: 156 },
            //        alpha: { from: 0, to: 1 },
            //        duration: 500,
            //    });
            //});

            //test("tweens out all the cells on the current page taking into account the safe area", () => {
            //    grid.previousPage();
            //    const tweenCalls = mockScene.add.tween.mock.calls;
            //    expect(tweenCalls[2][0]).toEqual({
            //        targets: grid._cells[0],
            //        ease: "Cubic.easeInOut",
            //        x: { from: -156, to: 444 },
            //        alpha: { from: 1, to: 0 },
            //        duration: 500,
            //    });
            //    expect(tweenCalls[3][0]).toEqual({
            //        targets: grid._cells[1],
            //        ease: "Cubic.easeInOut",
            //        x: { from: 156, to: 756 },
            //        alpha: { from: 1, to: 0 },
            //        duration: 500,
            //    });
            //    expect(tweenCalls[4][0]).toEqual({
            //        targets: grid._cells[2],
            //        ease: "Cubic.easeInOut",
            //        x: { from: -156, to: 444 },
            //        alpha: { from: 1, to: 0 },
            //        duration: 500,
            //    });
            //    expect(tweenCalls[5][0]).toEqual({
            //        targets: grid._cells[3],
            //        ease: "Cubic.easeInOut",
            //        x: { from: 156, to: 756 },
            //        alpha: { from: 1, to: 0 },
            //        duration: 500,
            //    });
            //});
        });

        //test("remainder of 2 cells in a 3 column layout are correctly justified on last page", () => {
        //    mockScene.theme.choices = [
        //        { key: "asset_name_0" },
        //        { key: "asset_name_1" },
        //        { key: "asset_name_2" },
        //        { key: "asset_name_3" },
        //        { key: "asset_name_4" },
        //    ];
        //    mockScene.theme.columns = 3;
        //    mockScene.theme.rows = 2;
        //    mockScene.theme.align = "right";
        //
        //    const expectedPositions = [{ x: 0 }, { x: 208 }];
        //
        //    grid = new GelGrid(mockScene, metrics, mockScene.theme);
        //    grid.addGridCells(mockScene.theme.choices);
        //    grid.showPage(1);
        //
        //    expect(grid._cells[3].button.x).toEqual(expectedPositions[0].x);
        //    expect(grid._cells[4].button.x).toEqual(expectedPositions[1].x);
        //});

        test("page names are returned correctly", () => {
            mockScene.theme.choices = [{ key: "asset_name_0" }, { key: "asset_name_1" }];
            grid = new GelGrid(mockScene, metrics);
            grid.addGridCells(mockScene.theme.choices);
            const result = grid.getCurrentPageKey();
            expect(result).toEqual("asset_name_0");
        });

        //describe("accessibility", () => {
        //    test("calls accessibilify on cells after paginating", () => {
        //        mockScene.theme.choices = [{ asset: "asset_name_1" }, { asset: "asset_name_2" }];
        //
        //        grid = new GelGrid(mockScene, metrics, mockSafeArea);
        //        grid.addGridCells(mockScene.theme.choices);
        //
        //        grid.nextPage();
        //        transitionCallback();
        //
        //        expect(accessibilify).toHaveBeenCalledTimes(4);
        //    });
        //});
    });

    describe("getBoundingRect method", () => {
        test("returns the current safe area for use by layout.js debug draw methods on groups", () => {
            grid = new GelGrid(mockScene, metrics);
            expect(grid.getBoundingRect()).toEqual(mockSafeArea);
        });
    });
});
