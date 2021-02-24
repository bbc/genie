/**
 * @copyright BBC 2018
 * @author BBC Children's D+E
 * @license Apache-2.0
 */
import * as a11y from "../../../src/core/accessibility/accessibility-layer.js";
import * as CreateButton from "../../../src/core/layout/create-button.js";
import { GelGroup } from "../../../src/core/layout/gel-group.js";

describe("Group", () => {
    let mockCreateButton;
    let mockScene;
    let parentGroup;
    let metrics;
    let buttonResizeStub;
    let group;
    let config;
    let vPos;
    let hPos;
    let mockGetHitAreaBounds;

    beforeEach(() => {
        mockScene = {
            sys: {
                queueDepthSort: () => {},
            },
            scene: {
                key: "sceneKey",
            },
        };
        parentGroup = {
            addChild: () => {},
            children: [],
        };
        config = {};

        metrics = {
            horizontalBorderPad: 100,
            verticalBorderPad: 100,
            bottomBorderPad: 100,
            buttonPad: 50,
            horizontals: { left: -1000, center: 0, right: 1000 },
            safeHorizontals: { left: -300, center: 0, right: 300 },
            verticals: { top: -1500, middle: 0, bottom: 1500 },
            scale: 1,
            stageWidth: 1400,
        };
        buttonResizeStub = jest.fn();
        const hitAreaBounds = {
            x: 50,
            y: 50,
            width: 200,
            height: 100,
        };

        mockGetHitAreaBounds = jest.fn(() => hitAreaBounds);

        mockCreateButton = (scene, config = {}) => ({
            x: config.x || 50,
            y: config.y || 50,
            width: config.width || 200,
            height: config.height || 100,
            input: {},
            updateIndicatorPosition: jest.fn(),
            updateTransform: () => {},
            resize: buttonResizeStub,
            config: {
                shiftX: 0,
                shiftY: 0,
            },
            getHitAreaBounds: mockGetHitAreaBounds,
            sprite: {
                width: 200,
                height: 100,
            },
        })

        vPos = "middle";
        hPos = "center";
        jest.spyOn(CreateButton, "createButton").mockImplementation(mockCreateButton);
        jest.spyOn(a11y, "addButton").mockImplementation(() => {});
        GelGroup.prototype.addAt = jest.fn(child => group.list.push(child));
        GelGroup.prototype.setScrollFactor = jest.fn();
        group = new GelGroup(mockScene, parentGroup, vPos, hPos, metrics, false);
    });

    afterEach(() => jest.clearAllMocks());

    describe("constructor", () => {
        test("sets scrollFactor to zero to ignore camera movement", () => {
            expect(group.setScrollFactor).toHaveBeenCalledWith(0);
        });
    });

    describe("addButton method", () => {
        test("creates and returns new button", () => {
            const newButton = mockCreateButton(mockScene);
            jest.spyOn(CreateButton, "createButton").mockImplementation(() => newButton);

            expect(group.addButton(config)).toBe(newButton);
        });

        test("adds newly created button to the group", () => {
            const newButton = mockCreateButton(mockScene);
            jest.spyOn(CreateButton, "createButton").mockImplementation(() => newButton);

            group.addButton(config);
            expect(group.addAt).toHaveBeenCalledWith(newButton, 0);
        });

        test("aligns button accordingly", () => {
            vPos = "bottom";
            hPos = "center";
            group = new GelGroup(mockScene, parentGroup, vPos, hPos, metrics, false);

            group.addButton(config);
            group.addButton(config);

            expect(group._buttons[0].x).toBe(100);
            expect(group._buttons[1].x).toBe(350);
        });

        test("aligns center buttons accordingly", () => {
            group.addButton(config);
            group.addButton(config);

            group.reset(metrics);

            expect(group._buttons[0].y).toBe(50);
            expect(group._buttons[1].y).toBe(50);
        });

        test("aligns center buttons with respect to the largest button (after sorting buttons by height)", () => {
            group.addButton({ ...config, height: 70 });
            group.addButton({ ...config, height: 120 });
            group.addButton({ ...config, height: 10 });

            group.reset(metrics);

            expect(group._buttons[0].y).toBe(60);
            expect(group._buttons[1].y).toBe(60);
            expect(group._buttons[2].y).toBe(60);
        });

        describe("when vPos is middle and hPos is center", () => {
            test("sets group position correctly", () => {
                group.addButton(config);
                group.reset(metrics);

                expect(group.x).toBe(-100);
                expect(group.y).toBe(-50);
            });
        });

        describe("when vPos is middle, hPos is center and isVertical is true", () => {
            test("sets group position correctly", () => {
                vPos = "middle";
                hPos = "center";
                group = new GelGroup(mockScene, parentGroup, vPos, hPos, metrics, false, true);

                group.addButton(config);
                group.reset();

                expect(group.x).toBe(-100);
                expect(group.y).toBe(-50);
            });
        });

        describe("when vPos is middle, hPos is left or right", () => {
            test("sets group position correctly left", () => {
                vPos = "middle";
                hPos = "left";
                group = new GelGroup(mockScene, parentGroup, vPos, hPos, metrics, true, false);

                group.addButton(config);
                group.reset();

                expect(group.x).toBe(-300);
                expect(group.y).toBe(-50);
            });

            test("sets group position correctly right", () => {
                vPos = "middle";
                hPos = "right";
                group = new GelGroup(mockScene, parentGroup, vPos, hPos, metrics, true, true);

                group.addButton(config);
                group.reset();

                expect(group.x).toBe(100);
                expect(group.y).toBe(-50);
            });

            test("Aligns to the edges of the 4/3 area", () => {
                const testMetrics = {
                    horizontalBorderPad: 10,
                    stageWidth: 1400,
                    scale: 1,
                    safeHorizontals: {
                        left: -400,
                        right: 400,
                    },
                    verticals: {},
                };

                const leftGroup = new GelGroup(mockScene, parentGroup, "middle", "left", testMetrics, true, false);
                leftGroup.addButton(config);
                leftGroup.reset(testMetrics);

                const rightGroup = new GelGroup(mockScene, parentGroup, "middle", "right", testMetrics, true, false);
                rightGroup.addButton(config);
                rightGroup.reset(testMetrics);

                expect(leftGroup.x).toBe(-400);
                expect(rightGroup.x).toBe(400);
            });

            test("Aligns to the border pad if screen width overlaps the 4/3 area", () => {
                const testMetrics = {
                    horizontalBorderPad: 10,
                    stageWidth: 790,
                    scale: 1,
                    safeHorizontals: {
                        left: -400,
                        right: 400,
                    },
                    verticals: {},
                };

                const leftGroup = new GelGroup(mockScene, parentGroup, "middle", "left", testMetrics, true, false);
                leftGroup.addButton(config);
                leftGroup.reset(testMetrics);

                const rightGroup = new GelGroup(mockScene, parentGroup, "middle", "right", testMetrics, true, false);
                rightGroup.addButton(config);
                rightGroup.reset(testMetrics);

                expect(leftGroup.x).toBe(-385);
                expect(rightGroup.x).toBe(385);
            });
        });

        describe("when vPos is top and hPos is right", () => {
            test("sets group position correctly", () => {
                vPos = "top";
                hPos = "right";
                group = new GelGroup(mockScene, parentGroup, vPos, hPos, metrics, false);

                group.addButton(config);
                group.reset(metrics);

                expect(group.x).toBe(700);
                expect(group.y).toBe(-1400);
            });
        });

        describe("when vPos is bottom and hPos is left", () => {
            test("sets group position correctly", () => {
                vPos = "bottom";
                hPos = "left";
                group = new GelGroup(mockScene, parentGroup, vPos, hPos, metrics, false);

                group.addButton(config);
                group.reset(metrics);

                expect(group.x).toBe(-900);
                expect(group.y).toBe(1300);
            });
        });

        describe("when vPos is bottom and hPos is left and group is safe", () => {
            test("sets group position correctly", () => {
                vPos = "bottom";
                hPos = "left";
                group = new GelGroup(mockScene, parentGroup, vPos, hPos, metrics, true);

                group.addButton(config);
                group.reset(metrics);

                expect(group.x).toBe(-300);
                expect(group.y).toBe(1300);
            });
        });

        describe("when vPos is top and hPos is left", () => {
            it("correctly takes hitArea into account", () => {
                const leftSpy = jest.fn();
                const topSpy = jest.fn();
                const createButtonStub = jest.spyOn(CreateButton, "createButton");

                vPos = "top";
                hPos = "left";
                group = new GelGroup(mockScene, parentGroup, vPos, hPos, metrics);

                Object.defineProperty(group, "x", { set: leftSpy });
                Object.defineProperty(group, "y", { set: topSpy });

                createButtonStub.mockImplementation(() => ({
                    x: 50,
                    y: 50,
                    width: 50,
                    height: 50,
                    input: {
                        hitArea: {
                            left: 0,
                            top: 0,
                            width: 50,
                            height: 50,
                        },
                    },
                    config: {
                        shiftX: 0,
                        shiftY: 0,
                    },
                    updateIndicatorPosition: () => {},
                    updateTransform: () => {},
                    resize: buttonResizeStub,
                    getHitAreaBounds: mockGetHitAreaBounds,
                    sprite: { width: 100, height: 100 },
                }));

                group.addButton(config);

                createButtonStub.mockImplementation(() => ({
                    x: 50,
                    y: 50,
                    width: 50,
                    height: 50,
                    input: {
                        hitArea: {
                            left: -1000,
                            top: -1000,
                            width: 50,
                            height: 50,
                        },
                    },
                    config: {
                        shiftX: 0,
                        shiftY: 0,
                    },
                    updateIndicatorPosition: () => {},
                    updateTransform: () => {},
                    resize: buttonResizeStub,
                    getHitAreaBounds: mockGetHitAreaBounds,
                    sprite: { width: 100, height: 100 },
                }));

                group.addButton(config);
                group.reset(metrics);

                expect(leftSpy).toHaveBeenCalledWith(-900);
                expect(topSpy).toHaveBeenCalledWith(-1400);
            });
        });

        describe("when vPos is bottom and hPos is right", () => {
            test("correctly takes hitArea into account", () => {
                const createButtonStub = jest.spyOn(CreateButton, "createButton");
                group = new GelGroup(mockScene, parentGroup, "bottom", "right", metrics);

                createButtonStub.mockImplementation(() => ({
                    x: 50,
                    y: 50,
                    width: 50,
                    height: 50,
                    input: {
                        hitArea: { width: 200, height: 100 },
                    },
                    config: {
                        shiftX: 0,
                        shiftY: 0,
                    },
                    updateIndicatorPosition: () => {},
                    updateTransform: () => {},
                    resize: buttonResizeStub,
                    getHitAreaBounds: () => ({ y: -50, x: -100, width: 100, height: 50 }),
                    sprite: { width: 50, height: 50 },
                }));
                group.addButton(config);

                expect(group.x).toBe(775);
                expect(group.y).toBe(1325);
            });
        });
    });

    describe("addToGroup method", () => {
        test("adds item to this group", () => {
            const mockButton = {
                button: "mock",
                getHitAreaBounds: mockGetHitAreaBounds,
                sprite: { width: 200, height: 100 },
            };
            const mockPosition = 42;
            group.addToGroup(mockButton, mockPosition);
            expect(group.addAt).toHaveBeenCalledWith(mockButton, mockPosition);
        });

        test("adds item to this group at position 0 when no position provided", () => {
            const mockButton = {
                button: "mock",
                getHitAreaBounds: mockGetHitAreaBounds,
                sprite: { width: 200, height: 100 },
            };
            const expectedPosition = 0;
            group.addToGroup(mockButton);
            expect(group.addAt).toHaveBeenCalledWith(mockButton, expectedPosition);
        });
    });

    describe("getBoundingRect method", () => {
        test("returns a Phaser rectangle the same size as the group", () => {
            group.width = 200;
            group.height = 100;
            group.x = 10;
            group.y = 20;

            const boundingRect = group.getBoundingRect();
            expect(boundingRect.x).toEqual(10);
            expect(boundingRect.y).toEqual(20);
            expect(boundingRect.width).toEqual(200);
            expect(boundingRect.height).toEqual(100);
        });
    });

    describe("make accessible method", () => {
        test("adds each button in the group to the accessible buttons", () => {
            group.addButton(config);
            group.addButton(config);
            group.makeAccessible();

            expect(a11y.addButton).toHaveBeenCalledTimes(2);
        });
    });

    describe("reset method", () => {
        test("sets group position when resizing from desktop to desktop", () => {
            const expectedGroupXPosition = 0;
            const expectedGroupYPosition = -333;
            const desktopMetrics = { horizontals: {}, verticals: {} };
            const moreDesktopMetrics = {
                horizontalBorderPad: 0,
                verticalBorderPad: 0,
                horizontals: { center: 0 },
                verticals: { top: -333 },
                buttonPad: 0,
                scale: 1,
            };

            group = new GelGroup(mockScene, parentGroup, "top", "center", desktopMetrics, false);
            group.reset(moreDesktopMetrics);

            expect(group.x).toBe(expectedGroupXPosition);
            expect(group.y).toBe(expectedGroupYPosition);
        });

        test("resizes buttons after resizing the group and the width drops below the mobile breakpoint", () => {
            const desktopMetrics = { isMobile: false, horizontals: {}, verticals: {} };
            const mobileMetrics = { isMobile: true, horizontals: {}, verticals: {} };

            group = new GelGroup(mockScene, parentGroup, "bottom", "right", desktopMetrics, false);
            group.addButton(config);
            group.reset(mobileMetrics);

            expect(group._metrics.isMobile).toBe(true);
            expect(buttonResizeStub).toHaveBeenCalledTimes(2);
        });
    });

    describe("removeButton method", () => {
        test("calls destroy on passed in button", () => {
            const metrics = { horizontals: {}, verticals: {} };

            group = new GelGroup(mockScene, parentGroup, "top", "center", metrics, false);

            const destroySpy = jest.fn();
            group.removeButton({ destroy: destroySpy });

            expect(destroySpy).toHaveBeenCalled();
        });

        test("removes the button from _buttons", () => {
            const metrics = { horizontals: {}, verticals: {} };

            group = new GelGroup(mockScene, parentGroup, "top", "center", metrics, false);

            group.addButton({ key: "test_1", sprite: { width: 200 } });
            group.addButton({ key: "test_2" });
            group.addButton({ key: "test_3" });

            group._buttons[1].destroy = jest.fn();

            const button_0 = group._buttons[0];
            const button_1 = group._buttons[1];
            const button_2 = group._buttons[2];

            group.removeButton(button_1);

            expect(group._buttons.length).toBe(2);
            expect(group._buttons[0]).toBe(button_0);
            expect(group._buttons[1]).toBe(button_2);
        });
    });
});
