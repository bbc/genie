import { assert } from "chai";
import * as sinon from "sinon";
//import { loadAssets, Pack, PackList } from "../../../src/core/asset-loader";
import * as ButtonFactory from "../../../src/core/layout/button-factory";
//import { assetPacks } from "../../helpers/asset-packs";
//import * as mock from "../../helpers/mock";
//import runInPreload from "../../helpers/run-in-preload";

import { calculateMetrics } from "../../../src/core/layout/calculate-metrics";
import Group from "../../../src/core/layout/group";

describe("Group", () => {
    const sandbox = sinon.sandbox.create();
    let buttonFactory;
    let game;
    let parentGroup;
    let metrics;
    let group;
    let config;
    let vPos;
    let hPos;

    beforeEach(() => {
        game = new Phaser.Game();
        parentGroup = new Phaser.Group(game);
        config = {};
        metrics = calculateMetrics(1920, 1080, 1, 1920);
        buttonFactory = {
            createButton: () => {
                return {
                    x: 50,
                    y: 50,
                    width: 200,
                    height: 100,
                    updateTransform: () => {},
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

    //it("addToGroup() sets the anchor of the item that is passed in and adds the item to the group", () => {
    //    return runInPreload(game =>
    //        loadAssets(game, gamePacks, gelPack, updateCallback).then(screenMap => {
    //            // when
    //            const mockViewportMetrics = calculateMetrics(600, 600, 1, 450);
    //            const parentGroup = new Phaser.Group(game, game.world, undefined);
    //            const group = new Group(game, parentGroup, "top", "left", mockViewportMetrics, false);
    //            const addAtStub = sandbox.stub(group, "addAt");

    //            // given
    //            const mockItem = { 
    //                anchor: {
    //                    setTo: sinon.stub(),
    //                },
    //            };
    //            group.addToGroup(mockItem);

    //            // then
    //            sinon.assert.calledWith(mockItem.anchor.setTo, 0.5, 0.5);
    //            sinon.assert.calledWith(addAtStub, mockItem, 0);
    //        }),
    //    );
    //});

    //it("addToGroup() adds a button to the group at the given position when the argument is provided", () => {
    //    return runInPreload(game =>
    //        loadAssets(game, gamePacks, gelPack, updateCallback).then(screenMap => {
    //            // when
    //            const mockViewportMetrics = calculateMetrics(500, 350, 0.5, 350);
    //            const parentGroup = new Phaser.Group(game, game.world, undefined);
    //            const group = new Group(game, parentGroup, "top", "left", mockViewportMetrics, false);
    //            const addAtStub = sandbox.stub(group, "addAt");

    //            // given
    //            const mockItem = { 
    //                anchor: {
    //                    setTo: sinon.stub(),
    //                },
    //            };
    //            group.addToGroup(mockItem, 300);

    //            // then
    //            sinon.assert.calledWith(addAtStub, mockItem, 300);
    //        }),
    //    );
    //});

    //it("reset() sets the scale of the group to the inverse scale", () => {
    //    return runInPreload(game =>
    //        loadAssets(game, gamePacks, gelPack, updateCallback).then(screenMap => {
    //            // when
    //            const scale = 2;
    //            const invScale = 1 / scale;
    //            const mockViewportMetrics = calculateMetrics(750, 500, scale, 600);
    //            const parentGroup = new Phaser.Group(game, game.world, undefined);
    //            const group = new Group(game, parentGroup, "top", "left", mockViewportMetrics, false);
    //            const scaleSetToStub = sandbox.stub(group.scale, "setTo");

    //            // given
    //            group.reset(mockViewportMetrics);

    //            // then
    //            sinon.assert.calledWith(scaleSetToStub, invScale, invScale);
    //        }),
    //    );
    //});
});
