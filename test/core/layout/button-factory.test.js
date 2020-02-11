/**
 * @copyright BBC 2018
 * @author BBC Children's D+E
 * @license Apache-2.0
 */

import * as ButtonFactory from "../../../src/core/layout/button-factory";
import * as GelButton from "../../../src/core/layout/gel-button";
import * as accessibilify from "../../../src/core/accessibility/accessibilify";
import { eventBus } from "../../../src/core/event-bus.js";
import * as settingsModule from "../../../src/core/settings.js";

jest.mock("../../../src/core/settings.js");

describe("Layout - Button Factory", () => {
    let buttonFactory;
    let mockGame;

    beforeEach(() => {
        jest.spyOn(accessibilify, "accessibilify").mockImplementation(() => {});
        jest.spyOn(GelButton, "GelButton").mockImplementation(() => ({
            disableInteractive: jest.fn(),
            input: {},
        }));

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
        const expectedKey = "play";
        const config = {
            id: "expectedId",
            ariaLabel: "expectedAriaLabel",
            key: expectedKey,
            action: () => {},
        };

        beforeEach(() => {
            buttonFactory.createButton(config);
        });

        test("creates a GEL button", () => {
            const actualParams = GelButton.GelButton.mock.calls[0];
            expect(actualParams.length).toEqual(4);
            expect(actualParams[0]).toEqual(mockGame);
            expect(actualParams[1]).toBe(0);
            expect(actualParams[2]).toBe(0);
            expect(actualParams[3]).toEqual(config);
        });

        test("adds defaults actions to the event bus", () => {
            const buttonsChannel = "buttonsChannel";
            const config = {
                id: "play",
                action: jest.fn(),
                channel: buttonsChannel,
            };

            buttonFactory.createButton(config);

            eventBus.publish({ channel: buttonsChannel, name: "play" });
            eventBus.publish({ channel: buttonsChannel, name: "play" });

            expect(config.action).toHaveBeenCalledTimes(2);
            eventBus.removeChannel(buttonsChannel);
        });

        test("disables hitArea and input for icons", () => {
            const config = {
                title: "FX Off",
                icon: true,
            };

            const btn = buttonFactory.createButton(config);

            expect(btn.input.hitArea).toBe(null);
            expect(btn.disableInteractive).toHaveBeenCalledTimes(1);
        });
    });

    describe("audio button", () => {
        test("sets audio button config key to audio-on if gmi audio setting is true", () => {
            const mockSettings = { getAllSettings: () => ({ audio: true }) };
            Object.defineProperty(settingsModule, "settings", {
                get: jest.fn(() => mockSettings),
            });

            buttonFactory.createButton({ id: "__audio" });
            expect(GelButton.GelButton.mock.calls[0][3].key).toBe("audio-on");
        });

        test("sets audio button config key to audio-off if gmi audio setting is true", () => {
            const mockSettings = { getAllSettings: () => ({ audio: false }) };
            Object.defineProperty(settingsModule, "settings", {
                get: jest.fn(() => mockSettings),
            });

            buttonFactory.createButton({ id: "__audio" });

            expect(GelButton.GelButton.mock.calls[0][3].key).toBe("audio-off");
        });
    });
});
