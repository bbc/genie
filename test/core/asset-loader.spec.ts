import "babel-polyfill";
import { expect } from "chai";
import * as sinon from "sinon";
import { loadAssets, Pack, PackList, ScreenMap } from "src/core/asset-loader";
import { startup } from "src/core/startup";
import "src/lib/phaser";
import { assetPacks } from "test/helpers/asset-packs";
import { assets } from "test/helpers/assets";
import { installMockGetGmi, uninstallMockGetGmi } from "test/helpers/mock";
import { PromiseTrigger } from "src/core/promise-utils";

describe("Asset Loader", () => {
    beforeEach(installMockGetGmi);
    afterEach(uninstallMockGetGmi);

    it("Should callback with 100% progress when 0 files are to be loaded in gamePacks.", () => {
        const updateCallback = sinon.spy();
        const gamePacks: PackList = {
            MASTER_PACK_KEY: { url: assetPacks.emptyAssetPack },
            GEL_PACK_KEY: { url: assetPacks.emptyAssetPack },
        };
        const loadscreenPack: Pack = {
            key: "loadscreen",
            url: assetPacks.loadscreenPack,
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

    it("Should be called 4 times (at 25% intervals) when 4 files are to be loaded in gamePacks.", () => {
        const updateCallback = sinon.spy();
        const gamePacks: PackList = {
            MASTER_PACK_KEY: { url: assetPacks.twoScreensThreeAssetsPack },
            GEL_PACK_KEY: { url: assetPacks.oneScreenOneAssetPack },
        };
        const loadscreenPack: Pack = {
            key: "loadscreen",
            url: assetPacks.loadscreenPack,
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
            MASTER_PACK_KEY: { url: assetPacks.twoScreensThreeAssetsPack },
            GEL_PACK_KEY: { url: assetPacks.oneScreenOneAssetPack },
        };
        const loadscreenPack: Pack = {
            key: "loadscreen",
            url: assetPacks.loadscreenPack,
        };
        return startup()
            .then(game => {
                return runInPreload(game, () => loadAssets(game, gamePacks, loadscreenPack, updateCallback));
            })
            .then((value: ScreenMap) => {
                expect(value).to.haveOwnProperty("screen1");
                expect(value).to.haveOwnProperty("screen2");
                expect(value).to.haveOwnProperty("screen");
                expect(value).to.not.haveOwnProperty("loadscreen");
            });
    });

    it("Should correctly namespace assets by their URL and return it in keyLookups.", () => {
        const updateCallback = sinon.spy();
        const gamePacks: PackList = {
            MASTER_PACK_KEY: { url: assetPacks.oneScreenOneAssetPack },
        };
        const loadscreenPack: Pack = {
            key: "loadscreen",
            url: assetPacks.loadscreenPack,
        };
        let theGame: Phaser.Game;
        return startup()
            .then(game => {
                theGame = game;
                return runInPreload(game, () => loadAssets(game, gamePacks, loadscreenPack, updateCallback));
            })
            .then((value: ScreenMap) => {
                expect(value.screen.one).to.equal(assets.imgUrlOnePixel);
                expect(theGame.cache.checkImageKey(value.screen.one)).to.equal(true);
            });
    });

    it("Should attempt to load assetPack JSON files that are missing and include them in keyLookups", () => {
        const updateCallback = sinon.spy();
        const loadSpy = sinon.spy();
        const getJSONStub = sinon.stub(Phaser.Cache, "JSON").callsFake((key: string, clone?: boolean | undefined) => {
            if (key === "test-screen") {
                return {
                    "test-screen": [{ type: "image", key: "test", url: assets.ship, overwrite: false }],
                };
            }
        });
        const gamePacks: PackList = {
            MASTER_PACK_KEY: { url: assetPacks.oneScreenOneAssetPack },
        };
        const loadscreenPack: Pack = {
            key: "loadscreen",
            url: assetPacks.loadscreenPack,
        };
        return startup()
            .then(game => {
                game.load.json = loadSpy;
                game.cache.getJSON = getJSONStub;
                game.state.add("test-screen", new Phaser.State());
                return runInPreload(game, () => loadAssets(game, gamePacks, loadscreenPack, updateCallback));
            })
            .then((value: ScreenMap) => {
                sinon.assert.calledWithExactly(loadSpy, "test-screen", "test-screen.json");
                expect(value["test-screen"].test).to.equal(assets.ship);
            });
    });
});

function runInPreload<T>(game: Phaser.Game, action: () => Promise<T>): Promise<T> {
    let promiseTrigger = new PromiseTrigger<T>();
    game.state.add(
        "loadscreen",
        class State extends Phaser.State {
            constructor() {
                super();
            }
            public preload() {
                promiseTrigger.resolve(action());
            }
        },
    );
    game.state.start("loadscreen");
    return promiseTrigger;
}
