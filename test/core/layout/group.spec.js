import { assert } from "chai";
import * as sinon from "sinon";
import * as ButtonFactory from "../../../src/core/layout/button-factory";
import { Group } from "../../../src/core/layout/group";

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
    });
});
