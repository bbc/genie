import { assert } from "chai";
import * as sinon from "sinon";
import { loadAssets, Pack, PackList } from "../../../src/core/asset-loader";
import { assetPacks } from "../../helpers/asset-packs";
import * as mock from "../../helpers/mock";
import runInPreload from "../../helpers/run-in-preload";

import { calculateMetrics } from "../../../src/core/layout/calculate-metrics";
import Group from "../../../src/core/layout/group";

describe("Group", () => {

    beforeEach(mock.installMockGetGmi);
    afterEach(mock.uninstallMockGetGmi);

    it("can have a button added to it", () => {
        const updateCallback = sinon.spy();
        const gamePacks: PackList = {
            MASTER_PACK_KEY: { url: assetPacks.emptyAssetPack },
            GEL_PACK_KEY: { url: assetPacks.emptyAssetPack },
        };
        const gelPack: Pack = {
            key: "gel",
            url: assetPacks.gelButtonAssetPack,
        };

        return runInPreload(game =>
            loadAssets(game, gamePacks, gelPack, updateCallback).then(screenMap => {
                // write test here
                const mockViewportMetrics = calculateMetrics(200, 200, 1, 600);
                const parentGroup = new Phaser.Group(game, game.world, undefined);
                const group = new Group(game, parentGroup, "top", "left", mockViewportMetrics, false);
            }),
        );
        //let group = new Group(mockGame, mockParentGroup, "0", "0", mockMetrics, false);
    });
});
