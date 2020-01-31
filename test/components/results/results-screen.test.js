/**
 * @copyright BBC 2018
 * @author BBC Children's D+E
 * @license Apache-2.0
 */
import { createMockGmi } from "../../mock/gmi.js";
import * as Scaler from "../../../src/core/scaler.js";
import { eventBus } from "../../../src/core/event-bus.js";
import * as Rows from "../../../src/core/layout/rows.js";
import * as MetricsModule from "../../../src/core/layout/metrics.js";

import { Results } from "../../../src/components/results/results-screen.js";

jest.mock("../../../src/core/layout/rows.js");
jest.mock("../../../src/core/screen.js");

describe("Results Screen", () => {
    let resultsScreen;
    let mockConfig;
    let mockTransientData;
    let mockGmi;
    let mockTextAdd;
    let mockResultsArea;
    let mockImage;
    let unsubscribe = jest.fn();

    beforeEach(() => {
        Scaler.getMetrics = jest.fn(() => ({ width: 0 }));
        Scaler.onScaleChange = {
            add: jest.fn(() => ({ unsubscribe })),
        };
        MetricsModule.getMetrics = jest.fn();
        Rows.create = jest.fn(() => ({
            rowTransitions: jest.fn(),
        }));
        mockImage = {
            height: 5,
            width: 5,
            setDepth: jest.fn(),
        };
        mockConfig = {
            theme: {
                resultsScreen: {
                    backdrop: { key: "mockKey", alpha: 1 },
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
        mockResultsArea = {
            centerX: 0,
            centerY: 0,
            width: 0,
            height: 0,
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
                continueGame: {
                    parentContainer: {
                        y: 121,
                    },
                },
            },
            getSafeArea: jest.fn(() => mockResultsArea),
        };
        resultsScreen.context = { config: mockConfig, transientData: mockTransientData };
        resultsScreen.transientData = mockTransientData;
        resultsScreen.addAnimations = jest.fn(() => () => {});
        resultsScreen.setLayout = jest.fn();
        resultsScreen.add = {
            image: jest.fn().mockImplementation((x, y, imageName) => {
                mockImage.imageName = imageName;
                return mockImage;
            }),
            text: jest.fn(() => mockTextAdd),
        };
        resultsScreen.scene = {
            key: "resultsScreen",
        };
        resultsScreen.navigation = {
            next: jest.fn(),
            game: jest.fn(),
        };
        resultsScreen.events = {
            once: jest.fn(),
        };
    });

    afterEach(() => jest.clearAllMocks());

    describe("Create Method", () => {
        test("adds a background image", () => {
            resultsScreen.create();
            expect(resultsScreen.add.image).toHaveBeenCalledWith(0, 0, "results.background");
            expect(mockImage.setDepth).toHaveBeenCalledWith(-1);
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

        test("results screen area returned has 5% width padding correctly applied to it", () => {
            Scaler.getMetrics = jest.fn(() => ({ width: 200 }));
            const expectedArea = mockResultsArea;
            expectedArea.y -= 5;
            expectedArea.height -= 10;
            expect(resultsScreen.resultsArea()).toBe(mockResultsArea);
        });

        test("adds a backdrop image with specified properties when one is specified in config", () => {
            mockConfig.theme.resultsScreen.backdrop.alpha = 0.5;
            resultsScreen.create();
            expect(resultsScreen.add.image).toHaveBeenCalledWith(0, 0, "mockKey");
            expect(mockImage.alpha).toEqual(0.5);
        });

        test("adds an image with a default alpha of 1 when no alpha is specified", () => {
            mockConfig.theme.resultsScreen.backdrop.alpha = undefined;

            resultsScreen.create();
            expect(resultsScreen.add.image).toHaveBeenCalledWith(0, 0, "mockKey");
            expect(mockImage.alpha).toEqual(1);
        });

        test("adds a backdrop image centred within the results area", () => {
            mockResultsArea = {
                centerX: 15,
                centerY: 15,
                width: 10,
                height: 10,
            };
            resultsScreen.create();
            expect(resultsScreen.add.image).toHaveBeenCalledWith(0, 0, "mockKey");
            expect(mockImage.setDepth).toHaveBeenCalledWith(-1);
            expect(mockImage.x).toBe(15);
            expect(mockImage.y).toEqual(15);
        });

        test("backdrop image is scaled to the width of the safe area to preserve aspect ratio", () => {
            mockResultsArea = {
                centerX: 15,
                centerY: 15,
                width: 10,
                height: 10,
            };
            mockImage = {
                width: 8,
                height: 5,
                setDepth: () => {},
            };
            resultsScreen.create();
            expect(mockImage.scale).toEqual(1.25);
        });

        test("backdrop image is scaled to the height of the safe area to preserve aspect ratio", () => {
            mockResultsArea = {
                width: 10,
                height: 10,
            };
            mockImage = {
                width: 4,
                height: 5,
                setDepth: () => {},
            };
            resultsScreen.create();
            expect(mockImage.scale).toEqual(2);
        });

        test("backdrop image resizes on a scale event", () => {
            mockImage = {
                height: 5,
                width: 5,
                setDepth: () => {},
            };
            mockResultsArea = {
                centerX: 0,
                centerY: 0,
                height: 10,
                width: 10,
            };

            resultsScreen.create();
            expect(mockImage.scale).toEqual(2);

            mockResultsArea.width = 5;
            Scaler.onScaleChange.add.mock.calls[0][0]();

            expect(Scaler.onScaleChange.add).toHaveBeenCalled();
            expect(mockImage.scale).toEqual(1);
        });

        test("does not render image when no key is provided on the backdrop object", () => {
            mockConfig.theme.resultsScreen.backdrop.key = undefined;
            resultsScreen.create();
            expect(resultsScreen.add.image).not.toHaveBeenCalledWith(0, 0, "mockKey");
        });

        test("Creates a callback that calls getSafeArea with metrics and top: false group overrides ", () => {
            resultsScreen.create();
            const safeAreaCallback = Rows.create.mock.calls[0][1];
            safeAreaCallback();

            expect(resultsScreen.layout.getSafeArea).toHaveBeenCalledWith({ width: 0 }, { top: false });
        });

        test("adds the achievement button when theme flag is set", () => {
            resultsScreen.context.config.theme.game.achievements = true;
            resultsScreen.create();
            const expectedButtons = ["pause", "restart", "continueGame", "achievementsSmall"];
            expect(resultsScreen.setLayout).toHaveBeenCalledWith(expectedButtons);
        });

        test("adds a callback to unsubscribe from scale events on shutdown", () => {
            resultsScreen.create();
            expect(resultsScreen.events.once).toHaveBeenCalledWith("shutdown", expect.any(Function));
        });

        test("unsubscribes from scale events on shutdown", () => {
            resultsScreen.create();

            resultsScreen.events.once.mock.calls[0][1]();
            expect(unsubscribe).toHaveBeenCalled();
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
