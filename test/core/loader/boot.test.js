/**
 * @copyright BBC 2018
 * @author BBC Children's D+E
 * @license Apache-2.0
 */

import { createMockGmi } from "../../mock/gmi.js";

import { Boot } from "../../../src/core/loader/boot.js";
import * as Scaler from "../../../src/core/scaler.js";
import * as a11y from "../../../src/core/accessibility/accessibility-layer.js";
import * as signal from "../../../src/core/signal-bus.js";

describe("Boot", () => {
    let bootScreen;
    let mockGmi;
    let mockGame;

    beforeEach(() => {
        mockGmi = {
            embedVars: { configPath: "test-config-path" },
            gameLoaded: jest.fn(),
            sendStatsEvent: jest.fn(),
            achievements: { init: jest.fn() },
            gameDir: "test-game-dir",
        };
        createMockGmi(mockGmi);
        mockGame = {
            canvas: {
                setAttribute: jest.fn(),
                parentElement: { appendChild: jest.fn() },
                focus: jest.fn(),
            },
            scale: {
                parentSize: 600,
            },
        };

        bootScreen = new Boot({});

        bootScreen.game = mockGame;
        bootScreen.load = {
            setBaseURL: jest.fn(),
            setPath: jest.fn(),
            json: jest.fn(),
        };
        bootScreen.scene = { key: "boot", start: jest.fn() };
        bootScreen.navigation = { next: jest.fn() };

        Scaler.init = jest.fn();
        a11y.setup = jest.fn();
    });

    afterEach(() => jest.clearAllMocks());

    describe("preload method", () => {
        test("Sets up loader paths correctly", () => {
            bootScreen.preload();

            expect(bootScreen.load.setBaseURL).toHaveBeenCalledWith(mockGmi.gameDir);
            expect(bootScreen.load.setPath).toHaveBeenCalledWith(mockGmi.embedVars.configPath);
        });

        test("Loads the config file and asset master pack as json", () => {
            bootScreen.preload();

            expect(bootScreen.load.json).toHaveBeenCalledWith("config", "config.json");
            expect(bootScreen.load.json).toHaveBeenCalledWith("asset-master-pack", "asset-master-pack.json");
        });

        test("Calls this.SetData with correct navigation and empty popupScreens array", () => {
            bootScreen.setData = jest.fn();
            bootScreen.preload();

            const expectedData = {
                popupScreens: [],
                transient: {},
                navigation: {
                    boot: { routes: { next: "loader" } },
                    loader: { routes: { next: "home" } },
                },
            };
            expect(bootScreen.setData).toHaveBeenCalledWith(expectedData);
        });

        test("focuses the canvas when settings are closed", () => {
            bootScreen.preload();
            signal.bus.publish({ channel: "genie-settings", name: "settings-closed" });
            expect(mockGame.canvas.focus).toHaveBeenCalled();
        });
    });

    describe("create method", () => {
        test("Sets game canvas attributes", () => {
            bootScreen.preload();
            bootScreen.create();

            expect(bootScreen.game.canvas.setAttribute).toHaveBeenCalledWith("tabindex", "-1");
            expect(bootScreen.game.canvas.setAttribute).toHaveBeenCalledWith("aria-hidden", "true");
        });

        test("Initialise scaler, font loader and accessibility", () => {
            bootScreen.preload();
            bootScreen.create();

            expect(Scaler.init).toHaveBeenCalledWith(600, mockGame);
            expect(bootScreen.navigation.next).toHaveBeenCalled();
            expect(a11y.setup).toHaveBeenCalledWith(mockGame.canvas.parentElement);
        });
    });
});
