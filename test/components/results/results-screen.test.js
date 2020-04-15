/**
 * @copyright BBC 2018
 * @author BBC Children's D+E
 * @license Apache-2.0
 */
import { createMockGmi } from "../../mock/gmi.js";
import * as Scaler from "../../../src/core/scaler.js";
import { eventBus } from "../../../src/core/event-bus.js";
import * as Rows from "../../../src/core/layout/rows.js";
import { playRowAudio } from "../../../src/components/results/results-row-audio.js";
import { tweenRows } from "../../../src/components/results/results-row-tween.js";
import * as MetricsModule from "../../../src/core/layout/metrics.js";

import { Results } from "../../../src/components/results/results-screen.js";

jest.mock("../../../src/core/layout/rows.js");
jest.mock("../../../src/core/screen.js");
jest.mock("../../../src/components/results/results-row-tween.js");
jest.mock("../../../src/components/results/results-row-audio.js");

describe("Results Screen", () => {
    let resultsScreen;
    let mockConfig;
    let mockTransientData;
    let mockGmi;
    let mockTextAdd;
    let mockResultsArea;
    let mockImage;
    let mockRows;
    let unsubscribe = jest.fn();

    beforeEach(() => {
        Scaler.getMetrics = jest.fn(() => ({ width: 0 }));
        Scaler.onScaleChange = {
            add: jest.fn(() => ({ unsubscribe })),
        };
        MetricsModule.getMetrics = jest.fn();
        mockRows = { containers: "mockcontainer" };
        Rows.create = jest.fn(() => mockRows);
        mockImage = {
            height: 5,
            width: 5,
            setDepth: jest.fn(),
        };
        mockConfig = {
            theme: {
                results: {
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
            root: "layout root",
            getSafeArea: jest.fn(() => mockResultsArea),
        };
        resultsScreen.context = {
            config: mockConfig,
            transientData: mockTransientData,
            theme: mockConfig.theme.results,
        };
        resultsScreen.transientData = mockTransientData;
        resultsScreen.addBackgroundItems = jest.fn(() => () => {});
        resultsScreen.setLayout = jest.fn();
        resultsScreen.add = {
            image: jest.fn().mockImplementation((x, y, imageName) => {
                mockImage.imageName = imageName;
                return mockImage;
            }),
            text: jest.fn(() => mockTextAdd),
        };
        resultsScreen.scene = {
            key: "results",
        };
        resultsScreen.navigation = {
            continue: jest.fn(),
            restart: jest.fn(),
        };
        resultsScreen.events = {
            once: jest.fn(),
        };
        resultsScreen.children = {
            bringToTop: jest.fn(),
        };
    });

    afterEach(() => jest.clearAllMocks());

    describe("Create Method", () => {
        test("adds background furniture", () => {
            resultsScreen.create();
            expect(resultsScreen.addBackgroundItems).toHaveBeenCalled();
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
                resultsScreen.context.theme.rows,
                Rows.RowType.Results,
            );
        });

        test("adds tweens to the rows", () => {
            resultsScreen.create();
            expect(tweenRows).toHaveBeenCalledWith(resultsScreen, resultsScreen.rows.containers);
        });

        test("plays row audio", () => {
            resultsScreen.create();
            expect(playRowAudio).toHaveBeenCalledWith(resultsScreen, resultsScreen.rows.containers);
        });

        test("results screen area returned has 5% width padding correctly applied to it", () => {
            Scaler.getMetrics = jest.fn(() => ({ width: 200 }));
            const expectedArea = mockResultsArea;
            expectedArea.y -= 5;
            expectedArea.height -= 10;
            expect(resultsScreen.resultsArea()).toBe(mockResultsArea);
        });

        test("adds a backdrop image with specified properties when one is specified in config", () => {
            mockConfig.theme.results.backdrop.alpha = 0.5;
            resultsScreen.create();
            expect(resultsScreen.add.image).toHaveBeenCalledWith(0, 0, "mockKey");
            expect(mockImage.alpha).toEqual(0.5);
        });

        test("adds an image with a default alpha of 1 when no alpha is specified", () => {
            mockConfig.theme.results.backdrop.alpha = undefined;

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
            mockConfig.theme.results.backdrop.key = undefined;
            resultsScreen.create();
            expect(resultsScreen.add.image).not.toHaveBeenCalledWith(0, 0, "mockKey");
        });

        test("Creates a callback that calls getSafeArea with top: false group overrides ", () => {
            resultsScreen.create();
            const safeAreaCallback = Rows.create.mock.calls[0][1];
            safeAreaCallback();

            expect(resultsScreen.layout.getSafeArea).toHaveBeenCalledWith({ top: false });
        });

        test("adds the achievement button when theme flag is set", () => {
            mockConfig.theme.game.achievements = true;
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

        test("put layout on top (layout has to becreated first so safe area is available)", () => {
            resultsScreen.create();
            expect(resultsScreen.children.bringToTop).toHaveBeenCalledWith("layout root");
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
                expect(resultsScreen.navigation.continue).toHaveBeenCalled();
            });
        });

        describe("the restart button", () => {
            test("adds a event subscription", () => {
                expect(eventBus.subscribe.mock.calls[1][0].name).toBe("restart");
            });

            test("restarts the game and passes saved data through", () => {
                eventBus.subscribe.mock.calls[1][0].callback();
                expect(resultsScreen.navigation.restart).toHaveBeenCalled();
            });
        });
    });
});
