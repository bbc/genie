import { expect } from "chai";
import * as sinon from "sinon";

import { Loadscreen } from "../../src/components/loadscreen";
import * as AssetLoader from "../../src/core/asset-loader";
import { GameAssets } from "../../src/core/game-assets.js";

describe("Load Screen", () => {
    let loadScreen;
    let musicLoopStub;
    let mockGame;
    let mockNext;
    let addLookupsSpy;
    let assetLoaderSpy;
    let assetLoaderCallbackSpy;

    const sandbox = sinon.sandbox.create();

    beforeEach(() => {
        addLookupsSpy = sandbox.spy();
        assetLoaderCallbackSpy = sandbox.spy();
        assetLoaderSpy = sandbox.stub(AssetLoader, "loadAssets").returns({ then: assetLoaderCallbackSpy });
        musicLoopStub = sandbox.stub();
        musicLoopStub.withArgs("shared/background-music").returns({
            loopFull: sandbox.spy(),
        });
        musicLoopStub.returns({});

        mockGame = {
            add: {
                audio: musicLoopStub,
            },
            state: {
                current: "currentState",
            },
        };
        mockNext = sandbox.spy();

        loadScreen = new Loadscreen();
        loadScreen.scene = {
            addLookups: addLookupsSpy,
            keyLookups: {
                currentState: {
                    backgroundMusic: "backgroundMusic",
                },
                gel: "thisIsGel",
                background: "backgroundImage",
                title: "titleImage",
            },
        };
        loadScreen.game = mockGame;
        loadScreen.next = mockNext;
    });

    afterEach(() => {
        sandbox.restore();
    });

    describe("preload method", () => {
        it("calls the asset loader with correct params", () => {
            const expectedGamePacks = {
                ["MasterAssetPack"]: { url: "asset-master-pack.json" },
                ["GelAssetPack"]: { url: "gel/gel-pack.json" },
            };
            const expectedLoadscreenPack = { key: "loadscreen", url: "loader/loadscreen-pack.json" };

            const expectedUpdateLoadProgress = sandbox.spy();
            loadScreen.updateLoadProgress = expectedUpdateLoadProgress;
            loadScreen.preload();

            expect(assetLoaderSpy.args[0][0]).to.eql(mockGame);
            expect(assetLoaderSpy.args[0][1]).to.eql(expectedGamePacks);
            expect(assetLoaderSpy.args[0][2]).to.eql(expectedLoadscreenPack);

            assetLoaderSpy.args[0][3]();
            expect(expectedUpdateLoadProgress.called).to.equal(true);
        });

        it("handles the returned promise", () => {
            loadScreen.preload();
            expect(assetLoaderCallbackSpy.called).to.equal(true);
        });

        it("adds keylookups to the layout when the promise is resolved", () => {
            const expectedKeyLookups = { gel: { play: "gel/play.png" } };

            loadScreen.context = { qaMode: { active: false } };
            loadScreen.preload();

            assetLoaderCallbackSpy.args[0][0](expectedKeyLookups);
            expect(addLookupsSpy.args[0][0]).to.eql(expectedKeyLookups);
        });

        it("moves to the next screen when the promise is resolved", () => {
            loadScreen.context = { qaMode: { active: false } };
            loadScreen.preload();

            assetLoaderCallbackSpy.args[0][0]();
            expect(mockNext.called).to.equal(true);
        });
    });

    describe("qaMode", () => {
        let consoleSpy;

        beforeEach(() => {
            consoleSpy = sandbox.spy(console, "log");
        });

        it("logs the progress to the console when qaMode is true", () => {
            loadScreen.context = { qaMode: { active: true } };
            loadScreen.updateLoadProgress("50%");
            expect(consoleSpy.args[0]).to.eql(["Loader progress:", "50%"]);
        });

        it("logs the loaded assets to the console when qaMode is true", () => {
            const expectedKeyLookups = { gel: { play: "gel/play.png" }, home: { title: "shared/title.png" } };
            const expectedOutput =
                "Loaded assets:\n    gel:\n        play: gel/play.png\n    home:\n        title: shared/title.png";

            loadScreen.context = { qaMode: { active: true } };
            loadScreen.preload();

            assetLoaderCallbackSpy.args[0][0](expectedKeyLookups);
            expect(consoleSpy.args[0][0]).to.equal(expectedOutput);
        });
    });

    describe("Music", () => {
        it("starts playing the music", () => {
            sinon.assert.calledOnce(GameAssets.sounds.backgroundMusic.loopFull);
        });
    });
});
