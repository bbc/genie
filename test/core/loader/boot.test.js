/**
 * @copyright BBC 2018
 * @author BBC Children's D+E
 * @license Apache-2.0
 */

import { createMockGmi } from "../../mock/gmi.js";

import { Boot } from "../../../src/core/loader/boot.js";
import * as Scaler from "../../../src/core/scaler.js";
import * as a11y from "../../../src/core/accessibility/accessibility-layer.js";
import * as event from "../../../src/core/event-bus.js";

describe("Boot", () => {
    let bootScreen;
    let mockGmi;
    let mockGame;
    let mockAudioButton;
    let mockSettings;

    beforeEach(() => {
        mockSettings = { audio: true };
        mockGmi = {
            embedVars: { configPath: "test-config-path" },
            gameLoaded: jest.fn(),
            sendStatsEvent: jest.fn(),
            achievements: { init: jest.fn() },
            gameDir: "test-game-dir",
            getAllSettings: jest.fn(() => mockSettings),
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

        mockAudioButton = {
            setImage: jest.fn(),
        };

        bootScreen = new Boot({});

        bootScreen.game = mockGame;
        bootScreen.load = {
            setBaseURL: jest.fn(),
            setPath: jest.fn(),
            json: jest.fn(),
        };
        bootScreen.scene = {
            key: "boot",
            start: jest.fn(),
            manager: { getScenes: jest.fn(() => [{ layout: { buttons: { audio: mockAudioButton } } }]) },
        };
        bootScreen.navigation = { next: jest.fn() };

        bootScreen.sound = { mute: false };

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
                parentScreens: [],
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
            event.bus.publish({ channel: "genie-settings", name: "settings-closed" });
            expect(mockGame.canvas.focus).toHaveBeenCalled();
        });

        describe("audio setting callback", () => {
            test("Disables audio and sets button image to audio-on when mute is false", () => {
                bootScreen.preload();
                event.bus.publish({ channel: "genie-settings", name: "audio", data: false });
                expect(bootScreen.sound.mute).toBe(false);
                expect(mockAudioButton.setImage).toHaveBeenCalledWith("audio-on");
            });

            test("Enables audio and sets button image to audio-off when mute is true", () => {
                mockSettings.audio = false;
                bootScreen.preload();
                event.bus.publish({ channel: "genie-settings", name: "audio", data: true });
                expect(bootScreen.sound.mute).toBe(true);
                expect(mockAudioButton.setImage).toHaveBeenCalledWith("audio-off");
            });

            test("Toggles audio on the scenes that are sleeping as well as the active ones", () => {
                const mockAudioButton2 = { setImage: jest.fn() };
                const mockScenes = [
                    { layout: { buttons: { audio: mockAudioButton } } },
                    { layout: { buttons: { audio: mockAudioButton2 } } },
                    undefined,
                ];
                bootScreen.scene.manager.getScenes.mockReturnValue(mockScenes);
                bootScreen.preload();
                event.bus.publish({ channel: "genie-settings", name: "audio", data: false });
                expect(bootScreen.sound.mute).toBe(false);
                expect(mockAudioButton.setImage).toHaveBeenCalledWith("audio-on");
                expect(mockAudioButton2.setImage).toHaveBeenCalledWith("audio-on");
            });
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
        });
    });
});
