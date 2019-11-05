/**
 * @copyright BBC 2018
 * @author BBC Children's D+E
 * @license Apache-2.0
 */
import * as layoutHarness from "../../src/core/qa/layout-harness.js";
import * as signal from "../../src/core/signal-bus.js";
import { buttonsChannel } from "../../src/core/layout/gel-defaults.js";

import { Home } from "../../src/components/home";

describe("Home Screen", () => {
    let homeScreen;
    let mockContext;

    beforeEach(() => {
        layoutHarness.createTestHarnessDisplay = jest.fn();

        mockContext = { config: { theme: { game: { achievements: undefined } } } };

        homeScreen = new Home();
        homeScreen.scene = { key: "home" };
        homeScreen.add = { image: jest.fn() };
        homeScreen.setLayout = jest.fn();
        homeScreen.navigation = { next: jest.fn() };
    });

    afterEach(() => jest.clearAllMocks());

    describe("create method", () => {
        beforeEach(() => {
            Object.defineProperty(homeScreen, "context", { get: jest.fn(() => mockContext) });
            homeScreen.create();
        });

        test("adds a background image", () => {
            expect(homeScreen.add.image).toHaveBeenCalledWith(0, 0, "home.background");
        });

        test("adds a title image", () => {
            expect(homeScreen.add.image).toHaveBeenCalledWith(0, -150, "home.title");
        });

        test("adds GEL buttons to layout", () => {
            const expectedButtons = ["exit", "howToPlay", "play", "audio", "settings"];
            expect(homeScreen.addLayout).toHaveBeenCalledWith(expectedButtons);
        });

        test("creates a layout harness with correct params", () => {
            expect(layoutHarness.createTestHarnessDisplay).toHaveBeenCalledWith(homeScreen);
        });
    });

    describe("Achievements button", () => {
        test("adds the achievement button when theme flag is set", () => {
            mockContext.config.theme.game.achievements = true;
            Object.defineProperty(homeScreen, "context", { get: jest.fn(() => mockContext) });
            homeScreen.create();
            const expectedButtons = ["exit", "howToPlay", "play", "audio", "settings", "achievements"];
            expect(homeScreen.addLayout).toHaveBeenCalledWith(expectedButtons);
        });
    });

    describe("Signals", () => {
        beforeEach(() => {
            jest.spyOn(signal.bus, "subscribe");
            Object.defineProperty(homeScreen, "context", { get: jest.fn(() => mockContext) });
            homeScreen.create();
        });

        test("adds a signal subscription to the play button", () => {
            expect(signal.bus.subscribe.mock.calls[0][0].channel).toBe(buttonsChannel(homeScreen));
            expect(signal.bus.subscribe.mock.calls[0][0].name).toBe("play");
        });

        test("adds a callback for the play button", () => {
            signal.bus.subscribe.mock.calls[0][0].callback();
            expect(homeScreen.navigation.next).toHaveBeenCalledTimes(1);
        });
    });
});
