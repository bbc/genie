/**
 * @copyright BBC 2018
 * @author BBC Children's D+E
 * @license Apache-2.0
 */
import * as gmiModule from "../../../src/core/gmi/gmi.js";
import * as VisibleLayer from "../../../src/core/visible-layer.js";
import * as StatsValues from "../../../src/core/gmi/stats-values.js";

// jest.mock("../../../src/core/gmi/gmi.js");

describe("GMI", () => {
    let defaultSettings;
    let fakeWindow;
    let fakeGmiObject;

    beforeEach(() => {
        jest.spyOn(StatsValues, "getValues");
        jest.spyOn(VisibleLayer, "get");
        jest.useFakeTimers();
        defaultSettings = {
            pages: [
                {
                    title: "Global Settings",
                    settings: [
                        {
                            key: "audio",
                            type: "toggle",
                            title: "Audio",
                            description: "Turn off/on sound and music",
                        },
                        {
                            key: "motion",
                            type: "toggle",
                            title: "Motion FX",
                            description: "Turn off/on motion effects",
                        },
                    ],
                },
            ],
        };
        fakeGmiObject = {
            sendStatsEvent: jest.fn(),
            getAllSettings: jest.fn().mockImplementation(() => "settings"),
        };
        fakeWindow = { getGMI: jest.fn().mockImplementation(() => fakeGmiObject) };
        Object.defineProperty(gmiModule, "gmi", fakeGmiObject);
    });

    afterEach(() => {
        jest.clearAllMocks();
        jest.clearAllTimers();
    });

    describe("setGmi method", () => {
        test("instantiates GMI with the default settings", () => {
            gmiModule.setGmi(defaultSettings, fakeWindow);
            const actualSettings = fakeWindow.getGMI.mock.calls[0][0];
            const expectedSettings = { settingsConfig: defaultSettings };
            expect(actualSettings).toEqual(expectedSettings);
        });

        test("instantiates GMI with custom settings if given", () => {
            const customSettings = {
                pages: [
                    {
                        title: "Custom Settings",
                        settings: [
                            {
                                key: "colourblind",
                                type: "toggle",
                                title: "Colourblind mode",
                                description: "Turn off/on colour palette with increased contrast",
                            },
                        ],
                    },
                ],
            };

            gmiModule.setGmi(customSettings, fakeWindow);
            const actualSettings = fakeWindow.getGMI.mock.calls[0][0];
            const expectedSettings = {
                settingsConfig: { pages: defaultSettings.pages.concat(customSettings.pages[0]) },
            };
            expect(actualSettings).toEqual(expectedSettings);
        });

        test("instantiates GMI with extra global settings if given", () => {
            const customSettings = {
                pages: [
                    {
                        title: "Global Settings",
                        settings: [
                            {
                                key: "subtitles",
                                type: "toggle",
                                title: "Subtitles",
                                description: "Turn off/on subtitles",
                            },
                        ],
                    },
                ],
            };

            gmiModule.setGmi(customSettings, fakeWindow);
            const actualSettings = fakeWindow.getGMI.mock.calls[0][0];
            defaultSettings.pages[0].settings.push(customSettings.pages[0].settings[0]);
            const expectedSettings = { settingsConfig: defaultSettings };
            expect(actualSettings).toEqual(expectedSettings);
        });

        test("does not overwrite the default audio and motion global settings when custom globals are provided", () => {
            const customSettings = {
                pages: [
                    {
                        title: "Global Settings",
                        settings: [
                            {
                                key: "audio",
                                type: "unique-input",
                                title: "Different title",
                                description: "Some custom override for audio (bad)",
                            },
                            {
                                key: "motion",
                                type: "unique-input",
                                title: "Different title",
                                description: "Some custom override for motion (bad)",
                            },
                        ],
                    },
                ],
            };

            gmiModule.setGmi(customSettings, fakeWindow);
            const actualSettings = fakeWindow.getGMI.mock.calls[0][0];
            const expectedSettings = { settingsConfig: defaultSettings };
            expect(actualSettings).toEqual(expectedSettings);
        });

        test("returns the GMI instance", () => {
            gmiModule.setGmi(defaultSettings, fakeWindow);
            expect(gmiModule.gmi).toEqual(fakeGmiObject);
        });
    });

    describe("sendStats method", () => {
        beforeEach(() => {
            VisibleLayer.get.mockImplementation(() => "visible-layer");
            StatsValues.getValues.mockImplementation(() => ({ action_name: "name", action_type: "type" }));
            gmiModule.setGmi(defaultSettings, fakeWindow);
        });

        test("gets the visible layer (after the stats tracking has been started)", () => {
            const fakeGame = "game";
            const fakeContext = "context";

            gmiModule.startStatsTracking(fakeGame, fakeContext);
            gmiModule.sendStats("some_event");
            expect(VisibleLayer.get).toHaveBeenCalledWith(fakeGame, fakeContext);
        });

        test("gets the stats values", () => {
            gmiModule.sendStats("some_event");
            expect(StatsValues.getValues).toHaveBeenCalledWith("some_event", "settings", "visible-layer");
        });

        test("sends a stats event to the GMI", () => {
            gmiModule.sendStats("some_event");
            expect(fakeGmiObject.sendStatsEvent).toHaveBeenCalledWith("name", "type", {
                action_name: "name",
                action_type: "type",
            });
        });

        test("overrides params sent to the GMI if additional ones are provided", () => {
            gmiModule.sendStats("some_event", { action_type: "override" });
            expect(fakeGmiObject.sendStatsEvent).toHaveBeenCalledWith("name", "override", {
                action_name: "name",
                action_type: "override",
            });
        });
    });

    describe("startStatsTracking method", () => {
        beforeEach(() => {
            gmiModule.setGmi(defaultSettings, fakeWindow);
            StatsValues.getValues.mockImplementation(() => ({ action_name: "timer", action_type: "heartbeat" }));
            gmiModule.startStatsTracking();
        });

        test("fires the stats heartbeat every 15 seconds", () => {
            jest.advanceTimersByTime(15 * 1000);
            expect(fakeGmiObject.sendStatsEvent).toHaveBeenCalledTimes(1);
            jest.advanceTimersByTime(15 * 1000);
            expect(fakeGmiObject.sendStatsEvent).toHaveBeenCalledTimes(2);
            jest.advanceTimersByTime(15 * 1000);
            expect(fakeGmiObject.sendStatsEvent).toHaveBeenCalledTimes(3);
        });

        test("passes the correct params to the stats heartbeat", () => {
            const expectedAdditonalParams = { action_name: "timer", action_type: "heartbeat", heartbeat_period: 15 };
            jest.advanceTimersByTime(15 * 1000);
            expect(fakeGmiObject.sendStatsEvent).toHaveBeenCalledWith("timer", "heartbeat", expectedAdditonalParams);
        });
    });
});
