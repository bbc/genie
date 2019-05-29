/**
 * @copyright BBC 2018
 * @author BBC Children's D+E
 * @license Apache-2.0
 */

import { createMockGmi } from "../mock/gmi";

import { Loadscreen } from "../../src/components/loadscreen";
import * as LoadBar from "../../src/components/loadbar";
import * as AssetLoader from "../../src/core/asset-loader";
import * as Scaler from "../../src/core/scaler.js";
import * as GameSound from "../../src/core/game-sound";

describe("Load Screen", () => {
    let loadScreen;
    let mockGame;
    let mockGmi;
    let assetLoaderCallbackSpy;

    beforeEach(() => {
        global.window.__qaMode = undefined;
        assetLoaderCallbackSpy = jest.fn();
        jest.spyOn(AssetLoader, "loadAssets").mockImplementation(() => ({ then: assetLoaderCallbackSpy }));
        jest.spyOn(GameSound, "setButtonClickSound");

        mockGmi = { gameLoaded: jest.fn(), sendStatsEvent: jest.fn() };
        createMockGmi(mockGmi);

        mockGame = {
            add: { image: jest.fn().mockImplementation((x, y, imageName) => imageName), audio: jest.fn() },
            state: { current: "currentState" },
            sound: { mute: false },
            scale: { getParentBounds: jest.fn(), setGameSize: jest.fn() },
        };

        loadScreen = new Loadscreen();
        loadScreen.scene = { addToBackground: jest.fn() };
        loadScreen.navigation = { next: jest.fn() };
        loadScreen.game = mockGame;

        Scaler.init(600, mockGame);
    });

    afterEach(() => jest.clearAllMocks());

    describe("preload method", () => {
        test("calls the asset loader with correct params", () => {
            const expectedGamePacks = {
                ["MasterAssetPack"]: { url: "asset-master-pack.json" },
                ["GelAssetPack"]: { url: "gel/gel-pack.json" },
            };
            const expectedLoadscreenPack = { key: "loadscreen", url: "loader/loadscreen-pack.json" };

            const expectedUpdateLoadProgress = jest.fn();
            loadScreen.updateLoadProgress = expectedUpdateLoadProgress;
            loadScreen.preload();

            expect(AssetLoader.loadAssets.mock.calls[0][0]).toEqual(mockGame);
            expect(AssetLoader.loadAssets.mock.calls[0][1]).toEqual(expectedGamePacks);
            expect(AssetLoader.loadAssets.mock.calls[0][2]).toEqual(expectedLoadscreenPack);

            AssetLoader.loadAssets.mock.calls[0][3]();
            expect(expectedUpdateLoadProgress).toHaveBeenCalled();
        });

        test("handles the returned promise", () => {
            loadScreen.preload();
            expect(assetLoaderCallbackSpy).toHaveBeenCalled();
        });

        test("sets the button click sound to be used in the game", () => {
            loadScreen.preload();
            assetLoaderCallbackSpy.mock.calls[0][0]();
            expect(GameSound.setButtonClickSound).toHaveBeenCalledWith(mockGame, "loadscreen.buttonClick");
        });

        test("fires the game loaded stat through the GMI", () => {
            loadScreen.preload();
            assetLoaderCallbackSpy.mock.calls[0][0]();
            expect(mockGmi.sendStatsEvent).toHaveBeenCalledWith("gameloaded", "true");
        });

        test("tells the GMI the game has loaded", () => {
            loadScreen.preload();
            assetLoaderCallbackSpy.mock.calls[0][0]();
            expect(mockGmi.gameLoaded).toHaveBeenCalled();
        });

        test("moves to the next screen when the promise is resolved", () => {
            loadScreen.preload();

            assetLoaderCallbackSpy.mock.calls[0][0]();
            expect(loadScreen.navigation.next).toHaveBeenCalled();
        });
    });

    describe("create method", () => {
        let createProgressBarStub;
        let setFillPercentStub;
        let mockProgressBar;
        let mockBrandLogo;

        beforeEach(() => {
            setFillPercentStub = jest.fn();
            mockProgressBar = {
                position: {
                    set: () => {},
                },
                setFillPercent: setFillPercentStub,
            };
            createProgressBarStub = jest.spyOn(LoadBar, "createLoadBar").mockImplementation(() => mockProgressBar);
            loadScreen.scene.calculateMetrics = jest.fn().mockImplementation(() => ({
                horizontals: {},
                verticals: {},
            }));
            mockBrandLogo = {
                anchor: {
                    set: () => {},
                },
                position: {
                    set: () => {},
                },
            };
            loadScreen.scene.addToBackground = jest.fn().mockImplementation(image => {
                if (image === "brandLogo") {
                    return mockBrandLogo;
                }
            });
            loadScreen.create();
        });

        test("creates one loading bar", () => {
            expect(createProgressBarStub).toHaveBeenCalled();
            expect(createProgressBarStub).toHaveBeenCalledWith(mockGame, "loadbarBackground", "loadbarFill");
        });

        test("adds the loading bar to the layout", () => {
            expect(loadScreen.scene.addToBackground).toHaveBeenCalledWith(mockProgressBar);
        });

        test("adds a brand logo to the layout", () => {
            expect(mockGame.add.image).toHaveBeenCalledWith(0, 0, "brandLogo");
            expect(loadScreen.scene.addToBackground).toHaveBeenCalledWith("brandLogo");
        });
    });

    describe("updateLoadProgress", () => {
        beforeEach(() => {
            loadScreen.loadingBar = { fillPercent: 0 };
        });

        test("updates the loading bar fill percentage when called", () => {
            const progress = 42;

            loadScreen.updateLoadProgress(progress);

            expect(loadScreen.loadingBar.fillPercent).toEqual(progress);
        });

        test("does not throw an error if there is no loading bar", () => {
            delete loadScreen.loadingBar;
            loadScreen.updateLoadProgress(75);
        });
    });

    describe("qaMode", () => {
        beforeEach(() => {
            jest.spyOn(console, "log").mockImplementation(() => {});
        });

        test("logs the progress to the console when qaMode is true", () => {
            global.window.__qaMode = {};
            loadScreen.updateLoadProgress("50%");
            expect(console.log.mock.calls[0]).toEqual(["Loader progress:", "50%"]); // eslint-disable-line no-console
        });

        test("logs the loaded assets to the console when qaMode is true", () => {
            const expectedKeyLookups = { gel: { play: "gel/play.png" }, home: { title: "shared/title.png" } };
            const expectedOutput =
                "Loaded assets:\n    gel:\n        play: gel/play.png\n    home:\n        title: shared/title.png";

            global.window.__qaMode = {};
            loadScreen.preload();

            assetLoaderCallbackSpy.mock.calls[0][0](expectedKeyLookups);
            expect(console.log.mock.calls[0][0]).toEqual(expectedOutput); // eslint-disable-line no-console
        });
    });
});
