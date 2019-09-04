/**
 * @copyright BBC 2018
 * @author BBC Children's D+E
 * @license Apache-2.0
 */
import { createMockGmi } from "../mock/gmi";
import { create as createSettings } from "../../src/core/settings.js";
import * as signal from "../../src/core/signal-bus.js";

jest.mock("../../src/core/accessibility/accessibility-layer.js");

describe("Settings", () => {
    let mockGame;
    let mockGmi;
    let settings;

    const createGmi = () => {
        mockGmi = { showSettings: jest.fn(() => "show settings"), getAllSettings: jest.fn() };
        createMockGmi(mockGmi);
    };

    beforeEach(() => {
        createGmi();
        jest.spyOn(signal.bus, "subscribe").mockImplementation(() => {});
        jest.spyOn(signal.bus, "publish").mockImplementation(() => {});

        const layout = [{ buttons: { pause: {} } }];

        mockGame = {
            state: {
                current: "current-screen",
                states: {
                    "current-screen": {
                        navigation: {
                            home: jest.fn(),
                            achievements: jest.fn(),
                        },
                        scene: {
                            getLayouts: jest.fn(() => layout),
                        },
                    },
                },
            },
        };

        settings = createSettings();
    });

    afterEach(() => jest.clearAllMocks());

    describe("show method", () => {
        test("returns GMI show settings", () => {
            const settingsShow = settings.show(mockGame);
            expect(settingsShow).toBe("show settings");
            expect(mockGmi.showSettings).toHaveBeenCalledTimes(1);
        });

        test("publishes a signal when a setting has been changed", () => {
            const expectedSignal = {
                channel: "genie-settings",
                name: "audio",
                data: false,
            };
            settings.show(mockGame);
            const onSettingChangedCallback = mockGmi.showSettings.mock.calls[0][0];
            onSettingChangedCallback("audio", false);
            expect(signal.bus.publish).toHaveBeenCalledTimes(1);
            expect(signal.bus.publish).toHaveBeenCalledWith(expectedSignal);
        });

        test("publishes a signal when settings has been closed", () => {
            const expectedSignal = {
                channel: "genie-settings",
                name: "settings-closed",
            };
            settings.show(mockGame);
            const onSettingsClosedCallback = mockGmi.showSettings.mock.calls[0][1];
            onSettingsClosedCallback();
            const publishConfig = signal.bus.publish.mock.calls[0][0];
            expect(signal.bus.publish).toHaveBeenCalledTimes(1);
            expect(publishConfig.channel).toBe(expectedSignal.channel);
            expect(publishConfig.name).toBe(expectedSignal.name);
        });
    });

    describe("getAllSettings method", () => {
        test("calls GMI get all settings", () => {
            settings.getAllSettings();
            expect(mockGmi.getAllSettings).toHaveBeenCalledTimes(1);
        });
    });
});
