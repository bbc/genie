/**
 * @copyright BBC 2018
 * @author BBC Children's D+E
 * @license Apache-2.0
 */
import { createMockGmi } from "../mock/gmi";
import { domElement } from "../mock/dom-element";
import { createMockGame } from "../mock/phaser-game.js";

import { startup } from "../../src/core/startup.js";
import { getBrowser } from "../../src/core/browser.js";
import * as gmiModule from "../../src/core/gmi/gmi.js";
import * as styles from "../../src/core/custom-styles.js";
import * as qaMode from "../../src/core/qa/qa-mode.js";
import * as a11y from "../../src/core/accessibility/accessibility-layer.js";

jest.mock("../../src/core/browser.js");
jest.mock("../../src/core/custom-styles.js");

describe("Startup", () => {
    let mockGmi;
    let mockGame;
    let containerDiv;

    beforeEach(() => {
        mockGmi = {
            gmi: jest.fn(),
            embedVars: jest.fn(),
            setGmi: jest.fn(),
            startStatsTracking: jest.fn(),
            gameContainerId: "some-id",
        };
        createMockGmi(mockGmi);

        mockGame = createMockGame();
        containerDiv = domElement();

        jest.spyOn(global.document, "getElementById").mockImplementation(argument => {
            if (argument === mockGmi.gameContainerId) {
                return containerDiv;
            }
        });
        getBrowser.mockImplementation(() => ({ forceCanvas: false, isSilk: false }));
        jest.spyOn(styles, "addCustomStyles");
        jest.spyOn(Phaser, "Game").mockImplementation(() => mockGame);
        global.window.getGMI = jest.fn().mockImplementation(() => mockGmi);
        global.window.addEventListener = jest.fn();
        global.document = { head: { appendChild: jest.fn() } };
    });

    afterEach(() => jest.clearAllMocks());

    test("instantiates the GMI with correct params", () => {
        const fakeSettings = { settings: "some settings" };
        startup(fakeSettings, {});
        expect(gmiModule.setGmi).toHaveBeenCalledWith(fakeSettings, global.window);
    });

    test("injects custom styles to the game container element", () => {
        startup({}, {});
        expect(styles.addCustomStyles).toHaveBeenCalled();
    });

    test("creates a new Phaser game with correct config", () => {
        startup({}, {});

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
        expect(actualConfig.transparent).toBe(expectedConfig.transparent);
        expect(actualConfig.transparent).toBe(expectedConfig.transparent);
        expect(actualConfig.clearBeforeRender).toBe(expectedConfig.clearBeforeRender);
    });

    test("sets transparent config flag to false when Amazon Silk Browser", () => {
        const mockSilkBrowser = { name: "Amazon Silk", isSilk: true, version: "1.1.1" };
        getBrowser.mockImplementation(() => mockSilkBrowser);

        startup({}, {});
        const actualConfig = Phaser.Game.mock.calls[0][0];
        expect(actualConfig.transparent).toBe(true);
    });

    test("sets renderer to canvas when browser returns forceCanvas", () => {
        const mockSafari9 = { name: "Safari", forceCanvas: true };
        getBrowser.mockImplementation(() => mockSafari9);
        startup({}, {});
        const actualConfig = Phaser.Game.mock.calls[0][0];
        expect(actualConfig.renderer).toBe(1);
    });

    test("throws an error if the game container element cannot be found", () => {
        document.getElementById.mockImplementation(() => false);
        expect(startup).toThrow(); // eslint-disable-line quotes
    });

    describe("Hook errors", () => {
        test("adds an event listener to listen for errors", () => {
            startup({}, {});
            expect(global.window.addEventListener.mock.calls[0][0]).toBe("error");
        });

        test("finds the container div to display errors", () => {
            startup({}, {});
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
                startup({}, {});
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

    describe("onStarted Method", () => {
        beforeEach(() => {
            jest.spyOn(qaMode, "create").mockImplementation(() => {});
            // P3 TODO Accessibility
            // jest.spyOn(a11y, "setup").mockImplementation(() => {});
        });

        afterEach(() => {
            jest.clearAllMocks();
            delete global.window.__qaMode;
        });

        test("creates qaMode if the qaMode url parameter is set to true", () => {
            startup({}, {});
            expect(qaMode.create).toHaveBeenCalled();
        });

        test("additional debugging config is passed if url parameter is set", () => {
            qaMode.debugMode = jest.fn().mockImplementation(() => true);

            startup({}, {});
            const actualConfig = Phaser.Game.mock.calls[0][0];
            expect(actualConfig).toEqual(
                expect.objectContaining({
                    physics: {
                        default: "arcade",
                        arcade: {
                            debug: true,
                        },
                    },
                }),
            );
        });

        test("additional debugging config is not passed if url parameter is not set", () => {
            qaMode.debugMode = jest.fn().mockImplementation(() => false);
            startup({}, {});
            const actualConfig = Phaser.Game.mock.calls[0][0];
            expect(actualConfig).toEqual(
                expect.not.objectContaining({
                    physics: {
                        default: "arcade",
                        arcade: {
                            debug: true,
                        },
                    },
                }),
            );
        });
        // TODO P3 Accessibility
        // test("sets up the accessibility manager", () => {
        //     expect(a11y.setup).toHaveBeenCalledWith(mockGame.canvas.parentElement);
        // });
    });
});
