import { assert } from "chai";
import * as sinon from "sinon";

import * as AssetLoader from "../../src/core/asset-loader.js";

describe("Asset Loader", () => {
    const sandbox = sinon.sandbox.create();

    let assetsLoaded;
    let fakeGame;
    let fakeGamePacksToLoad;
    let fakeLoadscreenPack;
    let fakeCallback;
    let nextLoadInQueue;

    beforeEach(() => {
        fakeGamePacksToLoad = {
            ["MasterAssetPack"]: { url: "asset-master-pack.json" },
            ["GelAssetPack"]: { url: "gel/gel-pack.json" },
        };
        fakeLoadscreenPack = { key: "loadscreen", url: "loader/loadscreen-pack.json" };
        fakeGame = {
            load: {
                onFileComplete: { add: sandbox.stub(), removeAll: sandbox.stub() },
                onLoadComplete: { add: sandbox.stub(), removeAll: sandbox.stub() },
                json: sandbox.stub(),
                pack: sandbox.stub(),
                totalQueuedPacks: sandbox.stub().returns(0),
                start: "start",
            },
            time: { events: { add: sandbox.stub() } },
            cache: { getJSON: sandbox.stub() },
            state: {
                states: {
                    __proto: {},
                    default: {},
                    "character-select": {},
                },
            },
        };
        fakeCallback = sandbox.stub();

        fakeGame.cache.getJSON.withArgs("MasterAssetPack").returns({
            howToPlay: [{ type: "image", key: "background", url: "background.png", overwrite: false }],
            pause: [{ type: "image", key: "title", url: "title.png", overwrite: false }],
        });
        fakeGame.cache.getJSON
            .withArgs("GelAssetPack")
            .returns({ gelDesktop: [{ type: "spritesheet", key: "achievements", url: "achievements.png" }] });
        fakeGame.cache.getJSON.withArgs("character-select").returns({
            "character-select": [
                { type: "image", key: "title", url: "title.png", overwrite: false },
                { type: "image", key: "background", url: "background.png", overwrite: false },
            ],
        });

        assetsLoaded = AssetLoader.loadAssets(fakeGame, fakeGamePacksToLoad, fakeLoadscreenPack, fakeCallback);

        nextLoadInQueue = fakeGame.load.onLoadComplete.add.getCall(0).args[0];
        nextLoadInQueue();
        nextLoadInQueue();
        nextLoadInQueue();
    });

    afterEach(() => {
        sandbox.restore();
    });

    it("loads all the game json files", () => {
        return assetsLoaded.then(() => {
            sandbox.assert.calledOnce(fakeGame.load.json.withArgs("MasterAssetPack", "asset-master-pack.json"));
            sandbox.assert.calledOnce(fakeGame.load.json.withArgs("GelAssetPack", "gel/gel-pack.json"));
        });
    });

    it("loads json files for missing screens", () => {
        return assetsLoaded.then(() => {
            sandbox.assert.calledOnce(fakeGame.load.json.withArgs("character-select", "character-select.json"));
        });
    });

    it("does not loads json files for __proto and default screens", () => {
        return assetsLoaded.then(() => {
            assert.isTrue(fakeGame.load.json.neverCalledWith("__proto"));
            assert.isTrue(fakeGame.load.json.neverCalledWith("default"));
        });
    });

    it("saves the json files to the game cache", () => {
        return assetsLoaded.then(() => {
            sandbox.assert.calledOnce(fakeGame.cache.getJSON.withArgs("MasterAssetPack"));
            sandbox.assert.calledOnce(fakeGame.cache.getJSON.withArgs("GelAssetPack"));
            sandbox.assert.calledOnce(fakeGame.cache.getJSON.withArgs("character-select"));
        });
    });

    it("loads the loadscreen json", () => {
        return assetsLoaded.then(() => {
            sandbox.assert.calledOnce(fakeGame.load.pack.withArgs("loadscreen", "loader/loadscreen-pack.json"));
        });
    });

    it("adds a game time event for each load iteration", () => {
        return assetsLoaded.then(() => {
            sandbox.assert.calledThrice(fakeGame.time.events.add.withArgs(0, fakeGame.load.start, fakeGame.load));
        });
    });

    it("updates the callback with the load progress so far", () => {
        return assetsLoaded.then(() => {
            sandbox.assert.calledOnce(fakeCallback.withArgs(100));
        });
    });

    it("returns the keyLookUps with correct screen prefixes when loading is complete", () => {
        const expectedLookUps = {
            howToPlay: {
                background: "howToPlay.background",
            },
            pause: {
                title: "pause.title",
            },
            gelDesktop: {
                achievements: "gelDesktop.achievements",
            },
            "character-select": {
                title: "character-select.title",
                background: "character-select.background",
            },
        };
        nextLoadInQueue();
        return assetsLoaded.then(keyLookUps => {
            assert.deepEqual(keyLookUps, expectedLookUps);
        });
    });

    it("clears all the files when loading is complete", () => {
        nextLoadInQueue();
        return assetsLoaded.then(() => {
            sandbox.assert.calledOnce(fakeGame.load.onLoadComplete.removeAll);
            sandbox.assert.calledOnce(fakeGame.load.onFileComplete.removeAll);
        });
    });
});
