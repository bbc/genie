/**
 * @copyright BBC 2018
 * @author BBC Children's D+E
 * @license Apache-2.0
 */
import { assert } from "chai";
import * as sinon from "sinon";
import * as ButtonFactory from "../../../src/core/layout/button-factory";
import { Group } from "../../../src/core/layout/group";
import * as buttonOverrides from "../../../src/core/layout/button-overrides.js";

describe("Group", () => {
    const sandbox = sinon.createSandbox();
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
        game = sandbox.stub();
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
        buttonResizeStub = sandbox.stub();
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
        sandbox.stub(ButtonFactory, "create").returns(buttonFactory);
        group = new Group(game, parentGroup, vPos, hPos, metrics, false);
        sandbox.stub(group, "width").returns(1000);
    });

    afterEach(() => {
        sandbox.restore();
    });

    describe("#addButton", () => {
        it("creates and returns new button", () => {
            const newButton = buttonFactory.createButton();
            sandbox.stub(buttonFactory, "createButton").returns(newButton);

            assert.strictEqual(group.addButton(config), newButton);
        });

        it("adds newly created button to the group", () => {
            const newButton = buttonFactory.createButton();
            sandbox.stub(buttonFactory, "createButton").returns(newButton);

            group.addButton(config);
            assert.strictEqual(group.children.length, 1);
            assert.strictEqual(group.children[0], newButton);
        });

        it("aligns button accordingly", () => {
            vPos = "bottom";
            hPos = "center";
            group = new Group(game, parentGroup, vPos, hPos, metrics, false);

            group.addButton(config);
            group.addButton(config);

            assert.strictEqual(group.children[0].x, 100);
            assert.strictEqual(group.children[1].x, 350);
        });

        it("aligns center buttons accordingly", () => {
            group.addButton(config);
            group.addButton(config);
            group.reset(metrics);

            assert.strictEqual(group.children[0].y, 0);
            assert.strictEqual(group.children[1].y, 0);
        });

        describe("when vPos is middle and hPos is center", () => {
            it("sets group position correctly", () => {
                group.addButton(config);
                group.reset(metrics);
                assert.strictEqual(group.x, 0);
                assert.strictEqual(group.y, 0);
            });
        });

        describe("when vPos is top and hPos is right", () => {
            it("sets group position correctly", () => {
                vPos = "top";
                hPos = "right";
                group = new Group(game, parentGroup, vPos, hPos, metrics, false);

                group.addButton(config);
                group.reset(metrics);
                assert.strictEqual(group.x, 900);
                assert.strictEqual(group.y, -1400);
            });
        });

        describe("when vPos is bottom and hPos is left", () => {
            it("sets group position correctly", () => {
                vPos = "bottom";
                hPos = "left";
                group = new Group(game, parentGroup, vPos, hPos, metrics, false);

                group.addButton(config);
                group.reset(metrics);
                assert.strictEqual(group.x, -900);
                assert.strictEqual(group.y, 1400);
            });
        });

        describe("when vPos is bottom and hPos is left and group is safe", () => {
            it("sets group position correctly", () => {
                vPos = "bottom";
                hPos = "left";
                group = new Group(game, parentGroup, vPos, hPos, metrics, true);

                group.addButton(config);
                group.reset(metrics);
                assert.strictEqual(group.x, -200);
                assert.strictEqual(group.y, 1400);
            });
        });

        describe("when vPos is top and hPos is left", () => {
            it("correctly takes hitArea into account", () => {
                const leftSpy = sandbox.spy(Group.prototype, "left", ["set"]);
                const topSpy = sandbox.spy(Group.prototype, "top", ["set"]);
                const createButtonStub = sandbox.stub(buttonFactory, "createButton");

                vPos = "top";
                hPos = "left";
                group = new Group(game, parentGroup, vPos, hPos, metrics);

                createButtonStub.returns({
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
                });
                group.addButton(config);

                createButtonStub.returns({
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
                });
                group.addButton(config);

                group.reset(metrics);

                sinon.assert.calledOnce(leftSpy.set);
                sinon.assert.calledOnce(topSpy.set);

                sinon.assert.calledWithExactly(leftSpy.set, -25);
                sinon.assert.calledWithExactly(topSpy.set, -425);
            });
        });

        describe("when vPos is bottom and hPos is right", () => {
            it("correctly takes hitArea into account", () => {
                const rightSpy = sandbox.spy(Group.prototype, "right", ["set"]);
                const bottomSpy = sandbox.spy(Group.prototype, "bottom", ["set"]);
                const createButtonStub = sandbox.stub(buttonFactory, "createButton");

                vPos = "bottom";
                hPos = "right";
                group = new Group(game, parentGroup, vPos, hPos, metrics);

                createButtonStub.returns({
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
                });
                group.addButton(config);

                createButtonStub.returns({
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
                });
                group.addButton(config);

                group.reset(metrics);

                sinon.assert.calledOnce(rightSpy.set);
                sinon.assert.calledOnce(bottomSpy.set);

                sinon.assert.calledWithExactly(rightSpy.set, -125);
                sinon.assert.calledWithExactly(bottomSpy.set, 375);
            });
        });
    });

    describe("#addToGroup", () => {
        it("adds item to this group", () => {
            const mockButton = {
                anchor: {
                    setTo: (x, y) => {
                        x, y;
                    },
                },
                updateTransform: () => {},
            };
            group.addToGroup(mockButton);
            assert(group.children.length === 1);
            assert(group.children[0] === mockButton);
        });
    });

    describe("#reset", () => {
        it("sets group position when resizing from desktop to desktop", () => {
            const expectedGroupXPosition = 0;
            const expectedGroupYPosition = -333;
            const desktopMetrics = { horizontals: {}, verticals: {} };
            const moreDesktopMetrics = { borderPad: 0, horizontals: { center: 0 }, verticals: { top: -333 } };

            group = new Group(game, parentGroup, "top", "center", desktopMetrics, false);
            group.addButton(config);
            group.reset(moreDesktopMetrics);

            assert.strictEqual(group.x, expectedGroupXPosition);
            assert.strictEqual(group.y, expectedGroupYPosition);
        });

        it("resizes buttons after resizing the group and the width drops below the mobile breakpoint", () => {
            const desktopMetrics = { isMobile: false, horizontals: {}, verticals: {} };
            const mobileMetrics = { isMobile: true, horizontals: {}, verticals: {} };

            group = new Group(game, parentGroup, "bottom", "right", desktopMetrics, false);
            group.addButton(config);
            group.reset(mobileMetrics);

            assert.strictEqual(group._metrics.isMobile, true);
            sandbox.assert.calledOnce(buttonResizeStub);
        });

        it("does not resize buttons after resizing the group and the width remains above the mobile breakpoint", () => {
            const desktopMetrics = { isMobile: false, horizontals: {}, verticals: {} };
            const moreDesktopMetrics = { isMobile: false, horizontals: {}, verticals: {} };

            group = new Group(game, parentGroup, "top", "left", desktopMetrics, false);
            group.addButton(config);
            group.reset(moreDesktopMetrics);

            assert(group._metrics.isMobile === false);
            sandbox.assert.notCalled(buttonResizeStub);
        });

        it("calls applyButtonOverrides function with correct args", () => {
            const applyButtonOverrides = sandbox.spy(buttonOverrides, "applyButtonOverrides");
            group.addButton(config);
            group.reset(metrics);
            sandbox.assert.calledOnce(applyButtonOverrides.withArgs(metrics.scale, group._buttons));
        });
    });
});
