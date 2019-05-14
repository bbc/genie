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

        it("adds a background image", () => {
            expect(homeScreen.game.add.image).toHaveBeenCalledWith(0, 0, "home.background");
            expect(homeScreen.scene.addToBackground).toHaveBeenCalledWith("home.background");
        });

        it("adds a title image", () => {
            expect(homeScreen.game.add.image).toHaveBeenCalledWith(0, -150, "home.title");
            expect(homeScreen.scene.addToBackground).toHaveBeenCalledWith("home.title");
        });

        it("adds GEL buttons to layout", () => {
            const expectedButtons = ["exit", "howToPlay", "play", "audio", "settings"];
            expect(homeScreen.scene.addLayout).toHaveBeenCalledWith(expectedButtons);
        });

    //     it("creates a layout harness with correct params", () => {
    //         const actualParams = layoutHarnessSpy.getCall(0).args;
    //         const expectedParams = [mockGame, mockContext, homeScreen.scene];
    //         expect(layoutHarnessSpy.callCount === 1).toBeTruthy();
    //         expect(actualParams).toEqual(expectedParams);
    //     });
    // });
    //
    // describe("achievements button", () => {
    //     it("adds the achievement button when theme flag is set", () => {
    //         homeScreen.context.config.theme.game.achievements = true;
    //         homeScreen.create();
    //
    //         const actualButtons = addLayoutSpy.getCall(0).args[0];
    //         const expectedButtons = ["exit", "howToPlay", "play", "audio", "settings", "achievements"];
    //         expect(actualButtons).toEqual(expectedButtons);
    //     });
    // });
    //
    // describe("signals", () => {
    //     let signalSubscribeSpy;
    //
    //     beforeEach(() => {
    //         signalSubscribeSpy = sandbox.spy(signal.bus, "subscribe");
    //         homeScreen.create();
    //     });
    //
    //     it("adds a signal subscription to the play button", () => {
    //         expect(signalSubscribeSpy.getCall(0).args[0].channel).toEqual(buttonsChannel);
    //         expect(signalSubscribeSpy.getCall(0).args[0].name).toEqual("play");
    //     });
    //
    //     it("adds a callback for the play button", () => {
    //         signalSubscribeSpy.getCall(0).args[0].callback();
    //         expect(homeScreen.navigation.next.callCount === 1).toBeTruthy();
    //     });
    });
});
