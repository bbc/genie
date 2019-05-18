/**
 * @copyright BBC 2018
 * @author BBC Children's D+E
 * @license Apache-2.0
 */
import { createMockGmi } from "../fake/gmi";
import { domElement } from "../fake/dom-element";

import { startup } from "../../src/core/startup.js";
import * as gmiModule from "../../src/core/gmi/gmi.js";
import * as Game from "../fake/game.js";
import * as Scene from "../../src/core/scene.js";
import * as LoadFonts from "../../src/core/font-loader.js";
import * as Navigation from "../../src/core/navigation.js";
import * as styles from "../../src/core/custom-styles.js";
import * as qaMode from "../../src/core/qa/qa-mode.js";

describe("Startup", () => {
    let mockGmi;
    let containerDiv;

    beforeEach(() => {
        mockGmi = {
            gmi: jest.fn(),
            setGmi: jest.fn(),
            startStatsTracking: jest.fn(),
            gameContainerId: "some-id",
        };
        createMockGmi(mockGmi);

        containerDiv = domElement();

        jest.spyOn(global.document, "getElementById").mockImplementation(argument => {
            if (argument === mockGmi.gameContainerId) {
                return containerDiv;
            }
        });
        jest.spyOn(styles, "addCustomStyles");
        jest.spyOn(Phaser, "Game").mockImplementation(() => Game.Stub);
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
            renderer: 1,
            antialias: true,
            multiTexture: false,
            parent: containerDiv,
            transparent: true,
        };

        const actualConfig = Phaser.Game.mock.calls[0][0];

        expect(actualConfig.width).toBe(expectedConfig.width);
        expect(actualConfig.height).toBe(expectedConfig.height);
        expect(actualConfig.renderer).toBe(expectedConfig.renderer);
        expect(actualConfig.antialias).toBe(expectedConfig.antialias);
        expect(actualConfig.multiTexture).toBe(expectedConfig.multiTexture);
        expect(actualConfig.parent).toEqual(expectedConfig.parent);
        expect(actualConfig.transparent).toBe(expectedConfig.transparent);
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

            startup({}, "NavConfig");
            const game = Phaser.Game.mock.calls[0][0];
            game.state._onStarted();
        });

        afterEach(() => {
            jest.clearAllMocks();
            delete global.window.__qaMode;
        });

        test("creates the scene", () => {
            expect(Scene.create).toHaveBeenCalledWith(Game.Stub);
        });

        test("loads the fonts", () => {
            expect(LoadFonts.loadFonts).toHaveBeenCalledWith(Game.Stub, expect.any(Function));
        });

        test("creates the game navigation", () => {
            const onComplete = LoadFonts.loadFonts.mock.calls[0][1];
            onComplete();
            expect(Navigation.create.mock.calls[0]).toEqual([
                Game.Stub.state,
                expect.any(Object),
                "Scene",
                "NavConfig",
            ]);
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
            expect(statsParams[0]).toEqual(Game.Stub);
            expect(JSON.stringify(statsParams[1])).toEqual(JSON.stringify(expectedContext));
        });
    });
});
