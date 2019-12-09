/**
 * @copyright BBC 2018
 * @author BBC Children's D+E
 * @license Apache-2.0
 */
import * as layoutHarness from "../../src/core/qa/layout-harness.js";
import { eventBus } from "../../src/core/event-bus.js";
import { buttonsChannel } from "../../src/core/layout/gel-defaults.js";

import { Home } from "../../src/components/home";

describe("Home Screen", () => {
    let homeScreen;
    let mockData;

    beforeEach(() => {
        layoutHarness.createTestHarnessDisplay = jest.fn();
        homeScreen = new Home();

        mockData = {
            config: { theme: { game: { achievements: undefined }, home: {} } },
        };

        homeScreen.setData(mockData);
        homeScreen.scene = { key: "home" };
        homeScreen.add = { image: jest.fn() };
        homeScreen.setLayout = jest.fn();
        homeScreen.navigation = { next: jest.fn() };
    });

    afterEach(() => jest.clearAllMocks());

    describe("create method", () => {
        beforeEach(() => {
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
            expect(homeScreen.setLayout).toHaveBeenCalledWith(expectedButtons);
        });

        test("creates a layout harness with correct params", () => {
            expect(layoutHarness.createTestHarnessDisplay).toHaveBeenCalledWith(homeScreen);
        });
    });

    describe("Achievements button", () => {
        test("adds the achievement button when theme flag is set", () => {
            mockData.config.theme.game.achievements = true;
            homeScreen.create();
            const expectedButtons = ["exit", "howToPlay", "play", "audio", "settings", "achievements"];
            expect(homeScreen.setLayout).toHaveBeenCalledWith(expectedButtons);
        });
    });

    describe("Events", () => {
        beforeEach(() => {
            jest.spyOn(eventBus, "subscribe");
            homeScreen.create();
        });

        test("adds a event subscription to the play button", () => {
            expect(eventBus.subscribe.mock.calls[0][0].channel).toBe(buttonsChannel(homeScreen));
            expect(eventBus.subscribe.mock.calls[0][0].name).toBe("play");
        });

        test("adds a callback for the play button", () => {
            eventBus.subscribe.mock.calls[0][0].callback();
            expect(homeScreen.navigation.next).toHaveBeenCalledTimes(1);
        });
    });
});
