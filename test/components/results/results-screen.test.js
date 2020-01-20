/**
 * @copyright BBC 2018
 * @author BBC Children's D+E
 * @license Apache-2.0
 */
import { createMockGmi } from "../../mock/gmi.js";
import * as Scaler from "../../../src/core/scaler.js";
import { eventBus } from "../../../src/core/event-bus.js";
import * as Rows from "../../../src/core/layout/rows.js";

import { Results } from "../../../src/components/results/results-screen.js";

jest.mock("../../../src/core/layout/rows.js");
jest.mock("../../../src/core/screen.js");

describe("Results Screen", () => {
    let resultsScreen;
    let mockConfig;
    let mockTransientData;
    let mockGmi;
    let mockTextAdd;

    beforeEach(() => {
        Scaler.getMetrics = jest.fn();
        mockConfig = {
            theme: {
                resultsScreen: {
                    resultText: {
                        style: { font: "36px ReithSans" },
                    },
                    rows: [],
                },
                game: {},
            },
        };
        mockTransientData = {
            results: 22,
            characterSelected: 1,
        };

        mockGmi = { sendStatsEvent: jest.fn() };
        createMockGmi(mockGmi);

        mockTextAdd = {
            setOrigin: jest.fn(() => ({
                setInteractive: jest.fn(() => ({
                    on: jest.fn(),
                })),
            })),
        };
        resultsScreen = new Results();
        resultsScreen.layout = {
            addCustomGroup: jest.fn(),
            buttons: {
                next: {},
                previous: {},
            },
            groups: {
                bottomCenter: {
                    y: 121,
                },
            },
        };
        resultsScreen.context = { config: mockConfig, transientData: mockTransientData };
        resultsScreen.transientData = mockTransientData;
        resultsScreen.addAnimations = jest.fn(() => () => {});
        resultsScreen.setLayout = jest.fn();
        resultsScreen.add = {
            image: jest.fn().mockImplementation((x, y, imageName) => imageName),
            text: jest.fn(() => mockTextAdd),
        };
        resultsScreen.scene = {
            key: "resultsScreen",
        };
        resultsScreen.navigation = {
            next: jest.fn(),
            game: jest.fn(),
        };
    });

    afterEach(() => jest.clearAllMocks());

    describe("Create Method", () => {
        test("adds a background image", () => {
            resultsScreen.create();
            expect(resultsScreen.add.image).toHaveBeenCalledWith(0, 0, "results.background");
        });

        test("adds a title image", () => {
            resultsScreen.create();
            expect(resultsScreen.add.image).toHaveBeenCalledWith(0, -150, "results.title");
        });

        test("loads the game results text", () => {
            resultsScreen.create();
            const expectedResultsData = 22;
            expect(resultsScreen.add.text).toHaveBeenCalledWith(0, 50, expectedResultsData, { font: "36px ReithSans" });
        });

        test("adds GEL buttons to layout", () => {
            resultsScreen.create();
            const expectedButtons = ["pause", "restart", "continueGame"];
            expect(resultsScreen.setLayout).toHaveBeenCalledWith(expectedButtons);
        });

        test("creates rows for the results screen", () => {
            resultsScreen.create();
            expect(Rows.create).toHaveBeenCalledWith(
                resultsScreen,
                expect.any(Function),
                resultsScreen.theme.rows,
                Rows.RowType.Results,
            );
        });

        test("adds the achievement button when theme flag is set", () => {
            resultsScreen.context.config.theme.game.achievements = true;
            resultsScreen.create();
            const expectedButtons = ["pause", "restart", "continueGame", "next", "previous", "achievementsSmall"];
            expect(resultsScreen.setLayout).toHaveBeenCalledWith(expectedButtons);
        });

        describe("Stats", () => {
            test("fires a score stat with results if given as a number", () => {
                resultsScreen.transientData.results = 45;
                resultsScreen.create();
                expect(mockGmi.sendStatsEvent).toHaveBeenCalledWith("score", "display", { metadata: "SCO=[45]" });
            });

            test("fires a score stat with results if given as a string with numbers in", () => {
                resultsScreen.transientData.results = "Your score is 593";
                resultsScreen.create();
                expect(mockGmi.sendStatsEvent).toHaveBeenCalledWith("score", "display", { metadata: "SCO=[593]" });
            });

            test("fires a score stat without results if a string with no numbers is given", () => {
                resultsScreen.transientData.results = "You completed the game!";
                resultsScreen.create();
                expect(mockGmi.sendStatsEvent).toHaveBeenCalledWith("score", "display", undefined);
            });

            test("fires a score stat to the GMI without results if neither a string nor a number is given", () => {
                resultsScreen.transientData.results = [];
                resultsScreen.create();
                expect(mockGmi.sendStatsEvent).toHaveBeenCalledWith("score", "display", undefined);
            });

            test("fires a score stat to the GMI without results if not provided", () => {
                resultsScreen.transientData.results = undefined;
                resultsScreen.create();
                expect(mockGmi.sendStatsEvent).toHaveBeenCalledWith("score", "display", undefined);
            });
        });
    });

    describe("getResultsArea", () => {
        test("returns the correct rectangle for the area available", () => {
            resultsScreen.layout.groups.bottomCenter.y = 121;
            Scaler.getMetrics.mockImplementation(() => ({
                stageHeight: 600,
                borderPad: 20,
            }));

            const safeWidth = 600 * (4 / 3) - 20 * 2;
            const x = -safeWidth / 2;
            const y = -600 / 2 + 20;

            expect(resultsScreen.getResultsArea()).toEqual(
                new Phaser.Geom.Rectangle(x, y, safeWidth, resultsScreen.layout.groups.bottomCenter.y - y),
            );
        });
    });

    describe("events", () => {
        beforeEach(() => {
            jest.spyOn(eventBus, "subscribe");
            resultsScreen.create();
        });

        describe("the continue button", () => {
            test("adds a event subscription", () => {
                expect(eventBus.subscribe.mock.calls[0][0].name).toBe("continue");
            });

            test("navigates to the next screen when clicked", () => {
                eventBus.subscribe.mock.calls[0][0].callback();
                expect(resultsScreen.navigation.next).toHaveBeenCalled();
            });
        });

        describe("the restart button", () => {
            test("adds a event subscription", () => {
                expect(eventBus.subscribe.mock.calls[1][0].name).toBe("restart");
            });

            test("restarts the game and passes saved data through", () => {
                eventBus.subscribe.mock.calls[1][0].callback();
                expect(resultsScreen.navigation.game).toHaveBeenCalled();
            });
        });
    });
});
