/**
 * @copyright BBC 2018
 * @author BBC Children's D+E
 * @license Apache-2.0
 */

import { createMockGmi } from "../../mock/gmi.js";

import { Loader } from "../../../src/core/loader/loader.js";
import * as Scaler from "../../../src/core/scaler.js";
import * as GameSound from "../../../src/core/game-sound.js";
import { gmi } from "../../../src/core/gmi/gmi.js";

describe("Loader", () => {
    let loader;
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

        loader = new Loader();
        Object.defineProperty(loader, "context", {
            get: jest.fn(() => mockContext),
        });

        loader.load = {
            setBaseURL: jest.fn(),
            setPath: jest.fn(),
            addPack: jest.fn(),
            pack: jest.fn(),
            on: jest.fn(),
            json: jest.fn(),
        };
        loader.cache = {
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

        loader.add = {
            image: jest.fn(() => mockImage),
        };

        const mockData = { navigation: { loader: { routes: { next: "test" } } }, parentScreens: [] };

        loader.events = { emit: jest.fn() };
        loader.scene = { key: "loader", manager: { keys: [] }, start: jest.fn(), bringToTop: jest.fn() };
        loader.cameras = { main: {} };
        loader.setConfig = jest.fn();
        loader.init(mockData);

        const mockGame = {
            canvas: {
                style: {
                    height: 250,
                },
                getBoundingClientRect: () => {
                    return { width: 225, height: 350 };
                },
            },
            scale: {
                parentSize: 100,
                parent: {
                    offsetWidth: 300,
                    offsetHeight: 200,
                },
                refresh: () => {},
            },
        };
        Scaler.init(600, mockGame);
    });

    afterEach(() => jest.clearAllMocks());

    describe("updateLoadBar method", () => {
        test("updates the loading bar fill when called", () => {
            const progress = 42;

            loader.preload();
            loader.updateLoadBar(progress);
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
            loader.createBrandLogo();

            expect(loader.add.image).toHaveBeenCalledWith(90, 90, "loader.brandLogo");
            expect(mockImage.setOrigin).toHaveBeenCalledWith(1, 1);
        });
    });

    describe("createLoadBar method", () => {
        test("adds loadbar images and sets progress to zero", () => {
            loader.updateLoadBar = jest.fn();
            loader.createLoadBar();

            expect(loader.add.image).toHaveBeenCalledWith(0, 0, "loader.loadbarBackground");
            expect(loader.add.image).toHaveBeenCalledWith(0, 0, "loader.loadbar");
            expect(loader.updateLoadBar).toHaveBeenCalledWith(0);
        });
    });

    describe("preload method", () => {
        test("Sets the config part of screen#data", () => {
            loader.preload();
            expect(loader.setConfig).toHaveBeenCalledWith(mockConfig);
        });

        test("Sets up loader paths correctly", () => {
            loader.preload();

            expect(loader.load.setBaseURL).toHaveBeenCalledWith(mockGmi.gameDir);
            expect(loader.load.setPath).toHaveBeenCalledWith(mockGmi.embedVars.configPath);
        });

        test("Adds the master asset pack to the load", () => {
            loader.preload();

            expect(loader.load.addPack).toHaveBeenCalledWith(mockMasterPack);
        });

        test("calls load.pack with the gel pack and missing pack names", () => {
            loader.scene.manager.keys = { one: {}, two: {}, three: {} };
            loader.preload();

            expect(loader.load.pack).toHaveBeenCalledWith("gel/gel-pack");
            expect(loader.load.pack).toHaveBeenCalledWith("three");
        });

        test("does not load boot and loader screen packs", () => {
            loader.scene.manager.keys = { boot: {}, loader: {}, three: {} };
            loader.preload();

            expect(loader.load.pack).toHaveBeenCalledWith("gel/gel-pack");
            expect(loader.load.pack).not.toHaveBeenCalledWith("boot");
            expect(loader.load.pack).not.toHaveBeenCalledWith("loader");
            expect(loader.load.pack).toHaveBeenCalledWith("three");
        });

        test("adds background and title images", () => {
            loader.preload();

            expect(loader.add.image).toHaveBeenCalledWith(0, 0, "loader.background");
            expect(loader.add.image).toHaveBeenCalledWith(0, -150, "loader.title");
        });
    });

    describe("create method", () => {
        test("calls this.navigation.next", () => {
            loader.navigation = { next: jest.fn() };
            loader.create();
            expect(loader.navigation.next).toHaveBeenCalled();
        });

        test("sends gmi game loaded stats", () => {
            loader.create();
            expect(gmi.sendStatsEvent).toHaveBeenCalledWith("gameloaded", "true");
            expect(gmi.gameLoaded).toHaveBeenCalled();
        });
    });

    describe("qaMode", () => {
        beforeEach(() => {
            jest.spyOn(console, "log").mockImplementation(() => {});
            loader.preload();
        });

        test("logs the progress to the console when qaMode is true", () => {
            global.window.__qaMode = true;
            loader.updateLoadBar("50");
            expect(console.log.mock.calls[0]).toEqual(["Loader progress:", "50"]); // eslint-disable-line no-console
        });
    });

    describe("achievements", () => {
        test("calls achievements init when achievements config flag is set to true", () => {
            loader.create();
            expect(mockGmi.achievements.init).toHaveBeenCalled();
        });

        test("does not call achievements init when achievements config flag is falsy", () => {
            mockConfig.theme.game.achievements = false;

            loader.create();
            expect(mockGmi.achievements.init).not.toHaveBeenCalled();
        });

        test("does not call achievements init when there is no theme.game entry", () => {
            delete mockConfig.theme.game;

            loader.preload();
            loader.create();
            expect(mockGmi.achievements.init).not.toHaveBeenCalled();
        });

        test("loads the achievements config if enabled in config", () => {
            loader.preload();
            expect(loader.load.json).toHaveBeenCalledWith("achievements-data", "achievements/config.json");
        });

        test("does not load the achievements config if disabled in config", () => {
            delete mockConfig.theme.game.achievements;

            loader.preload();
            expect(loader.load.json).not.toHaveBeenCalledWith("achievements-data", "achievements/config.json");
        });
    });
});
