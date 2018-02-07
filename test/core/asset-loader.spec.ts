import "babel-polyfill";
import "src/lib/phaser";

import { expect } from "chai";
import * as sinon from "sinon";
import { loadAssets, Pack, PackList, ScreenMap } from "src/core/asset-loader";
import { PromiseTrigger } from "src/core/promise-utils";
import { startup } from "src/core/startup";
import { assetPacks } from "test/helpers/asset-packs";
import { assets } from "test/helpers/assets";
import * as mock from "test/helpers/mock";
import { ScreenDef } from "src/core/sequencer";
import { Screen } from "src/core/screen";

describe("Asset Loader", () => {
    beforeEach(mock.installMockGetGmi);
    afterEach(mock.uninstallMockGetGmi);

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
        return startup([mock.screenDef()])
            .then(game => {
                return runInPreload(game, () => loadAssets(game, gamePacks, loadscreenPack, updateCallback));
            })
            .then((screenMap: ScreenMap) => {
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
        return startup([mock.screenDef()])
            .then(game => {
                return runInPreload(game, () => loadAssets(game, gamePacks, loadscreenPack, updateCallback));
            })
            .then((screenMap: ScreenMap) => {
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
        return startup([mock.screenDef()])
            .then(game => {
                return runInPreload(game, () => loadAssets(game, gamePacks, loadscreenPack, updateCallback));
            })
            .then((screenMap: ScreenMap) => {
                expect(screenMap).to.haveOwnProperty("screen1");
                expect(screenMap).to.haveOwnProperty("screen2");
                expect(screenMap).to.haveOwnProperty("screen");
                expect(screenMap).to.not.haveOwnProperty("loadscreen");
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
        return startup([mock.screenDef()])
            .then(game => {
                theGame = game;
                return runInPreload(game, () => loadAssets(game, gamePacks, loadscreenPack, updateCallback));
            })
            .then((screenMap: ScreenMap) => {
                expect(screenMap.screen.one).to.equal(assets.imgUrlOnePixel);
                expect(theGame.cache.checkImageKey(screenMap.screen.one)).to.equal(true);
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
        return startup([mock.screenDef()])
            .then(game => {
                game.load.json = loadSpy;
                game.cache.getJSON = getJSONStub;
                game.state.add("test-screen", new Phaser.State());
                return runInPreload(game, () => loadAssets(game, gamePacks, loadscreenPack, updateCallback));
            })
            .then((screenMap: ScreenMap) => {
                sinon.assert.calledWithExactly(loadSpy, "test-screen", "test-screen.json");
                expect(screenMap["test-screen"].test).to.equal(assets.ship);
            });
    });
});

function runInPreload<T>(game: Phaser.Game, action: () => Promise<T>): Promise<T> {
    const promiseTrigger = new PromiseTrigger<T>();
    game.state.add(
        "loadscreen",
        new class extends Phaser.State {
            public preload() {
                promiseTrigger.resolve(action());
            }
        }(),
    );
    game.state.start("loadscreen");
    return promiseTrigger;
}
