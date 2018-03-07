import { assert } from "chai";
import * as sinon from "sinon";
import { loadAssets, Pack, PackList } from "../../../src/core/asset-loader";
import { assetPacks } from "../../helpers/asset-packs";
import * as mock from "../../helpers/mock";
import runInPreload from "../../helpers/run-in-preload";

import { calculateMetrics } from "../../../src/core/layout/calculate-metrics";
import Group from "../../../src/core/layout/group";

describe("Group", () => {

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
    afterEach(mock.uninstallMockGetGmi);

    it("addButton() returns a GelButton", () => {
        return runInPreload(game =>
            loadAssets(game, gamePacks, gelPack, updateCallback).then(screenMap => {
                // when
                const mockViewportMetrics = calculateMetrics(200, 200, 1, 600);
                const parentGroup = new Phaser.Group(game, game.world, undefined);
                const group = new Group(game, parentGroup, "top", "left", mockViewportMetrics, false);

                // given
                let mockConfig = {
                    exit: {
                        group: "topLeft",
                        title: "Exit",
                        key: "exit",
                        ariaLabel: "Exit Game",
                    },
                };
                let btn = group.addButton(mockConfig);

                // then
                assert(btn.constructor.name === "GelButton");
            }),
        );
    });
});
