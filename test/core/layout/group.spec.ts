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

    it("addButton() returns a GelButton", () => {
        return runInPreload(game =>
            loadAssets(game, gamePacks, gelPack, updateCallback).then(screenMap => {
                // when
                const mockViewportMetrics = calculateMetrics(200, 200, 1, 600);
                const parentGroup = new Phaser.Group(game, game.world, undefined);
                const group = new Group(game, parentGroup, "top", "left", mockViewportMetrics, false);

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

                // then
                assert(btn.constructor.name === "GelButton");
            }),
        );
    });

    it("addToGroup() set the anchor of the item that is passed in", () => {
        return runInPreload(game =>
            loadAssets(game, gamePacks, gelPack, updateCallback).then(screenMap => {
                // when
                const mockViewportMetrics = calculateMetrics(200, 200, 1, 600);
                const parentGroup = new Phaser.Group(game, game.world, undefined);
                const group = new Group(game, parentGroup, "top", "left", mockViewportMetrics, false);
                sandbox.stub(group, "addAt");

                // given
                const mockItem = { 
                    anchor: {
                        setTo: sinon.stub(),
                    },
                };
                group.addToGroup(mockItem, 0);

                // then
                sinon.assert.calledWith(mockItem.anchor.setTo, 0.5, 0.5);
            }),
        );
    });

    it("reset() sets the scale of the group to the inverse scale", () => {
        return runInPreload(game =>
            loadAssets(game, gamePacks, gelPack, updateCallback).then(screenMap => {
                // when
                const scale = 2;
                const invScale = 1 / scale;
                const mockViewportMetrics = calculateMetrics(200, 200, scale, 600);
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
