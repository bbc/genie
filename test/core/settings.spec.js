/**
 * @copyright BBC 2018
 * @author BBC Children's D+E
 * @license Apache-2.0
 */
import * as sinon from "sinon";
import { create as createSettings, settingsInit } from "../../src/core/settings.js";
import * as signal from "../../src/core/signal-bus.js";
import * as gmiModule from "../../src/core/gmi/gmi.js";

describe("Settings", () => {
    let sandbox = sinon.createSandbox();
    let mockGame;
    let mockGmi;
    let settings;

    beforeEach(() => {
        mockGmi = {
            gameContainerId: "some-id",
            showSettings: sandbox.stub(),
            getAllSettings: sandbox.stub(),
            exit: sandbox.stub(),
        };

        var layout = [
            {
                buttons: {
                    pause: {},
                },
            },
        ];

        mockGame = {
            state: {
                current: "current-screen",
                states: {
                    "current-screen": {
                        navigation: {
                            home: sandbox.spy(),
                            achievements: sandbox.spy(),
                        },
                        scene: {
                            getLayouts: sandbox.stub().returns(layout),
                        },
                    },
                },
            },
        };

        sandbox.stub(signal.bus, "publish");
        sandbox.stub(gmiModule, "setGmi").returns(mockGmi);
        sandbox.replace(gmiModule, "gmi", mockGmi);

        settings = createSettings();
        settingsInit(mockGame);
    });

    afterEach(() => {
        sandbox.restore();
    });

    describe("show method", () => {
        beforeEach(() => {
            settings.show(mockGame);
        });

        it("calls GMI show settings", () => {
            sandbox.assert.calledOnce(mockGmi.showSettings);
        });

        it("publishes a signal when a setting has been changed", () => {
            const expectedSignal = {
                channel: "genie-settings",
                name: "audio",
                data: false,
            };
            const onSettingChangedCallback = mockGmi.showSettings.getCall(0).args[0];
            onSettingChangedCallback("audio", false);
            sandbox.assert.calledOnce(signal.bus.publish.withArgs(expectedSignal));
        });

        it("publishes a signal when settings has been closed", () => {
            const expectedSignal = {
                channel: "genie-settings",
                name: "settings-closed",
                data: { mockGame },
            };
            const onSettingsClosedCallback = mockGmi.showSettings.getCall(0).args[1];
            onSettingsClosedCallback();
            sandbox.assert.calledOnce(
                signal.bus.publish.withArgs({
                    channel: expectedSignal.channel,
                    name: expectedSignal.name,
                    data: sinon.match.any,
                }),
            );
        });
    });

    describe("getAllSettings method", () => {
        it("calls GMI get all settings", () => {
            settings.getAllSettings();
            sandbox.assert.calledOnce(mockGmi.getAllSettings);
        });
    });
});
