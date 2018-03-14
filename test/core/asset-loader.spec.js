import "babel-polyfill";
import "../../src/lib/phaser.js";

import { expect } from "chai";
import * as sinon from "sinon";
import { loadAssets } from "../../src/core/asset-loader";
import { Screen } from "../../src/core/screen";
import { startup } from "../../src/core/startup";
import { assetPacks } from "../helpers/asset-packs";
import { assets } from "../helpers/assets";
import * as mock from "../helpers/mock";

describe("Asset Loader", () => {
    beforeEach(mock.installMockGetGmi);
    afterEach(mock.uninstallMockGetGmi);

    it("Should callback with 100% progress when 0 files are to be loaded in gamePacks.", () => {
        const updateCallback = sinon.spy();
        const gamePacks = {
            MASTER_PACK_KEY: { url: assetPacks.emptyAssetPack },
            GEL_PACK_KEY: { url: assetPacks.emptyAssetPack },
        };
        const loadscreenPack = {
            key: "loadscreen",
            url: assetPacks.loadscreenPack,
        };
        return runInPreload(game =>
            loadAssets(game, gamePacks, loadscreenPack, updateCallback).then(screenMap => {
                sinon.assert.calledOnce(updateCallback);
                sinon.assert.alwaysCalledWithExactly(updateCallback, 100);
            }),
        );
    });

    it("Should be called 4 times (at 25% intervals) when 4 files are to be loaded in gamePacks.", () => {
        const updateCallback = sinon.spy();
        const gamePacks = {
            MASTER_PACK_KEY: { url: assetPacks.twoScreensThreeAssetsPack },
            GEL_PACK_KEY: { url: assetPacks.oneScreenOneAssetPack },
        };
        const loadscreenPack = {
            key: "loadscreen",
            url: assetPacks.loadscreenPack,
        };
        return runInPreload(game =>
            loadAssets(game, gamePacks, loadscreenPack, updateCallback).then(screenMap => {
                sinon.assert.callOrder(
                    updateCallback.withArgs(25),
                    updateCallback.withArgs(50),
                    updateCallback.withArgs(75),
                    updateCallback.withArgs(100),
                );
                sinon.assert.callCount(updateCallback, 4);
            }),
        );
    });

    it("Should resolve the returned Promise with keyLookups for each gamePack screen.", () => {
        const updateCallback = sinon.spy();
        const gamePacks = {
            MASTER_PACK_KEY: { url: assetPacks.twoScreensThreeAssetsPack },
            GEL_PACK_KEY: { url: assetPacks.oneScreenOneAssetPack },
        };
        const loadscreenPack = {
            key: "loadscreen",
            url: assetPacks.loadscreenPack,
        };
        return runInPreload(game =>
            loadAssets(game, gamePacks, loadscreenPack, updateCallback).then(screenMap => {
                expect(screenMap).to.haveOwnProperty("screen1");
                expect(screenMap).to.haveOwnProperty("screen2");
                expect(screenMap).to.haveOwnProperty("screen");
                expect(screenMap).to.not.haveOwnProperty("loadscreen");
            }),
        );
    });

    it("Should correctly namespace assets by their URL and return it in keyLookups.", () => {
        const updateCallback = sinon.spy();
        const gamePacks = {
            MASTER_PACK_KEY: { url: assetPacks.oneScreenOneAssetPack },
        };
        const loadscreenPack = {
            key: "loadscreen",
            url: assetPacks.loadscreenPack,
        };
        return runInPreload(game => {
            return loadAssets(game, gamePacks, loadscreenPack, updateCallback).then(screenMap => {
                // @ts-ignore - skip error due to type inference. TODO - remove this line after conversion to js
                expect(screenMap.screen.one).to.equal(assets.imgUrlOnePixel);
                // @ts-ignore - skip error due to type inference. TODO - remove this line after conversion to js
                expect(game.cache.checkImageKey(screenMap.screen.one)).to.equal(true);
            });
        });
    });

    it("Should attempt to load assetPack JSON files that are missing and include them in keyLookups", () => {
        const updateCallback = sinon.spy();
        const loadSpy = sinon.spy();
        const getJSONStub = sinon.stub(Phaser.Cache, "JSON").callsFake((key, clone) => {
            if (key === "test-screen") {
                return {
                    "test-screen": [{ type: "image", key: "test", url: assets.ship, overwrite: false }],
                };
            }
        });
        const gamePacks = {
            MASTER_PACK_KEY: { url: assetPacks.oneScreenOneAssetPack },
        };
        const loadscreenPack = {
            key: "loadscreen",
            url: assetPacks.loadscreenPack,
        };
        return runInPreload(game => {
            game.load.json = loadSpy;
            game.cache.getJSON = getJSONStub;
            game.state.add("test-screen", new Phaser.State());
            return loadAssets(game, gamePacks, loadscreenPack, updateCallback).then(screenMap => {
                sinon.assert.calledWithExactly(loadSpy, "test-screen", "test-screen.json");
                expect(screenMap["test-screen"].test).to.equal(assets.ship);
            });
        });
    });
});

/**
 * Wraps a test in asynchronous Phaser setup and shutdown code, and runs it in the preload phase of the first state.
 * @param action Function to run the tests, returning a promise.
 */
function runInPreload(action) {
    let testState;

    const promisedTest = new Promise((resolve, reject) => {
        testState = new class extends Screen {
            preload() {
                resolve(action(this.game));
            }
        }();
    });

    const transitions = [
        {
            name: "loadscreen",
            state: testState,
            nextScreenName: () => "loadscreen",
        },
    ];
    return startup(transitions)
        .then(game => promisedTest.then(() => game))
        .then(game => game.destroy());
}
