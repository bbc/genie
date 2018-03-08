import { assert, expect } from "chai";
import * as sinon from "sinon";
import { loadAssets, Pack, PackList } from "../../../src/core/asset-loader";
import { assetPacks } from "../../helpers/asset-packs";
import * as mock from "../../helpers/mock";
import runInPreload from "../../helpers/run-in-preload";

import { calculateMetrics } from "../../../src/core/layout/calculate-metrics";
import Group from "../../../src/core/layout/group";

describe("Group", () => {

    const sandbox = sinon.sandbox.create();

    const updateCallback = sinon.spy();
    const gamePacks: PackList = {
        MASTER_PACK_KEY: { url: assetPacks.emptyAssetPack },
        GEL_PACK_KEY: { url: assetPacks.emptyAssetPack },
    };
    const gelPack: Pack = {
        key: "gel",
        url: assetPacks.gelButtonAssetPack,
    };

    beforeEach(mock.installMockGetGmi);

    afterEach(() => {
        mock.uninstallMockGetGmi();
        sandbox.restore();
    });

    it("addButton() creates a GelButton, adds it to the group and then returns it", () => {
        return runInPreload(game =>
            loadAssets(game, gamePacks, gelPack, updateCallback).then(screenMap => {
                // when
                const mockViewportMetrics = calculateMetrics(200, 200, 1, 200);
                const parentGroup = new Phaser.Group(game, game.world, undefined);
                const group = new Group(game, parentGroup, "bottom", "left", mockViewportMetrics, false);
                const addAtStub = sandbox.stub(group, "addAt");

                // given
                const mockConfig = {
                    exit: {
                        group: "topLeft",
                        title: "Exit",
                        key: "exit",
                        ariaLabel: "Exit Game",
                    },
                };
                const btn = group.addButton(mockConfig);
                const fakeObject = { };

                // then
                sinon.assert.calledWith(addAtStub, btn, 0);
                assert(btn.constructor.name === "GelButton");
            }),
        );
    });

    it("addButton() adds the created button to the group at a given position when the argument is provided", () => {
        return runInPreload(game =>
            loadAssets(game, gamePacks, gelPack, updateCallback).then(screenMap => {
                // when
                const mockViewportMetrics = calculateMetrics(400, 400, 2, 400);
                const parentGroup = new Phaser.Group(game, game.world, undefined);
                const group = new Group(game, parentGroup, "top", "right", mockViewportMetrics, false);
                const addAtStub = sandbox.stub(group, "addAt");

                // given
                const mockConfig = {
                    exit: {
                        group: "topLeft",
                        title: "Exit",
                        key: "exit",
                        ariaLabel: "Exit Game",
                    },
                };
                const btn = group.addButton(mockConfig, 2);
                const fakeObject = { };

                // then
                sinon.assert.calledWith(addAtStub, btn, 2);
                assert(btn.constructor.name === "GelButton");
            }),
        );
    });

    it("addToGroup() sets the anchor of the item that is passed in and adds the item to the group", () => {
        return runInPreload(game =>
            loadAssets(game, gamePacks, gelPack, updateCallback).then(screenMap => {
                // when
                const mockViewportMetrics = calculateMetrics(600, 600, 1, 450);
                const parentGroup = new Phaser.Group(game, game.world, undefined);
                const group = new Group(game, parentGroup, "top", "left", mockViewportMetrics, false);
                const addAtStub = sandbox.stub(group, "addAt");

                // given
                const mockItem = { 
                    anchor: {
                        setTo: sinon.stub(),
                    },
                };
                group.addToGroup(mockItem);

                // then
                sinon.assert.calledWith(mockItem.anchor.setTo, 0.5, 0.5);
                sinon.assert.calledWith(addAtStub, mockItem, 0);
            }),
        );
    });

    it("addToGroup() adds a button to the group at the given position when the argument is provided", () => {
        return runInPreload(game =>
            loadAssets(game, gamePacks, gelPack, updateCallback).then(screenMap => {
                // when
                const mockViewportMetrics = calculateMetrics(500, 350, 0.5, 350);
                const parentGroup = new Phaser.Group(game, game.world, undefined);
                const group = new Group(game, parentGroup, "top", "left", mockViewportMetrics, false);
                const addAtStub = sandbox.stub(group, "addAt");

                // given
                const mockItem = { 
                    anchor: {
                        setTo: sinon.stub(),
                    },
                };
                group.addToGroup(mockItem, 300);

                // then
                sinon.assert.calledWith(addAtStub, mockItem, 300);
            }),
        );
    });

    it("reset() sets the scale of the group to the inverse scale", () => {
        return runInPreload(game =>
            loadAssets(game, gamePacks, gelPack, updateCallback).then(screenMap => {
                // when
                const scale = 2;
                const invScale = 1 / scale;
                const mockViewportMetrics = calculateMetrics(750, 500, scale, 600);
                const parentGroup = new Phaser.Group(game, game.world, undefined);
                const group = new Group(game, parentGroup, "top", "left", mockViewportMetrics, false);
                const scaleSetToStub = sandbox.stub(group.scale, "setTo");

                // given
                group.reset(mockViewportMetrics);

                // then
                sinon.assert.calledWith(scaleSetToStub, invScale, invScale);
            }),
        );
    });
});
