import "babel-polyfill";
import { expect } from "chai";
import * as sinon from "sinon";
import { createAssetLoader, Pack, PackList, ScreenMap } from "src/core/asset-loader";
import { startup } from "src/core/startup";
import "src/lib/phaser";
import { installMockGetGmi, uninstallMockGetGmi } from "test/helpers/mock";

describe("empty", () => {
    beforeEach(installMockGetGmi);
    afterEach(uninstallMockGetGmi);
    it("callback", () => {
        const updateCallback = sinon.spy();
        return startup()
            .then(game => {
                const gamePacks: PackList = {
                    MASTER_PACK_KEY: { url: "asset-master-pack.json" },
                    GEL_PACK_KEY: { url: "gel/gel-pack.json" },
                };
                const loadscreenPack: Pack = {
                    key: "loadscreen",
                    url: "loader/loadscreen-pack.json",
                };
                return createAssetLoader(game, gamePacks, loadscreenPack, updateCallback);
            })
            .then((value: ScreenMap) => {
                sinon.assert.calledOnce(updateCallback);
            });
    });

    it("Works with promises", () => {
        return Promise.resolve(true).then(value => {
            expect(value).to.equal(true);
        });
    });
});
