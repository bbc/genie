/**
 * @copyright BBC 2018
 * @author BBC Children's D+E
 * @license Apache-2.0
 */
import { create as createSettings } from "../../src/core/settings.js";
import * as signal from "../../src/core/signal-bus.js";
import * as gmiModule from "../../src/core/gmi/gmi.js";

jest.mock("../../src/core/gmi/gmi.js");

describe("Settings", () => {
    let mockGmi;
    let settings;

    const createMockGmi = () => {
        mockGmi = {
            showSettings: jest.fn(),
            getAllSettings: jest.fn(),
        };
        Object.defineProperty(gmiModule, "gmi", {
            get: jest.fn(() => mockGmi),
            set: jest.fn(),
        });
        jest.spyOn(gmiModule, "sendStats");
    };

    beforeEach(() => {
        createMockGmi();
        jest.spyOn(signal.bus, "publish");
        settings = createSettings();
    });

    afterEach(() => jest.clearAllMocks());

    describe("show method", () => {
        beforeEach(() => settings.show());

        it("calls GMI show settings", () => {
            expect(mockGmi.showSettings).toHaveBeenCalledTimes(1);
        });

        it("publishes a signal when a setting has been changed", () => {
            const expectedSignal = {
                channel: "genie-settings",
                name: "audio",
                data: false,
            };
            const onSettingChangedCallback = mockGmi.showSettings.mock.calls[0][0];
            onSettingChangedCallback("audio", false);
            expect(signal.bus.publish).toHaveBeenCalledTimes(1);
            expect(signal.bus.publish).toHaveBeenCalledWith(expectedSignal);
        });

        it("publishes a signal when settings has been closed", () => {
            const expectedSignal = {
                channel: "genie-settings",
                name: "settings-closed",
            };
            const onSettingsClosedCallback = mockGmi.showSettings.mock.calls[0][1];
            onSettingsClosedCallback();
            expect(signal.bus.publish).toHaveBeenCalledTimes(1);
            expect(signal.bus.publish).toHaveBeenCalledWith(expectedSignal);
        });
    });

    describe("getAllSettings method", () => {
        it("calls GMI get all settings", () => {
            settings.getAllSettings();
            expect(mockGmi.getAllSettings).toHaveBeenCalledTimes(1);
        });
    });
});
