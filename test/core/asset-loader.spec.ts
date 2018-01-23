import "babel-polyfill";
import { expect } from "chai";
import * as sinon from "sinon";
import { loadAssets, Pack, PackList, ScreenMap } from "src/core/asset-loader";
import { startup } from "src/core/startup";
import "src/lib/phaser";
import { assetPacks } from "test/helpers/asset-packs";
import { installMockGetGmi, uninstallMockGetGmi } from "test/helpers/mock";

describe("Asset Loader - Update Callback and Promise", () => {
    beforeEach(installMockGetGmi);
    afterEach(uninstallMockGetGmi);

    it("Should call 100% when 0 files are to be loaded in gamePacks.", () => {
        const updateCallback = sinon.spy();
        const gamePacks: PackList = {
            MASTER_PACK_KEY: { url: assetPacks.emptyAssetPack },
            GEL_PACK_KEY: { url: assetPacks.emptyAssetPack },
        };
        const loadscreenPack: Pack = {
            key: "screen1",
            url: assetPacks.oneScreenOneAssetPack,
        };
        return startup()
            .then(game => {
                return runInPreload(game, () => loadAssets(game, gamePacks, loadscreenPack, updateCallback));
            })
            .then((value: ScreenMap) => {
                sinon.assert.calledOnce(updateCallback);
                sinon.assert.alwaysCalledWithExactly(updateCallback, 100);
            });
    });

    it("Should be called 4 times when 4 files are to be loaded in gamePacks.", () => {
        const updateCallback = sinon.spy();
        const gamePacks: PackList = {
            MASTER_PACK_KEY: { url: assetPacks.twoScreensFourAssetsPack },
        };
        const loadscreenPack: Pack = {
            key: "screen1",
            url: assetPacks.oneScreenOneAssetPack,
        };
        return startup()
            .then(game => {
                return runInPreload(game, () => loadAssets(game, gamePacks, loadscreenPack, updateCallback));
            })
            .then((value: ScreenMap) => {
                sinon.assert.callOrder(
                    updateCallback.withArgs(25),
                    updateCallback.withArgs(50),
                    updateCallback.withArgs(75),
                    updateCallback.withArgs(100),
                );
                sinon.assert.callCount(updateCallback, 4);
            });
    });

    it("Should resolve the returned Promise with keyLookups for each gamePack screen.", () => {
        const updateCallback = sinon.spy();
        const gamePacks: PackList = {
            MASTER_PACK_KEY: { url: assetPacks.twoScreensFourAssetsPack },
        };
        const loadscreenPack: Pack = {
            key: "screen1",
            url: assetPacks.oneScreenOneAssetPack,
        };
        return startup()
            .then(game => {
                return runInPreload(game, () => loadAssets(game, gamePacks, loadscreenPack, updateCallback));
            })
            .then((value: ScreenMap) => {
                expect(value).to.haveOwnProperty("screen1");
                expect(value).to.haveOwnProperty("screen2");
            });
    });
});

function runInPreload<T>(game: Phaser.Game, action: () => Promise<T>): Promise<T> {
    let doResolve: (value: Promise<T>) => void;
    game.state.add(
        "load",
        class State extends Phaser.State {
            constructor() {
                super();
            }
            public preload() {
                doResolve(action());
            }
        },
    );
    game.state.start("load");
    return new Promise<T>(resolve => {
        doResolve = resolve;
    });
}
