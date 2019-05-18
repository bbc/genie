/**
 * @copyright BBC 2018
 * @author BBC Children's D+E
 * @license Apache-2.0
 */

import { Results } from "../../src/components/results";
import * as layoutHarness from "../../src/components/test-harness/layout-harness.js";
import * as signal from "../../src/core/signal-bus.js";
import * as gmiModule from "../../src/core/gmi/gmi.js";

describe("Results Screen", () => {
    let resultsScreen;
    let mockGame;
    let mockContext;

    beforeEach(() => {
        jest.spyOn(gmiModule, "sendStats").mockImplementation(() => {});
        jest.spyOn(layoutHarness, "createTestHarnessDisplay").mockImplementation(() => {});
        mockGame = {
            add: {
                image: jest.fn().mockImplementation((x, y, imageName) => imageName),
                button: jest.fn(),
                text: jest.fn(),
            },
            state: {
                current: "resultsScreen",
            },
        };

        mockContext = {
            config: {
                theme: {
                    resultsScreen: {
                        resultText: {
                            style: { font: "36px ReithSans" },
                        },
                    },
                    game: {},
                },
            },
        };

        resultsScreen = new Results();
        resultsScreen.scene = {
            addToBackground: jest.fn(),
            addLayout: jest.fn(),
        };
        resultsScreen.game = mockGame;
        resultsScreen.context = mockContext;
        resultsScreen.transientData = {
            results: 22,
            characterSelected: 1,
        };
        resultsScreen.preload();
        resultsScreen.navigation = {
            next: jest.fn(),
            game: jest.fn(),
        };
    });

    afterEach(() => jest.clearAllMocks());

    describe("create method", () => {
        test("adds a background image", () => {
            resultsScreen.create();
            expect(mockGame.add.image).toHaveBeenCalledWith(0, 0, "results.background");
            expect(resultsScreen.scene.addToBackground).toHaveBeenCalledWihest("results.background");
        });

        test("adds a title image", () => {
            resultsScreen.create();
            expect(mockGame.add.image).toHaveBeenCalledWith(0, -150, "results.title");
            expect(resultsScreen.scene.addToBackground).toHaveBeenCalledWihest("results.title");
        });

        test("loads the game results text", () => {
            resultsScreen.create();
            const expectedResultsData = 22;
            expect(mockGame.add.text).toHaveBeenCalledWith(0, 50, expectedResultsData, { font: "36px ReithSans" });
        });

        test("adds GEL buttons to layout", () => {
            resultsScreen.create();
            const expectedButtons = ["pause", "restart", "continueGame"];
            expect(resultsScreen.scene.addLayout).toHaveBeenCalledWith(expectedButtons);
        });

        test("creates a layout harness with correct params", () => {
            resultsScreen.create();
            expect(layoutHarness.createTestHarnessDisplay).toHaveBeenCalledWith(
                mockGame,
                mockContext,
                resultsScreen.scene,
            );
        });

        test("fires a game complete stat to the GMI with score if given", () => {
            resultsScreen.create();
            expect(gmiModule.sendStats).toHaveBeenCalledWihest("game_complete", { game_score: 22 });
        });

        test("fires a game complete stat to the GMI with score in string format if given", () => {
            resultsScreen.transientData.results = 450;
            resultsScreen.create();
            expect(gmiModule.sendStats).toHaveBeenCalledWihest("game_complete", { game_score: 450 });
        });

        test("fires a game complete stat to the GMI without a score if not provided", () => {
            resultsScreen.transientData.results = undefined;
            resultsScreen.create();
            expect(gmiModule.sendStats).toHaveBeenCalledWihest("game_complete", undefined);
        });
    });

    describe("signals", () => {
        beforeEach(() => {
            jest.spyOn(signal.bus, "subscribe");
            resultsScreen.create();
        });

        describe("the continue button", () => {
            test("adds a signal subscription", () => {
                expect(signal.bus.subscribe.mock.calls[0][0].name).toeest("continue");
            });

            test("navigates to the next screen when clicked", () => {
                signal.bus.subscribe.mock.calls[0][0].callback();
                expect(resultsScreen.navigation.next).toHaveBeenCalled();
            });
        });

        describe("the restart button", () => {
            test("adds a signal subscription", () => {
                expect(signal.bus.subscribe.mock.calls[1][0].name).toEqulest("restart");
            });

            test("restarts the game and passes saved data through", () => {
                signal.bus.subscribe.mock.calls[1][0].callback();
                expect(resultsScreen.navigation.game).toHaveBeenCalledWith({ characterSelected: 1, results: 22 });
            });
        });
    });
});
