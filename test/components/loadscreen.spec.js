import { expect, assert } from "chai";
import * as sinon from "sinon";

import { Loadscreen } from "../../src/components/loadscreen";
import * as LoadBar from "../../src/components/loadbar";
import * as AssetLoader from "../../src/core/asset-loader";
import { GameAssets } from "../../src/core/game-assets.js";

describe("Load Screen", () => {
    let loadScreen;
    let musicLoopStub;
    let addImageStub;
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
        addImageStub = sandbox.stub();
        musicLoopStub.returns({});

        mockGame = {
            add: {
                image: addImageStub,
                audio: musicLoopStub,
            },
            state: {
                current: "currentState",
            },
        };
        mockNext = sandbox.spy();

        loadScreen = new Loadscreen();
        loadScreen.layoutFactory = {
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

    describe("create method", () => {
        let createProgressBarStub;
        let setFillPercentStub;
        let mockProgressBar;

        beforeEach(() => {
            setFillPercentStub = sandbox.stub();
            mockProgressBar = {
                position: {
                    set: () => {},
                },
                setFillPercent: setFillPercentStub,
            };
            createProgressBarStub = sandbox.stub(LoadBar, "createLoadBar").returns(mockProgressBar);
            loadScreen.layoutFactory.getSize = sandbox.stub().returns({
                width: 100,
                height: 100,
                scale: 1,
                stageHeightPx: 60,
            });
            loadScreen.layoutFactory.addToBackground = sandbox.stub().returns({
                anchor: {
                    set: () => {},
                },
                position: {
                    set: () => {},
                },
            });
            loadScreen.create();
        });

        it("creates one loading bar", () => {
            sinon.assert.calledOnce(createProgressBarStub);
            sinon.assert.calledWith(createProgressBarStub, mockGame, "loadbarBackground", "loadbarFill");
        });

        it("adds the loading bar to the layout", () => {
            sinon.assert.calledWith(loadScreen.layoutFactory.addToBackground, mockProgressBar);
        });

        it("adds a brand logo to the layout", () => {
            // TODO: write a test for this
        });
    });

    describe("updateLoadProgress", () => {
        let setFillPercentStub;
        let loadBarStub;

        beforeEach(() => {
            loadScreen.context = { qaMode: { active: false } };
            setFillPercentStub = sandbox.stub();
            loadScreen.loadingBar = { fillPercent: 0 };
        });

        it("updates the loading bar fill percentage when called", () => {
            // given
            const progress = 42;

            // when
            loadScreen.updateLoadProgress(progress);

            // then
            assert.equal(loadScreen.loadingBar.fillPercent, progress);
        });

        it("will not try to update the loading bar fill if the loading bar does not exist", () => {
            // given
            const progress = 42;
            delete loadScreen.loadingBar;

            // when
            loadScreen.updateLoadProgress(progress);

            // then
            sinon.assert.notCalled(setFillPercentStub);
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
