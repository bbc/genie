import { assert } from "chai";
import * as sinon from "sinon";
import * as gmiModule from "../../src/core/gmi.js";
import * as signal from "../../src/core/signal-bus.js";

import * as SettingsIcons from "../../src/core/layout/settings-icons.js";

// eslint-disable-next-line mocha/no-skipped-tests
describe.skip("Settings Icons", () => {
    const sandbox = sinon.createSandbox();
    let mockSignalBus;
    let mockGmi;

    beforeEach(() => {
        mockSignalBus = {
            subscribe: sandbox.spy(),
            publish: sandbox.spy(),
        };

        mockGmi = {
            getAllSettings: sandbox.stub().returns({ audio: true, motion: true }),
        };

        sandbox.replace(gmiModule, "gmi", mockGmi);
        sandbox.replace(signal, "bus", mockSignalBus);
    });

    afterEach(() => sandbox.restore());

    it("Creates a subscription only for the fx icon on screens that have an audio button", () => {
        SettingsIcons.create("top-right", ["audioOff"]);
        assert(mockSignalBus.subscribe.calledOnce);
        assert(mockSignalBus.subscribe.firstCall.args[0].name === "motion");
    });

    it("Creates subscriptions for the audio and fx icons on screens that do not have an audio button", () => {
        SettingsIcons.create("top-right", []);
        assert(mockSignalBus.subscribe.calledTwice);
        assert.equal("audio", mockSignalBus.subscribe.firstCall.args[0].name);
        assert.equal("motion", mockSignalBus.subscribe.secondCall.args[0].name);
    });
});
