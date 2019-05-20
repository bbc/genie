/**
 * @copyright BBC 2018
 * @author BBC Children's D+E
 * @license Apache-2.0
 */
import * as ButtonFactory from "../../../src/core/layout/button-factory";
import { Group } from "../../../src/core/layout/group";
// import * as buttonOverrides from "../../../src/core/layout/button-overrides";

// jest.mock("../../../node_modules/phaser-ce/build/custom/pixi", () => jest.fn());
// jest.mock("../../../node_modules/phaser-ce/build/custom/phaser-split", () => jest.fn());

describe("Group", () => {
    let buttonFactory;
    let game;
    let parentGroup;
    let metrics;
    let buttonResizeStub;
    let group;
    let config;
    let vPos;
    let hPos;
    // let mockPhaserGroup;

    beforeEach(() => {
        // mockPhaserGroup = {
        //     left: {
        //         get: jest.fn(),
        //         set: jest.fn(),
        //     },
        //     right: {
        //         get: jest.fn(),
        //         set: jest.fn(),
        //     },
        //     top: {
        //         get: jest.fn(),
        //         set: jest.fn(),
        //     },
        //     width: {
        //         get: jest.fn(),
        //         set: jest.fn(),
        //     },
        //     height: {
        //         get: jest.fn(),
        //         set: jest.fn(),
        //     },
        //     children: [{ updateTransform: jest.fn() }],
        // };

        game = jest.fn();
        parentGroup = {
            addChild: () => {},
            children: [],
        };
        config = {};
        metrics = {
            borderPad: 100,
            buttonPad: 50,
            horizontals: { left: -1000, center: 0, right: 1000 },
            safeHorizontals: { left: -300, center: 0, right: 300 },
            verticals: { top: -1500, middle: 0, bottom: 1500 },
            scale: 1,
        };
        buttonResizeStub = jest.fn();
        buttonFactory = {
            createButton: () => {
                return {
                    x: 50,
                    y: 50,
                    width: 200,
                    height: 100,
                    updateTransform: () => {},
                    resize: buttonResizeStub,
                };
            },
        };
        vPos = "middle";
        hPos = "center";
        jest.spyOn(ButtonFactory, "create").mockImplementation(() => buttonFactory);
        group = new Group(game, parentGroup, vPos, hPos, metrics, false);
        // global.Phaser.Group.prototype = jest.fn(() => mockPhaserGroup);
        // global.PIXI.Group.prototype = jest.fn(() => mockPhaserGroup);
    });

    afterEach(() => jest.clearAllMocks());

    describe("addButton method", () => {
        test("creates and returns new button", () => {
            const newButton = buttonFactory.createButton();
            jest.spyOn(buttonFactory, "createButton").mockImplementation(() => newButton);

            expect(group.addButton(config)).toBe(newButton);
        });

        test("adds newly created button to the group", () => {
            const newButton = buttonFactory.createButton();
            jest.spyOn(buttonFactory, "createButton").mockImplementation(() => newButton);

            group.addButton(config);
            expect(group.children.length).toBe(1);
            expect(group.children[0]).toBe(newButton);
        });

        test("aligns button accordingly", () => {
            vPos = "bottom";
            hPos = "center";
            group = new Group(game, parentGroup, vPos, hPos, metrics, false);

            group.addButton(config);
            group.addButton(config);

            expect(group.children[0].x).toBe(100);
            expect(group.children[1].x).toBe(350);
        });

        test("aligns center buttons accordingly", () => {
            group.addButton(config);
            group.addButton(config);
            group.reset(metrics);

            expect(group.children[0].y).toBe(0);
            expect(group.children[1].y).toBe(0);
        });

        describe("when vPos is middle and hPos is center", () => {
            test("sets group position correctly", () => {
                group.addButton(config);
                group.reset(metrics);
                expect(group.x).toBe(0);
                expect(group.y).toBe(0);
            });
        });

        describe("when vPos is top and hPos is right", () => {
            test("sets group position correctly", () => {
                vPos = "top";
                hPos = "right";
                group = new Group(game, parentGroup, vPos, hPos, metrics, false);

                group.addButton(config);
                group.reset(metrics);
                expect(group.x).toBe(900);
                expect(group.y).toBe(-1400);
            });
        });

        describe("when vPos is bottom and hPos is left", () => {
            test("sets group position correctly", () => {
                vPos = "bottom";
                hPos = "left";
                group = new Group(game, parentGroup, vPos, hPos, metrics, false);

                group.addButton(config);
                group.reset(metrics);
                expect(group.x).toBe(-900);
                expect(group.y).toBe(1400);
            });
        });

        describe("when vPos is bottom and hPos is left and group is safe", () => {
            test("sets group position correctly", () => {
                vPos = "bottom";
                hPos = "left";
                group = new Group(game, parentGroup, vPos, hPos, metrics, true);

                group.addButton(config);
                group.reset(metrics);
                expect(group.x).toBe(-200);
                expect(group.y).toBe(1400);
            });
        });

        //     describe("when vPos is top and hPos is left", () => {
        //         test("correctly takes hitArea into account", () => {
        //             jest
        //                 .spyOn(buttonFactory, "createButton")
        //                 .mockReturnValueOnce(() => ({
        //                     x: 50,
        //                     y: 50,
        //                     width: 50,
        //                     height: 50,
        //                     hitArea: {
        //                         left: 0,
        //                         top: 0,
        //                     },
        //                     updateTransform: () => {},
        //                     resize: buttonResizeStub,
        //                 }))
        //                 .mockReturnValueOnce(() => ({
        //                     x: 50,
        //                     y: 50,
        //                     width: 50,
        //                     height: 50,
        //                     hitArea: {
        //                         left: -1000,
        //                         top: -1000,
        //                     },
        //                     updateTransform: () => {},
        //                     resize: buttonResizeStub,
        //                 }));
        //
        //             vPos = "top";
        //             hPos = "left";
        //
        //
        //             // global.window.getGMI = jest.fn(() => mockGmi);
        //             // jest.spyOn(global.Phaser, "prototype").mockImplementation(() => ({
        //             //     Group: jest.fn(() => ({ width: jest.fn(() => 50) })),
        //             // }));
        //             // Object.defineProperty(global.Phaser.Group, "prototype", {
        //             //     left: jest.fn(() => ["set"]),
        //             //     top: jest.fn(() => ["set"]),
        //             //     width: jest.fn(() => 50),
        //             // });
        //
        //             group = new Group(game, parentGroup, vPos, hPos, metrics);
        //
        //             group.addButton(config);
        //             // group.addButton(config);
        //             // group.reset(metrics);
        //             //
        //             // expect(group.left.set).toHaveBeenCalledTimes(1);
        //             // expect(group.top).toHaveBeenCalledTimes(1);
        //             //
        //             // expect(group.left).toHaveBeenCalledWith(-25);
        //             // expect(group.top).toHaveBeenCalledWith(-425);
        //         });
        //     });
        //
        //     describe("when vPos is bottom and hPos is right", () => {
        //         test("correctly takes hitArea into account", () => {
        //             const rightSpy = jest.spyOn(Group.prototype, "right", ["set"]);
        //             const bottomSpy = jest.spyOn(Group.prototype, "bottom", ["set"]);
        //             const createButtonStub = jest.spyOn(buttonFactory, "createButton");
        //
        //             vPos = "bottom";
        //             hPos = "right";
        //             group = new Group(game, parentGroup, vPos, hPos, metrics);
        //
        //             createButtonStub.returns({
        //                 x: 50,
        //                 y: 50,
        //                 width: 50,
        //                 height: 50,
        //                 hitArea: {
        //                     right: 1000,
        //                     bottom: 1000,
        //                 },
        //                 updateTransform: () => {},
        //                 resize: buttonResizeStub,
        //             });
        //             group.addButton(config);
        //
        //             createButtonStub.returns({
        //                 x: 50,
        //                 y: 50,
        //                 width: 50,
        //                 height: 50,
        //                 hitArea: {
        //                     right: 0,
        //                     bottom: 0,
        //                 },
        //                 updateTransform: () => {},
        //                 resize: buttonResizeStub,
        //             });
        //             group.addButton(config);
        //
        //             group.reset(metrics);
        //
        //             expect(rightSpy.set).toHaveBeenCalledTimes(1);
        //             expect(bottomSpy.set).toHaveBeenCalledTimes(1);
        //
        //             expect(rightSpy.set).toHaveBeenCalledWith(-125);
        //             expect(bottomSpy.set).toHaveBeenCalledWith(375);
        //         });
        //     });
        // });
        //
        // describe("addToGroup method", () => {
        //     test("adds item to this group", () => {
        //         const mockButton = {
        //             anchor: {
        //                 setTo: (x, y) => {
        //                     x, y;
        //                 },
        //             },
        //             updateTransform: () => {},
        //         };
        //         group.addToGroup(mockButton);
        //         expect(group.children.length === 1).toBeTruthy();
        //         expect(group.children[0] === mockButton).toBeTruthy();
        //     });
        // });
        //
        // describe("reset method", () => {
        //     test("sets group position when resizing from desktop to desktop", () => {
        //         const expectedGroupXPosition = 0;
        //         const expectedGroupYPosition = -333;
        //         const desktopMetrics = { horizontals: {}, verticals: {} };
        //         const moreDesktopMetrics = { borderPad: 0, horizontals: { center: 0 }, verticals: { top: -333 } };
        //
        //         group = new Group(game, parentGroup, "top", "center", desktopMetrics, false);
        //         group.addButton(config);
        //         group.reset(moreDesktopMetrics);
        //
        //         expect(group.x).toBe(expectedGroupXPosition);
        //         expect(group.y).toBe(expectedGroupYPosition);
        //     });
        //
        //     test("resizes buttons after resizing the group and the width drops below the mobile breakpoint", () => {
        //         const desktopMetrics = { isMobile: false, horizontals: {}, verticals: {} };
        //         const mobileMetrics = { isMobile: true, horizontals: {}, verticals: {} };
        //
        //         group = new Group(game, parentGroup, "bottom", "right", desktopMetrics, false);
        //         group.addButton(config);
        //         group.reset(mobileMetrics);
        //
        //         expect(group._metrics.isMobile).toBe(true);
        //         expect(buttonResizeStub).toHaveBeenCalledTimes(1);
        //     });
        //
        //     test("does not resize buttons after resizing the group and the width remains above the mobile breakpoint", () => {
        //         const desktopMetrics = { isMobile: false, horizontals: {}, verticals: {} };
        //         const moreDesktopMetrics = { isMobile: false, horizontals: {}, verticals: {} };
        //
        //         group = new Group(game, parentGroup, "top", "left", desktopMetrics, false);
        //         group.addButton(config);
        //         group.reset(moreDesktopMetrics);
        //
        //         expect(group._metrics.isMobile).toBe(false);
        //         expect(buttonResizeStub).not.toHaveBeenCalled();
        //     });
        //
        //     test("calls applyButtonOverrides function with correct args", () => {
        //         const applyButtonOverrides = jest.spyOn(buttonOverrides, "applyButtonOverrides");
        //         group.addButton(config);
        //         group.reset(metrics);
        //         expect(applyButtonOverrides).toHaveBeenCalledWith(metrics.scale, group._buttons);
        //     });
    });
});
