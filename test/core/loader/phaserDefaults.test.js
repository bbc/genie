/**
 * @copyright BBC 2020
 * @author BBC Children's D+E
 * @license Apache-2.0
 */

import { getPhaserDefaults } from "../../../src/core/loader/phaserDefaults.js";
import { Loader } from "../../../src/core/loader/loader.js";
import { Boot } from "../../../src/core/loader/boot.js";
import * as debugScreensModule from "../../../src/core/debug/debug-screens.js";
import { createMockGmi } from "../../mock/gmi.js";
import { domElement } from "../../mock/dom-element.js";

import { getContainerDiv } from "../../../src/core/loader/container.js";
import { getBrowser } from "../../../src/core/browser.js";

jest.mock("../../../src/core/loader/container.js");
jest.mock("../../../src/core/loader/loader.js");
jest.mock("../../../src/core/loader/boot.js");
jest.mock("../../../src/core/browser.js");

describe("Phaser Defaults", () => {
    let mockGmi;
    let containerDiv;

    beforeEach(() => {
        mockGmi = { setGmi: jest.fn(), gameContainerId: "some-id" };
        getBrowser.mockImplementation(() => ({ forceCanvas: false, isSilk: false }));
        createMockGmi(mockGmi);

        containerDiv = domElement();

        global.__GENIE__ = { version: "test version" };

        getContainerDiv.mockImplementation(() => containerDiv);
    });

    afterEach(jest.clearAllMocks);

    describe("getPhaserDefaults Method", () => {
        describe("Returned Config", () => {
            test("Returns correct config", () => {
                const expectedConfig = {
                    width: 1400,
                    height: 600,
                    type: 0,
                    antialias: true,
                    multiTexture: true,
                    parent: containerDiv,
                    transparent: false,
                    clearBeforeRender: false,
                };

                const actualConfig = getPhaserDefaults({ screens: {} });

                expect(actualConfig.width).toBe(expectedConfig.width);
                expect(actualConfig.height).toBe(expectedConfig.height);
                expect(actualConfig.type).toBe(expectedConfig.type);
                expect(actualConfig.antialias).toBe(expectedConfig.antialias);
                expect(actualConfig.multiTexture).toBe(expectedConfig.multiTexture);
                expect(actualConfig.parent).toEqual(expectedConfig.parent);
                expect(actualConfig.title).toEqual("BBC Games Genie");
                expect(actualConfig.version).toEqual("test version");
                expect(actualConfig.transparent).toBe(expectedConfig.transparent);
                expect(actualConfig.clearBeforeRender).toBe(expectedConfig.clearBeforeRender);
                expect(actualConfig.scale).toEqual({ mode: Phaser.Scale.NONE });
            });

            test("sets transparent config flag to false when Amazon Silk Browser", () => {
                const mockSilkBrowser = { name: "Amazon Silk", isSilk: true, version: "1.1.1" };
                getBrowser.mockImplementation(() => mockSilkBrowser);

                const actualConfig = getPhaserDefaults({ screens: {} });
                expect(actualConfig.transparent).toBe(true);
            });

            test("sets type to canvas when browser returns forceCanvas", () => {
                const mockSafari9 = { name: "Safari", forceCanvas: true };
                getBrowser.mockImplementation(() => mockSafari9);
                const actualConfig = getPhaserDefaults({ screens: {} });
                expect(actualConfig.type).toBe(1);
            });

            test("disable's phaser's global window events (prevents clickthrough from achievements)", () => {
                const actualConfig = getPhaserDefaults({ screens: {} });
                expect(actualConfig.input.windowEvents).toBe(false);
            });

            test("merges gameOptions if present in config", () => {
                const actualConfig = getPhaserDefaults({ screens: {}, gameOptions: { testKey: "test-key" } });

                expect(actualConfig.testKey).toBe("test-key");
            });
        });

        describe("Scenes", () => {
            let screens;

            beforeEach(() => {
                Loader.mockImplementation(() => ({ loader: "loader" }));
                Boot.mockImplementation(() => ({ boot: "boot" }));
                screens = {
                    settings: { scene: jest.fn().mockImplementation(() => ({ settings: "settings" })) },
                    game: { scene: jest.fn().mockImplementation(() => ({ game: "game" })) },
                };
            });

            test("creates an array of scenes from the screen config", () => {
                getPhaserDefaults({ screens });
                expect(screens.settings.scene).toHaveBeenCalledWith({ key: "settings" });
                expect(screens.game.scene).toHaveBeenCalledWith({ key: "game" });
            });

            test("instantiates a new loader", () => {
                getPhaserDefaults({ screens });
                expect(Loader).toHaveBeenCalled();
            });

            test("instantiates a new boot with correct config", () => {
                getPhaserDefaults({ screens });
                expect(Boot).toHaveBeenCalledWith(screens);
            });

            test("returns scenes list + boot and loader debug", () => {
                debugScreensModule.getLauncherScreen = () => ({
                    debug: { scene: jest.fn().mockImplementation(() => ({ debug: "debug" })) },
                });
                const defaults = getPhaserDefaults({ screens });

                expect(defaults.scene).toEqual([
                    { boot: "boot" },
                    { loader: "loader" },
                    { settings: "settings" },
                    { game: "game" },
                    { debug: "debug" },
                ]);
            });

            test("creates scene with settings from config", () => {
                screens.game.settings = { physics: { default: "arcade", arcade: {} } };
                getPhaserDefaults({ screens });
                expect(screens.game.scene).toHaveBeenCalledWith({
                    key: "game",
                    physics: { default: "arcade", arcade: {} },
                });
            });
        });
    });
});