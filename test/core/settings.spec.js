import { assert } from "chai";
import * as sinon from "sinon";
import { create as createSettings } from "../../src/core/settings.js";
import * as signal from "../../src/core/signal-bus.js";

describe("Settings", () => {
    let sandbox;

    before(() => {
        sandbox = sinon.sandbox.create();
    });

    afterEach(() => {
        sandbox.restore();
    });

    it("Initialises the GMI", () => {
        const spy = sinon.spy();
        const settings = createSettings();

        settings.setGmi({ showSettings: spy });

        settings.show();

        assert(spy.calledOnce);
    });

    it("Focuses on the settings button after closing settings", () => {
        const spy = sinon.spy();
        sandbox.stub(document, "getElementsByClassName").returns([
            {
                focus: spy,
            },
        ]);
        const settings = createSettings();

        const mockGmi = {
            showSettings: (onSettingsChanged, onSettingsClosed) => {
                onSettingsClosed();
            },
        };

        settings.setGmi(mockGmi);
        settings.show();

        sinon.assert.calledOnce(spy);
    });

    it("Dispatches a signal bus message when a setting changes", () => {
        const spy = sinon.spy(signal.bus, "publish");
        const settingName = "test";

        const settings = createSettings();

        const mockGmi = {
            showSettings: (onSettingsChanged, onSettingsClosed) => {
                onSettingsChanged(settingName, true);
            },
        };

        settings.setGmi(mockGmi);
        settings.show();

        sinon.assert.calledOnce(spy);
        sinon.assert.calledWith(spy, { channel: "genie-settings", name: settingName, data: true });
    });
});
