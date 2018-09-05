/**
 * @copyright BBC 2018
 * @author BBC Children's D+E
 * @license Apache-2.0
 */
import { assert } from "chai";
import * as sinon from "sinon";

import * as gmiModule from "../../../src/core/gmi/gmi.js";
import * as VisibleLayer from "../../../src/core/visible-layer.js";
import * as StatsValues from "../../../src/core/gmi/stats-values.js";

describe("GMI", () => {
    const sandbox = sinon.createSandbox();
    let defaultSettings;
    let fakeWindow;
    let fakeGmiObject;
    let clock;

    beforeEach(() => {
        sandbox.stub(StatsValues, "getValues");
        sandbox.stub(VisibleLayer, "get");
        clock = sinon.useFakeTimers();
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
            sendStatsEvent: sandbox.stub(),
            getAllSettings: sandbox.stub().returns("settings"),
        };
        fakeWindow = { getGMI: sandbox.stub().returns(fakeGmiObject) };
        sandbox.replace(gmiModule, "gmi", fakeGmiObject);
    });

    afterEach(() => {
        clock = sinon.restore();
        sandbox.restore();
    });

    describe("setGmi method", () => {
        it("instantiates GMI with the default settings", () => {
            gmiModule.setGmi(defaultSettings, fakeWindow);
            const actualSettings = fakeWindow.getGMI.getCall(0).args[0];
            const expectedSettings = { settingsConfig: defaultSettings };
            assert.deepEqual(actualSettings, expectedSettings);
        });

        it("instantiates GMI with custom settings if given", () => {
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
            const actualSettings = fakeWindow.getGMI.getCall(0).args[0];
            const expectedSettings = {
                settingsConfig: { pages: defaultSettings.pages.concat(customSettings.pages[0]) },
            };
            assert.deepEqual(actualSettings, expectedSettings);
        });

        it("instantiates GMI with extra global settings if given", () => {
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
            const actualSettings = fakeWindow.getGMI.getCall(0).args[0];
            defaultSettings.pages[0].settings.push(customSettings.pages[0].settings[0]);
            const expectedSettings = { settingsConfig: defaultSettings };
            assert.deepEqual(actualSettings, expectedSettings);
        });

        it("does not overwrite the default audio and motion global settings when custom globals are provided", () => {
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
            const actualSettings = fakeWindow.getGMI.getCall(0).args[0];
            const expectedSettings = { settingsConfig: defaultSettings };
            assert.deepEqual(actualSettings, expectedSettings);
        });

        it("returns the GMI instance", () => {
            gmiModule.setGmi(defaultSettings, fakeWindow);
            assert.deepEqual(gmiModule.gmi, fakeGmiObject);
        });
    });

    describe("sendStats method", () => {
        beforeEach(() => {
            VisibleLayer.get.returns("visible-layer");
            StatsValues.getValues.returns({ action_name: "name", action_type: "type" });
            gmiModule.setGmi(defaultSettings, fakeWindow);
        });

        it("gets the visible layer (after the stats tracking has been started)", () => {
            const fakeGame = "game";
            const fakeContext = "context";

            gmiModule.startStatsTracking(fakeGame, fakeContext);
            gmiModule.sendStats("some_event");
            sandbox.assert.calledOnce(VisibleLayer.get.withArgs(fakeGame, fakeContext));
        });

        it("gets the stats values", () => {
            gmiModule.sendStats("some_event");
            const actualParams = ["some_event", "settings", "visible-layer"];
            const expectedParams = StatsValues.getValues.getCall(0).args;
            assert.deepEqual(actualParams, expectedParams);
        });

        it("sends a stats event to the GMI", () => {
            gmiModule.sendStats("some_event");
            sandbox.assert.calledOnce(fakeGmiObject.sendStatsEvent.withArgs("name", "type"));
        });

        it("overrides params sent to the GMI if additional ones are provided", () => {
            gmiModule.sendStats("some_event", { action_type: "override" });
            sandbox.assert.calledOnce(fakeGmiObject.sendStatsEvent.withArgs("name", "override"));
        });
    });

    describe("startStatsTracking method", () => {
        beforeEach(() => {
            gmiModule.setGmi(defaultSettings, fakeWindow);
            StatsValues.getValues.returns({ action_name: "timer", action_type: "heartbeat" });
            gmiModule.startStatsTracking();
        });

        it("fires the stats heartbeat every 15 seconds", () => {
            clock.tick(15 * 1000);
            sandbox.assert.calledOnce(fakeGmiObject.sendStatsEvent);
            clock.tick(15 * 1000);
            sandbox.assert.calledTwice(fakeGmiObject.sendStatsEvent);
            clock.tick(15 * 1000);
            sandbox.assert.calledThrice(fakeGmiObject.sendStatsEvent);
        });

        it("passes the correct params to the stats heartbeat", () => {
            const expectedAdditonalParams = { action_name: "timer", action_type: "heartbeat", heartbeat_period: 15 };
            clock.tick(15 * 1000);
            sandbox.assert.calledWith(fakeGmiObject.sendStatsEvent, "timer", "heartbeat", expectedAdditonalParams);
        });
    });
});
