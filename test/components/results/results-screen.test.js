/**
 * @copyright BBC 2018
 * @author BBC Children's D+E
 * @license Apache-2.0
 */
import { createMockGmi } from "../../mock/gmi.js";
import * as Scaler from "../../../src/core/scaler.js";
import { eventBus } from "../../../src/core/event-bus.js";
import * as Rows from "../../../src/core/layout/rows.js";
import * as titles from "../../../src/core/titles.js";
import { playRowAudio } from "../../../src/components/results/results-row-audio.js";
import { tweenRows } from "../../../src/components/results/results-row-tween.js";
import { addParticlesToRows } from "../../../src/components/results/results-particles.js";
import * as MetricsModule from "../../../src/core/layout/metrics.js";

import { Results } from "../../../src/components/results/results-screen.js";

jest.mock("../../../src/core/titles.js");
jest.mock("../../../src/core/layout/rows.js");
jest.mock("../../../src/core/screen.js");
jest.mock("../../../src/components/results/results-row-tween.js");
jest.mock("../../../src/components/results/results-row-audio.js");
jest.mock("../../../src/components/results/results-particles.js");
jest.mock("../../../src/components/results/results-row-backdrop.js");

describe("Results Screen", () => {
    let resultsScreen;
    let mockConfig;
    let mockTransientData;
    let mockGmi;
    let mockTextAdd;
    let mockResultsArea;
    let mockImage;
    let mockRows;
    let mockTitles;
    let unsubscribe = jest.fn();

    beforeEach(() => {
        Scaler.getMetrics = jest.fn(() => ({ width: 0 }));
        Scaler.onScaleChange = {
            add: jest.fn(() => ({ unsubscribe })),
        };
        MetricsModule.getMetrics = jest.fn();
        mockTitles = { title: { resize: jest.fn() }, subtitle: { resize: jest.fn() } };
        titles.createTitles = jest.fn().mockReturnValue(mockTitles);
        mockRows = { containers: "mockcontainer" };
        Rows.create = jest.fn(() => mockRows);
        mockImage = {
            height: 5,
            width: 5,
            setDepth: jest.fn(),
        };
        mockConfig = {
            results: {
                backdrop: { key: "mockKey", alpha: 1 },
                title: { text: "Default title" },
                resultText: {
                    style: { font: "36px ReithSans" },
                },
                rows: [],
            },
            game: {},
        };
        mockTransientData = {
            results: {},
            characterSelected: 1,
        };
        mockResultsArea = {
            centerX: 0,
            centerY: 0,
            width: 0,
            height: 0,
        };

        mockGmi = { sendStatsEvent: jest.fn(), achievements: { get: () => [] } };
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
        };
        resultsScreen.config = mockConfig.results;
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
            scene: {
                key: "results",
            },
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
            const expectedButtons = ["pause", "continueGame", "restart"];
            expect(resultsScreen.setLayout).toHaveBeenCalledWith(expectedButtons);
        });

        test("adds 'Play again' button when game complete is sent in transient data", () => {
            mockTransientData.results.gameComplete = true;
            resultsScreen.create();
            const expectedButtons = ["pause", "continueGame", "playAgain"];
            expect(resultsScreen.setLayout).toHaveBeenCalledWith(expectedButtons);
        });

        test("creates rows for the results screen", () => {
            resultsScreen.create();
            expect(Rows.create).toHaveBeenCalledWith(
                resultsScreen,
                expect.any(Function),
                resultsScreen.config.rows,
                Rows.RowType.Results,
            );
        });

        test("creates title", () => {
            resultsScreen.create();
            expect(titles.createTitles).toHaveBeenCalledTimes(1);
        });

        test("does not create title if not set in config", () => {
            mockConfig.results.title = undefined;
            resultsScreen.create();
            expect(titles.createTitles).not.toHaveBeenCalled();
        });

        test("sets text on the gameobject using transient data and the string template", () => {
            mockConfig.results.title = { text: "<%= title %>", size: 10, bitmapFont: "test" };
            mockTransientData.results.title = "New title";
            resultsScreen.create();
            expect(titles.createTitles.mock.calls[0][0].config.title.text).toBe("New title");
        });

        test("results screen area has the same height as the backdrop when no title set", () => {
            mockConfig.results.title = undefined;
            Scaler.getMetrics = jest.fn(() => ({ width: 200 }));
            resultsScreen.backdrop = { height: 600 };
            expect(resultsScreen.resultsArea().height).toBe(resultsScreen.backdrop.height);
        });

        test("results screen area is centered in the safe area when no title set", () => {
            mockConfig.results.title = undefined;
            Scaler.getMetrics = jest.fn(() => ({ width: 200 }));
            resultsScreen.backdrop = { height: 600 };
            expect(resultsScreen.resultsArea().centerX).toBe(mockResultsArea.centerX);
            expect(resultsScreen.resultsArea().centerY).toBe(mockResultsArea.centerY);
        });

        test("results screen area is the safe area when no backdrop is provided and no title set", () => {
            mockConfig.results.title = undefined;
            Scaler.getMetrics = jest.fn(() => ({ width: 200 }));
            delete resultsScreen.backdrop;
            expect(resultsScreen.resultsArea()).toBe(mockResultsArea);
            expect(resultsScreen.resultsArea()).toBe(mockResultsArea);
        });

        test("adds particles to the rows", () => {
            resultsScreen.create();
            expect(addParticlesToRows).toHaveBeenCalledWith(resultsScreen, resultsScreen.rows.containers);
        });

        test("adds tweens to the rows", () => {
            resultsScreen.create();
            expect(tweenRows).toHaveBeenCalledWith(resultsScreen, resultsScreen.rows.containers);
        });

        test("plays row audio", () => {
            resultsScreen.create();
            expect(playRowAudio).toHaveBeenCalledWith(resultsScreen, resultsScreen.rows.containers);
        });

        test("Creates a row with a callback that calls getSafeArea", () => {
            resultsScreen.create();
            const safeAreaCallback = Rows.create.mock.calls[0][1];
            safeAreaCallback();

            expect(resultsScreen.layout.getSafeArea).toHaveBeenCalled();
        });

        test("results screen area uses the safe area", () => {
            Scaler.getMetrics = jest.fn(() => ({ width: 200, height: 100, centerX: 0, centerY: 10 }));
            expect(resultsScreen.resultsArea().centerX).toBe(mockResultsArea.centerX);
            expect(resultsScreen.resultsArea().centerY).toBe(mockResultsArea.centerY);
        });

        test("adds a backdrop image with specified properties when one is specified in config", () => {
            mockConfig.results.backdrop.alpha = 0.5;
            resultsScreen.create();
            expect(resultsScreen.add.image).toHaveBeenCalledWith(0, 0, "mockKey");
            expect(mockImage.alpha).toEqual(0.5);
        });

        test("adds an image with a default alpha of 1 when no alpha is specified", () => {
            mockConfig.results.backdrop.alpha = undefined;

            resultsScreen.create();
            expect(resultsScreen.add.image).toHaveBeenCalledWith(0, 0, "mockKey");
            expect(mockImage.alpha).toEqual(1);
        });

        test("adds an image with an alpha of 0 when specified in config", () => {
            mockConfig.results.backdrop.alpha = 0;

            resultsScreen.create();
            expect(resultsScreen.add.image).toHaveBeenCalledWith(0, 0, "mockKey");
            expect(mockImage.alpha).toEqual(0);
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

            mockResultsArea.centerX = 10;
            mockResultsArea.centerY = 20;
            Scaler.onScaleChange.add.mock.calls[0][0]();

            expect(Scaler.onScaleChange.add).toHaveBeenCalled();
            expect(mockImage.x).toEqual(mockResultsArea.centerX);
            expect(mockImage.y).toEqual(mockResultsArea.centerY);
        });

        test("does not render image when no key is provided on the backdrop object", () => {
            mockConfig.results.backdrop.key = undefined;
            resultsScreen.create();
            expect(resultsScreen.add.image).not.toHaveBeenCalledWith(0, 0, "mockKey");
        });

        test("adds the achievement button when there are achievements", () => {
            mockGmi.achievements = { get: () => [""] };
            resultsScreen.create();
            const expectedButtons = ["pause", "continueGame", "achievementsSmall", "restart"];
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
