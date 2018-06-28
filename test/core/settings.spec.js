import { assert } from "chai";
import * as sinon from "sinon";
import { create as createSettings } from "../../src/core/settings.js";
import * as signal from "../../src/core/signal-bus.js";
import * as gmiModule from "../../src/core/gmi.js";

describe("Settings", () => {
    let sandbox;

    before(() => {
        sandbox = sinon.sandbox.create();
    });

    afterEach(() => {
        sandbox.restore();
        gmiModule.reset();
    });

    it("Dispatches a signal bus message when a setting changes", () => {
        const spy = sinon.spy(signal.bus, "publish");
        const settingName = "test";

        const settings = createSettings();

        const mockGmi = {
            gameContainerId: "some-id",
            showSettings: onSettingsChanged => {
                onSettingsChanged(settingName, true);
            },
        };

        window.getGMI = sandbox.stub().returns(mockGmi);
        gmiModule.setGmi({ arbitraryObject: 1 });
        sandbox.replace(gmiModule, "gmi", mockGmi);

        settings.show();

        sinon.assert.calledOnce(spy);
        sinon.assert.calledWith(spy, { channel: "genie-settings", name: settingName, data: true });
    });
});
