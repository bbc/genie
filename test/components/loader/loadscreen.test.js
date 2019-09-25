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
    let mockMasterPack;

    beforeEach(() => {
        //TODO P3 need to add tests for audio once audio has been addressed [NT]
        //global.window.__qaMode = undefined;
        //jest.spyOn(GameSound, "setButtonClickSound").mockImplementation(() => {
        //    play: jest.fn();
        //});

        mockGmi = {
            embedVars: { configPath: "test-config-path" },
            gameLoaded: jest.fn(),
            sendStatsEvent: jest.fn(),
            achievements: { init: jest.fn() },
            gameDir: "test-game-dir",
        };
        createMockGmi(mockGmi);

        mockImage = {
            width: 1,
            frame: {
                cutWidth: 0,
                updateUVs: jest.fn(),
            },
            setOrigin: jest.fn(),
        };

        mockMasterPack = {
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
        loadScreen.setConfig = jest.fn();
        loadScreen.init({});

        const mockGame = {
            scale: {
                parentSize: 100,
            },
        };
        Scaler.init(600, mockGame);
    });

    afterEach(() => jest.clearAllMocks());

    describe("updateLoadBar method", () => {
        test("updates the loading bar fill when called", () => {
            const progress = 42;

            loadScreen.preload();
            loadScreen.updateLoadBar(progress);
            expect(mockImage.frame.cutWidth).toEqual(progress);
        });
    });

    describe("createBrandLogo method", () => {
        test("adds logo image at correct position", () => {
            const mockMetrics = {
                borderPad: 10,
                scale: 1,
                horizontals: {
                    right: 100,
                },
                verticals: {
                    bottom: 100,
                },
            };
            Scaler.getMetrics = jest.fn(() => mockMetrics);
            loadScreen.createBrandLogo();

            expect(loadScreen.add.image).toHaveBeenCalledWith(90, 90, "loadscreen.brandLogo");
            expect(mockImage.setOrigin).toHaveBeenCalledWith(1, 1);
        });
    });

    describe("createLoadBar method", () => {
        test("adds loadbar images and sets progress to zero", () => {
            loadScreen.updateLoadBar = jest.fn();
            loadScreen.createLoadBar();

            expect(loadScreen.add.image).toHaveBeenCalledWith(0, 0, "loadscreen.loadbarBackground");
            expect(loadScreen.add.image).toHaveBeenCalledWith(0, 0, "loadscreen.loadbar");
            expect(loadScreen.updateLoadBar).toHaveBeenCalledWith(0);
        });
    });

    describe("preload method", () => {
        test("Sets the config part of screen#data", () => {
            loadScreen.preload();
            expect(loadScreen.setConfig).toHaveBeenCalledWith(mockConfig);
        });

        test("Sets up loader paths correctly", () => {
            loadScreen.preload();

            expect(loadScreen.load.setBaseURL).toHaveBeenCalledWith(mockGmi.gameDir);
            expect(loadScreen.load.setPath).toHaveBeenCalledWith(mockGmi.embedVars.configPath);
        });

        test("Adds the master asset pack to the load", () => {
            loadScreen.preload();

            expect(loadScreen.load.addPack).toHaveBeenCalledWith(mockMasterPack);
        });

        test("calls load.pack with the gel pack and missing pack names", () => {
            loadScreen.scene.manager.keys = { one: {}, two: {}, three: {} };
            loadScreen.preload();

            expect(loadScreen.load.pack).toHaveBeenCalledWith("gel/gel-pack");
            expect(loadScreen.load.pack).toHaveBeenCalledWith("three");
        });

        test("adds background and title images", () => {
            loadScreen.preload();

            expect(loadScreen.add.image).toHaveBeenCalledWith(0, 0, "loadscreen.background");
            expect(loadScreen.add.image).toHaveBeenCalledWith(0, -150, "loadscreen.title");
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

        test("does not call achievements init when there is no theme.game entry", () => {
            delete mockConfig.theme.game;

            loadScreen.preload();
            loadScreen.create();
            expect(mockGmi.achievements.init).not.toHaveBeenCalled();
        });

        test("loads the achievements config if enabled in config", () => {
            loadScreen.preload();
            expect(loadScreen.load.json).toHaveBeenCalledWith("achievements-data", "achievements/config.json");
        });

        test("does not load the achievements config if disabled in config", () => {
            delete mockConfig.theme.game.achievements;

            loadScreen.preload();
            expect(loadScreen.load.json).not.toHaveBeenCalledWith("achievements-data", "achievements/config.json");
        });
    });
});
