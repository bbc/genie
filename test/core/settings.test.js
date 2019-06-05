/**
 * @copyright BBC 2018
 * @author BBC Children's D+E
 * @license Apache-2.0
 */
import { createMockGmi } from "../mock/gmi";

import { setAccessibleLayer } from "../../src/core/accessibility/accessibility-layer.js";
import { create as createSettings } from "../../src/core/settings.js";
import * as signal from "../../src/core/signal-bus.js";

jest.mock("../../src/core/accessibility/accessibility-layer.js");

describe("Settings", () => {
    let mockGame;
    let mockGmi;
    let settings;

    const createGmi = () => {
        mockGmi = {
            showSettings: jest.fn(() => "show settings"),
            getAllSettings: jest.fn(),
            setStatsScreen: jest.fn(),
        };
        createMockGmi(mockGmi);
    };

    beforeEach(() => {
        setAccessibleLayer.mockImplementation(() => {});
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

    test("subscribes to the settingas-closed signal on create", () => {
        const subscribeCall = signal.bus.subscribe.mock.calls[0][0];
        expect(subscribeCall.channel).toBe("genie-settings");
        expect(subscribeCall.name).toBe("settings-closed");
    });

    test("sets the accessible layer to true when the settingas-closed signal is fired", () => {
        const subscribeCallback = signal.bus.subscribe.mock.calls[0][0].callback;
        subscribeCallback();
        expect(setAccessibleLayer).toHaveBeenCalledWith(true);
    });

    describe("show method", () => {
        test("sets the accessible layer to false", () => {
            settings.show(mockGame);
            expect(setAccessibleLayer).toHaveBeenCalledWith(false);
        });

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

        test("sets the stats screen back when settings is closed", () => {
            settings.show(mockGame);
            const onSettingsClosedCallback = mockGmi.showSettings.mock.calls[0][1];
            onSettingsClosedCallback();
            const subscribeCallback = signal.bus.subscribe.mock.calls[0][0].callback;
            subscribeCallback();

            expect(mockGmi.setStatsScreen).toHaveBeenCalledWith("current-screen");
        });
    });

    describe("getAllSettings method", () => {
        test("calls GMI get all settings", () => {
            settings.getAllSettings();
            expect(mockGmi.getAllSettings).toHaveBeenCalledTimes(1);
        });
    });
});
