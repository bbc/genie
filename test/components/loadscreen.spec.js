import { expect, assert } from "chai";
import * as sinon from "sinon";

import { Loadscreen } from "../../src/components/loadscreen";
import * as LoadBar from "../../src/components/loadbar";
import * as AssetLoader from "../../src/core/asset-loader";
import * as Scaler from "../../src/core/scaler.js";
import * as GameSound from "../../src/core/game-sound";
import * as gmiModule from "../../src/core/gmi/gmi.js";

describe("Load Screen", () => {
    let loadScreen;
    let addImageStub;
    let mockGame;
    let mockGmi;
    let assetLoaderStub;
    let assetLoaderCallbackSpy;
    let setButtonClickSoundStub;
    let navigationNext;

    const sandbox = sinon.createSandbox();

    beforeEach(() => {
        assetLoaderCallbackSpy = sandbox.spy();
        assetLoaderStub = sandbox.stub(AssetLoader, "loadAssets").returns({ then: assetLoaderCallbackSpy });
        addImageStub = sandbox.stub();
        setButtonClickSoundStub = sandbox.stub(GameSound, "setButtonClickSound");
        navigationNext = sandbox.spy();

        mockGmi = { gameLoaded: sandbox.stub() };
        sandbox.stub(gmiModule, "setGmi").returns(mockGmi);
        sandbox.stub(gmiModule, "sendStats");
        sandbox.replace(gmiModule, "gmi", mockGmi);

        mockGame = {
            add: {
                image: addImageStub,
            },
            state: {
                current: "currentState",
            },
            sound: { mute: false },
            scale: { getParentBounds: sandbox.stub(), setGameSize: sandbox.stub() },
        };

        loadScreen = new Loadscreen();
        loadScreen.scene = {};
        loadScreen.navigation = {
            next: navigationNext,
        };
        loadScreen.game = mockGame;

        Scaler.init(600, mockGame);
    });

    afterEach(() => {
        sandbox.restore();
        delete window.__qaMode;
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

            expect(assetLoaderStub.args[0][0]).to.eql(mockGame);
            expect(assetLoaderStub.args[0][1]).to.eql(expectedGamePacks);
            expect(assetLoaderStub.args[0][2]).to.eql(expectedLoadscreenPack);

            assetLoaderStub.args[0][3]();
            expect(expectedUpdateLoadProgress.called).to.equal(true);
        });

        it("handles the returned promise", () => {
            loadScreen.preload();
            expect(assetLoaderCallbackSpy.called).to.equal(true);
        });

        it("sets the button click sound to be used in the game", () => {
            window.__qaMode = {};
            loadScreen.preload();

            assetLoaderCallbackSpy.args[0][0]();
            sandbox.assert.calledOnce(setButtonClickSoundStub);
            sandbox.assert.calledWith(setButtonClickSoundStub, mockGame, sandbox.match.typeOf("string"));
        });

        it("fires the game loaded stat through the GMI", () => {
            loadScreen.preload();
            assetLoaderCallbackSpy.args[0][0]();
            sandbox.assert.calledOnce(gmiModule.sendStats.withArgs("game_loaded"));
        });

        it("tells the GMI the game has loaded", () => {
            loadScreen.preload();
            assetLoaderCallbackSpy.args[0][0]();
            sandbox.assert.called(mockGmi.gameLoaded);
        });

        it("moves to the next screen when the promise is resolved", () => {
            loadScreen.preload();

            assetLoaderCallbackSpy.args[0][0]();
            expect(navigationNext.called).to.equal(true);
        });
    });

    describe("create method", () => {
        let createProgressBarStub;
        let setFillPercentStub;
        let mockProgressBar;
        let mockBrandLogo;

        beforeEach(() => {
            setFillPercentStub = sandbox.stub();
            mockProgressBar = {
                position: {
                    set: () => {},
                },
                setFillPercent: setFillPercentStub,
            };
            createProgressBarStub = sandbox.stub(LoadBar, "createLoadBar").returns(mockProgressBar);
            loadScreen.scene.calculateMetrics = sandbox.stub().returns({
                horizontals: {},
                verticals: {},
            });
            loadScreen.scene.addToBackground = sandbox.stub().returns({
                anchor: {
                    set: () => {},
                },
                position: {
                    set: () => {},
                },
            });

            mockBrandLogo = {};
            addImageStub.withArgs(0, 0, "brandLogo").returns(mockBrandLogo);

            loadScreen.create();
        });

        it("creates one loading bar", () => {
            sandbox.assert.calledOnce(createProgressBarStub);
            sandbox.assert.calledWith(createProgressBarStub, mockGame, "loadbarBackground", "loadbarFill");
        });

        it("adds the loading bar to the layout", () => {
            sandbox.assert.calledWith(loadScreen.scene.addToBackground, mockProgressBar);
        });

        it("adds a brand logo to the layout", () => {
            sandbox.assert.calledWith(addImageStub, 0, 0, "brandLogo");
            sandbox.assert.calledWith(loadScreen.scene.addToBackground, mockBrandLogo);
        });
    });

    describe("updateLoadProgress", () => {
        beforeEach(() => {
            loadScreen.loadingBar = { fillPercent: 0 };
        });

        it("updates the loading bar fill percentage when called", () => {
            const progress = 42;

            loadScreen.updateLoadProgress(progress);

            assert.equal(loadScreen.loadingBar.fillPercent, progress);
        });

        it("does not throw an error if there is no loading bar", () => {
            delete loadScreen.loadingBar;
            loadScreen.updateLoadProgress(75);
        });
    });

    describe("qaMode", () => {
        let consoleSpy;

        beforeEach(() => {
            consoleSpy = sandbox.spy(console, "log");
        });

        after(() => {
            delete window.__qaMode;
        });

        it("logs the progress to the console when qaMode is true", () => {
            window.__qaMode = {};
            loadScreen.updateLoadProgress("50%");
            expect(consoleSpy.args[0]).to.eql(["Loader progress:", "50%"]);
        });

        it("logs the loaded assets to the console when qaMode is true", () => {
            const expectedKeyLookups = { gel: { play: "gel/play.png" }, home: { title: "shared/title.png" } };
            const expectedOutput =
                "Loaded assets:\n    gel:\n        play: gel/play.png\n    home:\n        title: shared/title.png";

            window.__qaMode = {};
            loadScreen.preload();

            assetLoaderCallbackSpy.args[0][0](expectedKeyLookups);
            expect(consoleSpy.args[0][0]).to.equal(expectedOutput);
        });
    });
});
