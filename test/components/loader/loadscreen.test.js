/**
 * @copyright BBC 2018
 * @author BBC Children's D+E
 * @license Apache-2.0
 */

import { createMockGmi } from "../../mock/gmi.js";

import { Loadscreen } from "../../../src/components/loader/loadscreen.js";
import * as Scaler from "../../../src/core/scaler.js";
import * as GameSound from "../../../src/core/game-sound.js";
import { gmi } from "../../../src/core/gmi/gmi.js";

describe("Load Screen", () => {
    let loadScreen;
    let mockGmi;
    let mockImage;
    let mockConfig;

    beforeEach(() => {
        //global.window.__qaMode = undefined;
        //jest.spyOn(GameSound, "setButtonClickSound").mockImplementation(() => {
        //    play: jest.fn();
        //});

        mockGmi = {
            embedVars: { configPath: "/" },
            gameLoaded: jest.fn(),
            sendStatsEvent: jest.fn(),
            achievements: { init: jest.fn() },
        };
        createMockGmi(mockGmi);

        //const mockData = {
        //    context: {
        //        config: { theme: { home: {}, game: { achievements: true } } },
        //    },
        //};

        mockImage = {
            width: 1,
            frame: {
                cutWidth: 0,
                updateUVs: jest.fn(),
            },
            setOrigin: jest.fn(),
        };

        const mockMasterPack = {
            default: {},
            boot: {},
            one: {},
            two: {},
        };

        mockConfig = {
            theme: {
                game: {
                    achievements: true,
                },
            },
        };
        const mockContext = { config: mockConfig };

        loadScreen = new Loadscreen();
        Object.defineProperty(loadScreen, "context", {
            get: jest.fn(() => mockContext),
        });

        loadScreen.navigate = jest.fn();
        loadScreen.load = {
            setBaseURL: jest.fn(),
            setPath: jest.fn(),
            addPack: jest.fn(),
            pack: jest.fn(),
            on: jest.fn(),
            json: jest.fn(),
        };
        loadScreen.cache = {
            json: {
                get: jest.fn(packName => {
                    if (packName === "asset-master-pack") {
                        return mockMasterPack;
                    } else if (packName === "config") {
                        return mockConfig;
                    }
                }),
            },
        };

        loadScreen.add = {
            image: jest.fn(() => mockImage),
        };

        loadScreen.scene = { key: "loadscreen", manager: { keys: [] } };
        loadScreen.cameras = { main: {} };
        loadScreen.init({});

        const mockGame = {
            scale: {
                parentSize: 100,
            },
        };
        Scaler.init(600, mockGame);
    });

    afterEach(() => jest.clearAllMocks());

    describe("updateLoadProgress", () => {
        test("updates the loading bar fill percentage when called", () => {
            const progress = 42;

            loadScreen.preload();
            loadScreen.updateLoadBar(progress);
            expect(mockImage.frame.cutWidth).toEqual(progress);
        });
    });

    describe("preload method", () => {
        test("calls load.pack with the correct file names", () => {
            loadScreen.scene.manager.keys = { one: {}, two: {}, three: {} };
            loadScreen.preload();

            expect(loadScreen.load.pack).toHaveBeenCalledWith("gel/gel-pack");
            expect(loadScreen.load.pack).toHaveBeenCalledWith("three");
        });
    });

    describe("create method", () => {
        test("calls this.navigate('next')", () => {
            loadScreen.create();
            expect(loadScreen.navigate).toHaveBeenCalledWith("next");
        });

        test("sends gmi game loaded stats", () => {
            loadScreen.create();
            expect(gmi.sendStatsEvent).toHaveBeenCalledWith("gameloaded", "true");
            expect(gmi.gameLoaded).toHaveBeenCalled();
        });
    });

    describe("qaMode", () => {
        beforeEach(() => {
            jest.spyOn(console, "log").mockImplementation(() => {});
            loadScreen.preload();
        });

        test("logs the progress to the console when qaMode is true", () => {
            global.window.__qaMode = true;
            loadScreen.updateLoadBar("50");
            expect(console.log.mock.calls[0]).toEqual(["Loader progress:", "50"]); // eslint-disable-line no-console
        });
    });

    //describe("create method", () => {
    //    let createProgressBarStub;
    //    let setFillPercentStub;
    //    let mockProgressBar;
    //    let mockBrandLogo;
    //
    //    beforeEach(() => {
    //        setFillPercentStub = jest.fn();
    //        mockProgressBar = {
    //            position: {
    //                set: () => {},
    //            },
    //            setFillPercent: setFillPercentStub,
    //        };
    //        createProgressBarStub = jest.spyOn(LoadBar, "createLoadBar").mockImplementation(() => mockProgressBar);
    //        loadScreen.layoutManager.calculateMetrics = jest.fn().mockImplementation(() => ({
    //            horizontals: {},
    //            verticals: {},
    //        }));
    //        mockBrandLogo = {
    //            anchor: {
    //                set: () => {},
    //            },
    //            position: {
    //                set: () => {},
    //            },
    //        };
    //        loadScreen.layoutManager.addToBackground = jest.fn().mockImplementation(image => {
    //            if (image === "brandLogo") {
    //                return mockBrandLogo;
    //            }
    //        });
    //        loadScreen.create();
    //    });
    //
    //    test("creates one loading bar", () => {
    //        expect(createProgressBarStub).toHaveBeenCalled();
    //        expect(createProgressBarStub).toHaveBeenCalledWith(mockGame, "loadbarBackground", "loadbarFill");
    //    });
    //
    //    test("adds the loading bar to the layout", () => {
    //        expect(loadScreen.layoutManager.addToBackground).toHaveBeenCalledWith(mockProgressBar);
    //    });
    //
    //    test("adds a brand logo to the layout", () => {
    //        expect(mockGame.add.image).toHaveBeenCalledWith(0, 0, "brandLogo");
    //        expect(loadScreen.layoutManager.addToBackground).toHaveBeenCalledWith("brandLogo");
    //    });
    //});
    //
    //
    describe("achievements", () => {
        test("calls achievements init when achievements config flag is set to true", () => {
            loadScreen.create();
            expect(mockGmi.achievements.init).toHaveBeenCalled();
        });

        test("does not call achievements init when achievements config flag is falsy", () => {
            mockConfig.theme.game.achievements = false;

            loadScreen.create();
            expect(mockGmi.achievements.init).not.toHaveBeenCalled();
        });
    });
});
