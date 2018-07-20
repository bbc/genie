import { assert } from "chai";
import * as sinon from "sinon";

import * as gmiModule from "../../../src/core/gmi/gmi.js";
import * as VisibleLayer from "../../../src/core/visible-layer.js";

describe("GMI", () => {
    let sandbox;
    let defaultSettings;
    let fakeWindow;
    let fakeGmiObject;
    let clock;

    before(() => {
        sandbox = sinon.createSandbox();
    });

    beforeEach(() => {
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
            getAllSettings: sandbox.stub().returns({
                audio: true,
                subtitles: false,
                motion: true,
                gameData: { characterSelected: 1, buttonPressed: 3 },
            }),
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

            assert.deepEqual(actualSettings, { settingsConfig: defaultSettings });
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
            defaultSettings.pages.push(customSettings.pages[0]);
            assert.deepEqual(actualSettings, { settingsConfig: defaultSettings });
        });

        it("instantiates GMI with extra global settings if given (without overriding the existing ones)", () => {
            const customSettings = {
                pages: [
                    {
                        title: "Global Settings",
                        settings: [
                            {
                                key: "audio",
                                type: "toggle",
                                title: "Audio",
                                description: "Turn off/on sound and music override (bad)",
                            },
                            {
                                key: "subtitles",
                                type: "toggle",
                                title: "Subtitles",
                                description: "Turn off/on subtitles",
                            },
                        ],
                    },
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
            defaultSettings.pages[0].settings.push(customSettings.pages[0].settings[1]);
            defaultSettings.pages.push(customSettings.pages[1]);
            assert.deepEqual(actualSettings, { settingsConfig: defaultSettings });
        });

        it("returns the GMI instance", () => {
            gmiModule.setGmi(defaultSettings, fakeWindow);
            assert.deepEqual(gmiModule.gmi, fakeGmiObject);
        });
    });

    describe("sendStats method", () => {
        beforeEach(() => {
            sandbox.stub(VisibleLayer, "get").returns("home");
            gmiModule.setGmi(defaultSettings, fakeWindow);
        });

        it("sends a stats event to the GMI", () => {
            gmiModule.sendStats("some_event");
            sandbox.assert.calledOnce(fakeGmiObject.sendStatsEvent);
        });

        it("passes default params to the GMI", () => {
            gmiModule.sendStats("some_other_event");
            const params = fakeGmiObject.sendStatsEvent.getCall(0).args;
            assert.equal(params[0], "some_other_event");
            assert.equal(params[1], undefined);
            assert.deepEqual(params[2], {
                action_name: "some_other_event",
                game_template: "genie",
                game_screen: "home",
                game_level_name: null,
                settings_status: "audio-true-subtitles-false-motion-true-characterSelected-1-buttonPressed-3",
            });
        });

        it("passes the game first click stat to the GMI", () => {
            gmiModule.sendStats("click");
            const params = fakeGmiObject.sendStatsEvent.getCall(0).args;
            assert.equal(params[0], "game_first_click");
            assert.equal(params[1], undefined); // this will be passed in as an addition param in production
            assert.deepEqual(params[2], {
                action_name: "game_first_click",
                game_template: "genie",
                game_screen: "home",
                game_level_name: null,
                settings_status: "audio-true-subtitles-false-motion-true-characterSelected-1-buttonPressed-3",
            });
        });

        it("passes the game click stat to the GMI when this click isn't the first", () => {
            gmiModule.sendStats("click");
            gmiModule.sendStats("click");
            const params = fakeGmiObject.sendStatsEvent.getCall(1).args;
            assert.equal(params[0], "game_click");
            assert.equal(params[1], undefined); // this will be passed in as an addition param in production
            assert.deepEqual(params[2], {
                action_name: "game_click",
                game_template: "genie",
                game_screen: "home",
                game_level_name: null,
                settings_status: "audio-true-subtitles-false-motion-true-characterSelected-1-buttonPressed-3",
            });
        });

        it("overrides params sent to the GMI with additional ones if provided", () => {
            gmiModule.sendStats("click", { action_type: "type_override" });
            const params = fakeGmiObject.sendStatsEvent.getCall(0).args;
            assert.equal(params[0], "game_click");
            assert.equal(params[1], "type_override");
            assert.deepEqual(params[2], {
                action_name: "game_click",
                action_type: "type_override",
                game_template: "genie",
                game_screen: "home",
                game_level_name: null,
                settings_status: "audio-true-subtitles-false-motion-true-characterSelected-1-buttonPressed-3",
            });
        });

        it("passes the game loaded stat to the GMI", () => {
            gmiModule.sendStats("game_loaded");
            const params = fakeGmiObject.sendStatsEvent.getCall(0).args;
            assert.equal(params[0], "game_loaded");
            assert.equal(params[1], true);
            assert.deepEqual(params[2], {
                action_name: "game_loaded",
                action_type: true,
                game_template: "genie",
                game_screen: "home",
                game_level_name: null,
                settings_status: "audio-true-subtitles-false-motion-true-characterSelected-1-buttonPressed-3",
            });
        });

        it("passes the game complete stat to the GMI", () => {
            gmiModule.sendStats("game_complete");
            const params = fakeGmiObject.sendStatsEvent.getCall(0).args;
            assert.equal(params[0], "game_level");
            assert.equal(params[1], "complete");
            assert.deepEqual(params[2], {
                action_name: "game_level",
                action_type: "complete",
                game_template: "genie",
                game_screen: "home",
                game_level_name: null,
                settings_status: "audio-true-subtitles-false-motion-true-characterSelected-1-buttonPressed-3",
            });
        });

        it("passes the replay stat to the GMI", () => {
            gmiModule.sendStats("replay");
            const params = fakeGmiObject.sendStatsEvent.getCall(0).args;
            assert.equal(params[0], "game_level");
            assert.equal(params[1], "playagain");
            assert.deepEqual(params[2], {
                action_name: "game_level",
                action_type: "playagain",
                game_template: "genie",
                game_screen: "home",
                game_level_name: null,
                settings_status: "audio-true-subtitles-false-motion-true-characterSelected-1-buttonPressed-3",
            });
        });

        it("passes the continue stat to the GMI", () => {
            gmiModule.sendStats("continue");
            const params = fakeGmiObject.sendStatsEvent.getCall(0).args;
            assert.equal(params[0], "game_level");
            assert.equal(params[1], "continue");
            assert.deepEqual(params[2], {
                action_name: "game_level",
                action_type: "continue",
                game_template: "genie",
                game_screen: "home",
                game_level_name: null,
                settings_status: "audio-true-subtitles-false-motion-true-characterSelected-1-buttonPressed-3",
            });
        });
    });

    describe("startHeartbeat method", () => {
        beforeEach(() => {
            sandbox.stub(VisibleLayer, "get").returns("home");
            gmiModule.setGmi(defaultSettings, fakeWindow);
            gmiModule.startHeartbeat();
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
            clock.tick(15 * 1000);
            const params = fakeGmiObject.sendStatsEvent.getCall(0).args;
            assert.equal(params[0], "timer");
            assert.equal(params[1], "heartbeat");
            assert.deepEqual(params[2], {
                action_name: "timer",
                action_type: "heartbeat",
                game_template: "genie",
                game_screen: "home",
                game_level_name: null,
                heartbeat_period: 15,
                settings_status: "audio-true-subtitles-false-motion-true-characterSelected-1-buttonPressed-3",
            });
        });
    });
});
