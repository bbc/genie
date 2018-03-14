import { assert } from "chai";
import * as sinon from "sinon";
import * as ButtonFactory from "../../../src/core/layout/button-factory";
import { calculateMetrics } from "../../../src/core/layout/calculate-metrics";
import { Group } from "../../../src/core/layout/group";

describe("Group", () => {
    const sandbox = sinon.sandbox.create();
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
        metrics = calculateMetrics(1920, 1080, 1, 1920);
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

            assert(group.addButton(config) === newButton);
        });

        it("adds newly created button to the group", () => {
            const newButton = buttonFactory.createButton();
            sandbox.stub(buttonFactory, "createButton").returns(newButton);

            group.addButton(config);
            assert(group.children.length === 1);
            assert(group.children[0] === newButton);
        });

        it("aligns button accordingly", () => {
            group.addButton(config);
            group.addButton(config);
            const expectedChildOneXPosition = 100;
            const expectedChildTwoXPosition = 324;

            assert(group.children[0].x === expectedChildOneXPosition);
            assert(group.children[1].x === expectedChildTwoXPosition);
        });

        describe("when vPos is middle and hPos is center", () => {
            it("sets group position correctly", () => {
                group.addButton(config);
                assert(group.x === 0);
                assert(group.y === 0);
            });
        });

        describe("when vPos is top and hPos is right", () => {
            it("sets group position correctly", () => {
                vPos = "top";
                hPos = "right";
                group = new Group(game, parentGroup, vPos, hPos, metrics, false);

                group.addButton(config);
                assert(group.x === 922);
                assert(group.y === -922);
            });
        });

        describe("when vPos is bottom and hPos is left", () => {
            it("sets group position correctly", () => {
                vPos = "bottom";
                hPos = "left";
                group = new Group(game, parentGroup, vPos, hPos, metrics, false);

                group.addButton(config);
                assert(group.x === -922);
                assert(group.y === 922);
            });
        });
    });

    describe("#addToGroup", () => {
        it("adds item to this group", () => {
            const mockButton = {
                anchor: {
                    setTo: (x, y) => {},
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
            const desktopMetrics = calculateMetrics(1920, 1080, 1, 1920);
            const moreDesktopMetrics = calculateMetrics(1366, 720, 1, 720);

            group = new Group(game, parentGroup, "top", "center", desktopMetrics, false);
            group.addButton(config);
            group.reset(moreDesktopMetrics);

            assert(group.x === expectedGroupXPosition);
            assert(group.y === expectedGroupYPosition);
        });

        it("resizes buttons after resizing the group and the width drops below the mobile breakpoint", () => {
            const desktopMetrics = calculateMetrics(1920, 1080, 1, 1920);
            const mobileMetrics = calculateMetrics(400, 600, 1, 600);

            group = new Group(game, parentGroup, "bottom", "right", desktopMetrics, false);
            group.addButton(config);
            group.reset(mobileMetrics);

            assert(group.getSizes().metrics.isMobile === true);
            sandbox.assert.calledOnce(buttonResizeStub);
        });

        it("does not resize buttons after resizing the group and the width remains above the mobile breakpoint", () => {
            const desktopMetrics = calculateMetrics(1920, 1080, 1, 1920);
            const moreDesktopMetrics = calculateMetrics(1366, 720, 1, 720);

            group = new Group(game, parentGroup, "top", "left", desktopMetrics, false);
            group.addButton(config);
            group.reset(moreDesktopMetrics);

            assert(group.getSizes().metrics.isMobile === false);
            sandbox.assert.notCalled(buttonResizeStub);
        });
    });
});
