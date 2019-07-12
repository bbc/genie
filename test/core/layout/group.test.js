/**
 * @copyright BBC 2018
 * @author BBC Children's D+E
 * @license Apache-2.0
 */
import * as ButtonFactory from "../../../src/core/layout/button-factory";
import { Group } from "../../../src/core/layout/group";

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

    beforeEach(() => {
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
            createButton: () => ({
                x: 50,
                y: 50,
                width: 200,
                height: 100,
                updateTransform: () => {},
                resize: buttonResizeStub,
                shiftX: 0,
                shiftY: 0,
            }),
        };
        vPos = "middle";
        hPos = "center";
        jest.spyOn(ButtonFactory, "create").mockImplementation(() => buttonFactory);
        group = new Group(game, parentGroup, vPos, hPos, metrics, false);
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

        describe("when vPos is top and hPos is left", () => {
            it("correctly takes hitArea into account", () => {
                const leftSpy = jest.fn();
                const topSpy = jest.fn();
                const createButtonStub = jest.spyOn(buttonFactory, "createButton");

                vPos = "top";
                hPos = "left";
                group = new Group(game, parentGroup, vPos, hPos, metrics);

                Object.defineProperty(group, "left", { set: leftSpy });
                Object.defineProperty(group, "top", { set: topSpy });

                createButtonStub.mockImplementation(() => ({
                    x: 50,
                    y: 50,
                    width: 50,
                    height: 50,
                    hitArea: {
                        left: 0,
                        top: 0,
                    },
                    updateTransform: () => {},
                    resize: buttonResizeStub,
                }));
                group.addButton(config);

                createButtonStub.mockImplementation(() => ({
                    x: 50,
                    y: 50,
                    width: 50,
                    height: 50,
                    hitArea: {
                        left: -1000,
                        top: -1000,
                    },
                    updateTransform: () => {},
                    resize: buttonResizeStub,
                }));
                group.addButton(config);
                group.reset(metrics);

                expect(leftSpy).toHaveBeenCalledWith(-25);
                expect(topSpy).toHaveBeenCalledWith(-425);
            });
        });

        describe("when vPos is bottom and hPos is right", () => {
            test("correctly takes hitArea into account", () => {
                const rightSpy = jest.fn();
                const bottomSpy = jest.fn();
                const createButtonStub = jest.spyOn(buttonFactory, "createButton");

                vPos = "bottom";
                hPos = "right";
                group = new Group(game, parentGroup, vPos, hPos, metrics);

                Object.defineProperty(group, "right", { set: rightSpy });
                Object.defineProperty(group, "bottom", { set: bottomSpy });

                createButtonStub.mockImplementation(() => ({
                    x: 50,
                    y: 50,
                    width: 50,
                    height: 50,
                    hitArea: {
                        right: 1000,
                        bottom: 1000,
                    },
                    updateTransform: () => {},
                    resize: buttonResizeStub,
                }));
                group.addButton(config);

                createButtonStub.mockImplementation(() => ({
                    x: 50,
                    y: 50,
                    width: 50,
                    height: 50,
                    hitArea: {
                        right: 0,
                        bottom: 0,
                    },
                    updateTransform: () => {},
                    resize: buttonResizeStub,
                }));
                group.addButton(config);

                group.reset(metrics);

                expect(rightSpy).toHaveBeenCalledWith(-125);
                expect(bottomSpy).toHaveBeenCalledWith(375);
            });
        });
    });

    describe("addToGroup method", () => {
        test("adds item to this group", () => {
            const mockButton = {
                anchor: {
                    setTo: (x, y) => {
                        x, y;
                    },
                },
                updateTransform: () => {},
            };
            group.addToGroup(mockButton);
            expect(group.children.length === 1).toBeTruthy();
            expect(group.children[0] === mockButton).toBeTruthy();
        });
    });

    describe("reset method", () => {
        test("sets group position when resizing from desktop to desktop", () => {
            const expectedGroupXPosition = 0;
            const expectedGroupYPosition = -333;
            const desktopMetrics = { horizontals: {}, verticals: {} };
            const moreDesktopMetrics = { borderPad: 0, horizontals: { center: 0 }, verticals: { top: -333 } };

            group = new Group(game, parentGroup, "top", "center", desktopMetrics, false);
            group.addButton(config);
            group.reset(moreDesktopMetrics);

            expect(group.x).toBe(expectedGroupXPosition);
            expect(group.y).toBe(expectedGroupYPosition);
        });

        test("resizes buttons after resizing the group and the width drops below the mobile breakpoint", () => {
            const desktopMetrics = { isMobile: false, horizontals: {}, verticals: {} };
            const mobileMetrics = { isMobile: true, horizontals: {}, verticals: {} };

            group = new Group(game, parentGroup, "bottom", "right", desktopMetrics, false);
            group.addButton(config);
            group.reset(mobileMetrics);

            expect(group._metrics.isMobile).toBe(true);
            expect(buttonResizeStub).toHaveBeenCalledTimes(1);
        });

        test("does not resize buttons after resizing the group and the width remains above the mobile breakpoint", () => {
            const desktopMetrics = { isMobile: false, horizontals: {}, verticals: {} };
            const moreDesktopMetrics = { isMobile: false, horizontals: {}, verticals: {} };

            group = new Group(game, parentGroup, "top", "left", desktopMetrics, false);
            group.addButton(config);
            group.reset(moreDesktopMetrics);

            expect(group._metrics.isMobile).toBe(false);
            expect(buttonResizeStub).not.toHaveBeenCalled();
        });
    });

    describe("removeButton method", () => {
        test("calls destroy on passed in button", () => {
            const metrics = { horizontals: {}, verticals: {} };

            group = new Group(game, parentGroup, "top", "center", metrics, false);

            const destroySpy = jest.fn();
            group.removeButton({ destroy: destroySpy });

            expect(destroySpy).toHaveBeenCalled();
        });

        test("removes the button from _buttons", () => {
            const metrics = { horizontals: {}, verticals: {} };

            group = new Group(game, parentGroup, "top", "center", metrics, false);

            group.addButton({ key: "test_1" });
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
