// @ts-ignore
import * as fp from "lodash/fp";

import { assert } from "chai";
import { loadAssets, Pack, PackList } from "../../../src/core/asset-loader";
import { assetPacks } from "../../helpers/asset-packs";
import * as mock from "../../helpers/mock";
import runInPreload from "../../helpers/run-in-preload";

import { GelButton } from "../../../src/core/layout/gel-button";

import * as sinon from "sinon";

describe("Layout - Gel Button", () => {
    beforeEach(mock.installMockGetGmi);
    afterEach(mock.uninstallMockGetGmi);

    it("Should swap mobile and desktop assets when resized.", () => {
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
                const btn = new GelButton(game, 0, 0, true, "play");

                assert(btn.key === "gel/mobile/play.png");

                btn.resize({ isMobile: false } as any);
                assert(btn.key === "gel/desktop/play.png");

                btn.resize({ isMobile: true } as any);
                assert(btn.key === "gel/mobile/play.png");
            }),
        );
    });

    it("Should be centered.", () => {
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
                const btn = new GelButton(game, 0, 0, true, "play");
                assert(fp.isEqual(btn.anchor, new Phaser.Point(0.5, 0.5)));
            }),
        );
    });
});
