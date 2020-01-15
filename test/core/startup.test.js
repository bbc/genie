/**
 * @copyright BBC 2018
 * @author BBC Children's D+E
 * @license Apache-2.0
 */
import { createMockGmi } from "../mock/gmi";
import { domElement } from "../mock/dom-element";

import * as a11y from "../../src/core/accessibility/accessibility-layer.js";
import * as gmiModule from "../../src/core/gmi/gmi.js";
import * as styles from "../../src/core/custom-styles.js";
import { getBrowser } from "../../src/core/browser.js";
import { Loader } from "../../src/core/loader/loader.js";
import { Boot } from "../../src/core/loader/boot.js";

import { startup } from "../../src/core/startup.js";
import { addGelButton } from "../../src/core/layout/gel-game-objects.js";
import * as debugModeModule from "../../src/core/debug/debug-mode.js";

jest.mock("../../src/core/browser.js");
jest.mock("../../src/core/custom-styles.js");
jest.mock("../../src/core/loader/loader.js");
jest.mock("../../src/core/loader/boot.js");

describe("Startup", () => {
    let mockGmi;
    let containerDiv;

    beforeEach(() => {
        Loader.mockImplementation(() => ({ loader: "loader" }));
        Boot.mockImplementation(() => ({ boot: "boot" }));

        mockGmi = { setGmi: jest.fn(), gameContainerId: "some-id" };
        createMockGmi(mockGmi);

        containerDiv = domElement();
        jest.spyOn(global.document, "getElementById").mockImplementation(argument => {
            if (argument === mockGmi.gameContainerId) {
                return containerDiv;
            }
        });
        getBrowser.mockImplementation(() => ({ forceCanvas: false, isSilk: false }));
        jest.spyOn(styles, "addCustomStyles");
        jest.spyOn(Phaser, "Game").mockImplementation(() => {});
        jest.spyOn(a11y, "setup").mockImplementation(() => {});
        global.window.getGMI = jest.fn().mockImplementation(() => mockGmi);
        global.window.addEventListener = jest.fn();
        global.Phaser.Loader.FileTypesManager.register = jest.fn();
    });

    afterEach(() => {
        jest.clearAllMocks();
        jest.restoreAllMocks();
    });

    test("instantiates the GMI with correct params", () => {
        const fakeSettings = { settings: "some settings" };
        startup({}, fakeSettings);
        expect(gmiModule.setGmi).toHaveBeenCalledWith(fakeSettings, global.window);
    });

    test("instantiates the GMI with an empty object if settings config not provided", () => {
        startup({});
        expect(gmiModule.setGmi).toHaveBeenCalledWith({}, global.window);
    });

    test("injects custom styles to the game container element", () => {
        startup({});
        expect(styles.addCustomStyles).toHaveBeenCalled();
    });

    test("sets up the accessibility layer", () => {
        startup({});
        expect(a11y.setup).toHaveBeenCalledWith(containerDiv);
    });

    describe("Scenes", () => {
        let fakeScreenConfig;

        beforeEach(() => {
            fakeScreenConfig = {
                settings: { scene: jest.fn().mockImplementation(() => ({ settings: "settings" })) },
                game: { scene: jest.fn().mockImplementation(() => ({ game: "game" })) },
            };
            startup(fakeScreenConfig);
        });

        test("creates an array of scenes from the screen config", () => {
            expect(fakeScreenConfig.settings.scene).toHaveBeenCalledWith({ key: "settings" });
            expect(fakeScreenConfig.game.scene).toHaveBeenCalledWith({ key: "game" });
        });

        test("instantiates a new loader", () => {
            expect(Loader).toHaveBeenCalled();
        });

        test("instantiates a new boot with correct config", () => {
            expect(Boot).toHaveBeenCalledWith(fakeScreenConfig);
        });

        test("adds the scenes with the boot and loader to the Phaser game", () => {
            const actualPhaserGame = Phaser.Game.mock.calls[0][0];
            expect(actualPhaserGame.scene).toEqual([
                { boot: "boot" },
                { loader: "loader" },
                { settings: "settings" },
                { game: "game" },
            ]);
        });

        test("creates scene with settings object from screenConfig", () => {
            fakeScreenConfig.game.settings = { physics: { default: "arcade", arcade: {} } };
            startup(fakeScreenConfig);
            expect(fakeScreenConfig.game.scene).toHaveBeenCalledWith({
                key: "game",
                physics: { default: "arcade", arcade: {} },
            });
        });
    });

    describe("Phaser Game Config", () => {
        test("creates a new Phaser game with correct config", () => {
            startup({});

            const expectedConfig = {
                width: 1400,
                height: 600,
                renderer: 0,
                antialias: true,
                multiTexture: true,
                parent: containerDiv,
                transparent: false,
                clearBeforeRender: false,
            };

            const actualConfig = Phaser.Game.mock.calls[0][0];

            expect(actualConfig.width).toBe(expectedConfig.width);
            expect(actualConfig.height).toBe(expectedConfig.height);
            expect(actualConfig.renderer).toBe(expectedConfig.renderer);
            expect(actualConfig.antialias).toBe(expectedConfig.antialias);
            expect(actualConfig.multiTexture).toBe(expectedConfig.multiTexture);
            expect(actualConfig.parent).toEqual(expectedConfig.parent);
            expect(actualConfig.title).toEqual("Game Title Here");
            expect(actualConfig.version).toEqual("Version Info here");
            expect(actualConfig.transparent).toBe(expectedConfig.transparent);
            expect(actualConfig.clearBeforeRender).toBe(expectedConfig.clearBeforeRender);
            expect(actualConfig.scale).toEqual({ mode: Phaser.Scale.NONE });
        });

        test("sets transparent config flag to false when Amazon Silk Browser", () => {
            const mockSilkBrowser = { name: "Amazon Silk", isSilk: true, version: "1.1.1" };
            getBrowser.mockImplementation(() => mockSilkBrowser);

            startup({});
            const actualConfig = Phaser.Game.mock.calls[0][0];
            expect(actualConfig.transparent).toBe(true);
        });

        test("sets renderer to canvas when browser returns forceCanvas", () => {
            const mockSafari9 = { name: "Safari", forceCanvas: true };
            getBrowser.mockImplementation(() => mockSafari9);
            startup({});
            const actualConfig = Phaser.Game.mock.calls[0][0];
            expect(actualConfig.renderer).toBe(1);
        });

        test("throws an error if the game container element cannot be found", () => {
            document.getElementById.mockImplementation(() => false);
            const startupNoContainer = () => startup({});
            expect(startupNoContainer).toThrowError(`Container element "#some-id" not found`); // eslint-disable-line quotes
        });
    });

    describe("Hook errors", () => {
        test("adds an event listener to listen for errors", () => {
            startup({});
            expect(global.window.addEventListener.mock.calls[0][0]).toBe("error");
        });

        test("finds the container div to display errors", () => {
            startup({});
            expect(global.document.getElementById).toHaveBeenCalledWith("some-id");
        });

        describe("Throwing an error", () => {
            let mockContainer;
            let mockPreTag;

            beforeEach(() => {
                mockContainer = domElement();
                mockPreTag = domElement();
                mockContainer.appendChild.mockImplementation(() => mockPreTag);
                global.document.getElementById.mockImplementation(() => mockContainer);
                global.document.createElement = jest.fn(tagName => {
                    const domEle = domElement();
                    domEle.name = tagName;
                    return domEle;
                });
                startup({});
                const errorEvent = { error: { message: "There has been an error" } };
                const errorThrown = global.window.addEventListener.mock.calls[0][1];
                errorThrown(errorEvent);
            });

            test("appends an error message to the container when an error event is thrown", () => {
                expect(mockContainer.appendChild.mock.calls[0][0].name).toBe("pre");
            });

            test("sets the correct styling on the error message", () => {
                const expectStyles = {
                    position: "absolute",
                    top: "0",
                    left: "0",
                    backgroundColor: "black",
                    color: "white",
                    padding: "2em",
                    width: "calc(100% - 2 * 2em)",
                    height: "calc(100% - 2 * 2em)",
                };
                expect(mockPreTag.style).toEqual(expectStyles);
            });

            test("sets the correct error message text", () => {
                const expectedError = "Something isn't working:\n\nThere has been an error\n\n";
                expect(mockPreTag.innerText).toBe(expectedError);
            });
        });
    });

    describe("GelButton GameObject Factory", () => {
        test("registers addGelButton gameobject factory with Phaser", () => {
            const regSpy = jest.fn();
            global.Phaser.GameObjects.GameObjectFactory.register = regSpy;
            startup({});
            expect(regSpy).toHaveBeenCalledWith("gelButton", addGelButton);
        });
    });

    describe("DebugMode", () => {
        test("initilialises debug mode", () => {
            const debugCreateSpy = jest.spyOn(debugModeModule, "create");
            startup({});
            expect(debugCreateSpy).toHaveBeenCalledWith(window, {});
        });
    });
});
