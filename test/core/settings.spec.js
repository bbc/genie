/**
 * @copyright BBC 2018
 * @author BBC Children's D+E
 * @license Apache-2.0
 */
import * as sinon from "sinon";
import { create as createSettings } from "../../src/core/settings.js";
import * as signal from "../../src/core/signal-bus.js";
import * as gmiModule from "../../src/core/gmi/gmi.js";

describe("Settings", () => {
    let sandbox = sinon.createSandbox();
    let mockGmi;
    let settings;

    beforeEach(() => {
        mockGmi = {
            gameContainerId: "some-id",
            showSettings: sandbox.stub(),
            getAllSettings: sandbox.stub(),
            exit: sandbox.stub(),
        };

        sandbox.stub(signal.bus, "publish");
        sandbox.stub(gmiModule, "setGmi").returns(mockGmi);
        sandbox.replace(gmiModule, "gmi", mockGmi);

        settings = createSettings();
    });

    afterEach(() => {
        sandbox.restore();
    });

    describe("show method", () => {
        beforeEach(() => settings.show());

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
            };
            const onSettingsClosedCallback = mockGmi.showSettings.getCall(0).args[1];
            onSettingsClosedCallback();
            sandbox.assert.calledOnce(signal.bus.publish.withArgs(expectedSignal));
        });
    });

    describe("getAllSettings method", () => {
        it("calls GMI get all settings", () => {
            settings.getAllSettings();
            sandbox.assert.calledOnce(mockGmi.getAllSettings);
        });
    });
});
