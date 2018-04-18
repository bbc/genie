import { assert } from "chai";
import * as sinon from "sinon";

import { create as createSettings } from "../../src/core/settings.js";

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

    it("Calls settings closed on complete", () => {
        const spy = sinon.spy();
        const settings = createSettings();

        const mockGmi = {
            showSettings: (onSettingsChanged, onSettingsClosed) => {
                onSettingsClosed();
            },
        };

        settings.setGmi(mockGmi);
        settings.setCloseCallback(spy);
        settings.show();

        sinon.assert.calledOnce(spy);
    });

    it("Adds a new setting and dispatches its callback on settings changed", () => {
        const spy = sinon.spy();
        const settings = createSettings();

        const mockGmi = {
            showSettings: (onSettingsChanged, onSettingsClosed) => {
                onSettingsChanged({ test: true });
            },
        };

        settings.add("test", spy);
        settings.setGmi(mockGmi);
        settings.show();

        sinon.assert.calledOnce(spy);
        sinon.assert.calledWith(spy, true);
    });
});
