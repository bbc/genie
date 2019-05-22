/**
 * @copyright BBC 2018
 * @author BBC Children's D+E
 * @license Apache-2.0
 */
import { createMockGmi } from "../mock/gmi";
import { domElement } from "../mock/dom-element";
import { createMockGame } from "../mock/game.js";

import { startup } from "../../src/core/startup.js";
import { getBrowser } from "../../src/core/browser.js";
import * as gmiModule from "../../src/core/gmi/gmi.js";
import * as Scene from "../../src/core/scene.js";
import * as LoadFonts from "../../src/core/font-loader.js";
import * as Navigation from "../../src/core/navigation.js";
import * as styles from "../../src/core/custom-styles.js";
import * as qaMode from "../../src/core/qa/qa-mode.js";
import * as a11y from "../../src/core/accessibility/accessibility-layer.js";
import * as fullscreen from "../../src/core/fullscreen.js";

jest.mock("../../src/core/browser.js");

describe("Startup", () => {
    let mockGmi;
    let mockGame;
    let containerDiv;

    beforeEach(() => {
        mockGmi = {
            gmi: jest.fn(),
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
    });

    afterEach(() => jest.clearAllMocks());

    test("instantiates the GMI with correct params", () => {
        const fakeSettings = { settings: "some settings" };
        startup(fakeSettings);
        expect(gmiModule.setGmi).toHaveBeenCalledWith(fakeSettings, global.window);
    });

    test("injects custom styles to the game container element", () => {
        startup();
        expect(styles.addCustomStyles).toHaveBeenCalled();
    });

    test("creates a new Phaser game with correct config", () => {
        startup();

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

    it("sets transparent config flag to false when Amazon Silk Browser", () => {
        const mockSilkBrowser = { name: "Amazon Silk", isSilk: true, version: "1.1.1" };
        getBrowser.mockImplementation(() => mockSilkBrowser);

        startup();
        const actualConfig = Phaser.Game.mock.calls[0][0];
        expect(actualConfig.transparent).toBe(true);
    });

    it("sets renderer to canvas when browser returns forceCanvas", () => {
        const mockSafari9 = { name: "Safari", forceCanvas: true };
        getBrowser.mockImplementation(() => mockSafari9);
        startup();
        const actualConfig = Phaser.Game.mock.calls[0][0];
        expect(actualConfig.renderer).toBe(1);
    });

    test("throws an error if the game container element cannot be found", () => {
        document.getElementById.mockImplementation(() => false);
        expect(startup).toThrow(); // eslint-disable-line quotes
    });

    describe("onStarted()", () => {
        beforeEach(() => {
            jest.spyOn(Scene, "create").mockImplementation(() => "Scene");
            jest.spyOn(LoadFonts, "loadFonts").mockImplementation(() => {});
            jest.spyOn(Navigation, "create").mockImplementation(() => {});
            jest.spyOn(qaMode, "create").mockImplementation(() => {});
            jest.spyOn(a11y, "setup").mockImplementation(() => {});
            jest.spyOn(fullscreen, "listenForTap").mockImplementation(() => {});

            startup({}, "NavConfig");
            const game = Phaser.Game.mock.calls[0][0];
            game.state._onStarted();
        });

        afterEach(() => {
            jest.clearAllMocks();
            delete global.window.__qaMode;
        });

        test("creates the scene", () => {
            expect(Scene.create).toHaveBeenCalledWith(mockGame);
        });

        test("loads the fonts", () => {
            expect(LoadFonts.loadFonts).toHaveBeenCalledWith(mockGame, expect.any(Function));
        });

        test("creates the game navigation", () => {
            const onComplete = LoadFonts.loadFonts.mock.calls[0][1];
            onComplete();
            expect(Navigation.create.mock.calls[0]).toEqual([mockGame.state, expect.any(Object), "Scene", "NavConfig"]);
        });

        test("creates qaMode if the qaMode url parameter is set to true", () => {
            const onComplete = LoadFonts.loadFonts.mock.calls[0][1];
            onComplete();
            expect(qaMode.create).toHaveBeenCalled();
        });
        test("starts the stats tracking through the GMI", () => {
            const expectedContext = {
                popupScreens: [],
                gameMuted: true,
            };
            const statsParams = gmiModule.startStatsTracking.mock.calls[0];
            expect(statsParams[0]).toEqual(mockGame);
            expect(JSON.stringify(statsParams[1])).toEqual(JSON.stringify(expectedContext));
        });

        it("sets up the accessibility manager", () => {
            const onComplete = LoadFonts.loadFonts.mock.calls[0][1];
            onComplete();
            expect(a11y.setup).toHaveBeenCalledWith(mockGame.canvas.parentElement);
        });

        it("sets up the fullscreen API", () => {
            const onComplete = LoadFonts.loadFonts.mock.calls[0][1];
            onComplete();
            expect(fullscreen.listenForTap.mock.calls[0]).toEqual([mockGame.canvas.parentElement, mockGame]);
        });
    });
});
