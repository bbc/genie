/**
 * @copyright BBC 2018
 * @author BBC Children's D+E
 * @license Apache-2.0
 */

import * as ButtonFactory from "../../../src/core/layout/button-factory";
import * as GelButton from "../../../src/core/layout/gel-button";
import * as accessibilify from "../../../src/core/accessibility/accessibilify";
import * as signal from "../../../src/core/signal-bus.js";
import * as settingsModule from "../../../src/core/settings.js";

jest.mock("../../../src/core/settings.js");

describe("Layout - Button Factory", () => {
    let buttonFactory;
    let mockGame;

    beforeEach(() => {
        jest.spyOn(accessibilify, "accessibilify").mockImplementation(() => {});
        jest.spyOn(GelButton, "GelButton").mockImplementation(() => {});

        mockGame = { canvas: () => {}, mockGame: "game" };
        buttonFactory = ButtonFactory.create(mockGame);
    });

    afterEach(() => jest.clearAllMocks());

    describe("create method", () => {
        test("returns correct methods", () => {
            expect(buttonFactory.createButton).toBeDefined();
        });
    });

    describe("createButton method", () => {
        const expectedIsMobile = false;
        const expectedKey = "play";
        const config = {
            id: "expectedId",
            ariaLabel: "expectedAriaLabel",
            key: expectedKey,
            action: () => {},
        };

        beforeEach(() => {
            buttonFactory.createButton(expectedIsMobile, config);
        });

        test("creates a GEL button", () => {
            const actualParams = GelButton.GelButton.mock.calls[0];
            expect(actualParams.length).toEqual(5);
            expect(actualParams[0]).toEqual(mockGame);
            expect(actualParams[1]).toBe(0);
            expect(actualParams[2]).toBe(0);
            expect(actualParams[3]).toEqual(expectedIsMobile);
            expect(actualParams[4]).toEqual(config);
        });

        test("makes the button accessible", () => {
            expect(accessibilify.accessibilify).toHaveBeenCalled();
        });

        test("adds defaults actions to the signal bus", () => {
            const buttonsChannel = "buttonsChannel";
            const config = {
                key: "play",
                action: jest.fn(),
                channel: buttonsChannel,
            };
            signal.bus.removeChannel(buttonsChannel);

            buttonFactory.createButton(expectedIsMobile, config);

            signal.bus.publish({ channel: buttonsChannel, name: "play" });
            signal.bus.publish({ channel: buttonsChannel, name: "play" });

            expect(config.action).toHaveBeenCalledTimes(2);

            signal.bus.removeChannel(buttonsChannel);
        });

        test("disables hitArea and input for icons", () => {
            const config = {
                title: "FX Off",
                icon: true,
            };

            const btn = buttonFactory.createButton(false, config);

            expect(btn.hitArea).toBe(null);
            expect(btn.inputEnabled).toBe(false);
        });
    });

    describe("audio button", () => {
        test("sets audio button config key to audio-on if gmi audio setting is true", () => {
            const mockSettings = { getAllSettings: () => ({ audio: true }) };
            Object.defineProperty(settingsModule, "settings", {
                get: jest.fn(() => mockSettings),
            });

            buttonFactory.createButton(false, { id: "__audio" });
            expect(GelButton.GelButton.mock.calls[0][4].key).toBe("audio-on");
        });

        test("sets audio button config key to audio-off if gmi audio setting is true", () => {
            const mockSettings = { getAllSettings: () => ({ audio: false }) };
            Object.defineProperty(settingsModule, "settings", {
                get: jest.fn(() => mockSettings),
            });

            buttonFactory.createButton(false, { id: "__audio" });

            expect(GelButton.GelButton.mock.calls[0][4].key).toBe("audio-off");
        });
    });
});
