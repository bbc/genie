/**
 * @copyright BBC 2018
 * @author BBC Children's D+E
 * @license Apache-2.0
 */
import { Home } from "../../src/components/home";
import * as layoutHarness from "../../src/components/test-harness/layout-harness.js";
import * as signal from "../../src/core/signal-bus.js";
import { buttonsChannel } from "../../src/core/layout/gel-defaults.js";

describe("Home Screen", () => {
    let homeScreen;
    let mockGame;
    let mockContext;

    beforeEach(() => {
        jest.spyOn(layoutHarness, "createTestHarnessDisplay");
        mockGame = {
            add: {
                image: jest.fn().mockImplementation((x, y, imageName) => imageName),
                button: jest.fn(),
            },
            state: {
                current: "homeScreen",
            },
        };

        mockContext = {
            config: { theme: { home: {}, game: {} } },
        };

        homeScreen = new Home();
        homeScreen.scene = {
            addToBackground: jest.fn(),
            addLayout: jest.fn(),
        };
        homeScreen.navigation = {
            next: jest.fn(),
        };
        homeScreen.game = mockGame;
        homeScreen.context = mockContext;
        homeScreen.preload();
    });

    afterEach(() => jest.clearAllMocks());

    describe("create method", () => {
        beforeEach(() => homeScreen.create());

        test("adds a background image", () => {
            expect(homeScreen.game.add.image).toHaveBeenCalledWith(0, 0, "home.background");
            expect(homeScreen.scene.addToBackground).toHaveBeenCalledWith("home.background");
        });

        test("adds a title image", () => {
            expect(homeScreen.game.add.image).toHaveBeenCalledWith(0, -150, "home.title");
            expect(homeScreen.scene.addToBackground).toHaveBeenCalledWith("home.title");
        });

        test("adds GEL buttons to layout", () => {
            const expectedButtons = ["exit", "howToPlay", "play", "audio", "settings"];
            expect(homeScreen.scene.addLayout).toHaveBeenCalledWith(expectedButtons);
        });

        test("creates a layout harness with correct params", () => {
            expect(layoutHarness.createTestHarnessDisplay).toHaveBeenCalledWith(
                mockGame,
                mockContext,
                homeScreen.scene,
            );
        });
    });

    describe("achievements button", () => {
        test("adds the achievement button when theme flag is set", () => {
            homeScreen.context.config.theme.game.achievements = true;
            homeScreen.create();
            const expectedButtons = ["exit", "howToPlay", "play", "audio", "settings", "achievements"];
            expect(homeScreen.scene.addLayout).toHaveBeenCalledWith(expectedButtons);
        });
    });

    describe("signals", () => {
        beforeEach(() => {
            jest.spyOn(signal.bus, "subscribe");
            homeScreen.create();
        });

        test("adds a signal subscription to the play button", () => {
            expect(signal.bus.subscribe.mock.calls[0][0].channel).toBe(buttonsChannel);
            expect(signal.bus.subscribe.mock.calls[0][0].name).toBe("play");
        });

        test("adds a callback for the play button", () => {
            signal.bus.subscribe.mock.calls[0][0].callback();
            expect(homeScreen.navigation.next).toHaveBeenCalledTimes(1);
        });
    });
});
