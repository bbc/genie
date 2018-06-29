import { assert } from "chai";
import * as sinon from "sinon";
import * as gmiModule from "../../src/core/gmi.js";

import * as SettingsIcons from "../../src/core/layout/settings-icons";

describe("Settings Icons", () => {
    const sandbox = sinon.createSandbox();
    let mockSignal = {
        bus: {
            subscribe: function() {},
            publish: function() {},
        },
    };
    let mockGmi = {
        getAllSettings: sandbox.stub().returns({ audio: true, motion: true }),
    };

    before(() => {
        window.getGMI = sandbox.stub().returns(mockGmi);
        gmiModule.setGmi({ arbitraryObject: 1 });
        sandbox.replace(gmiModule, "gmi", mockGmi);
    });

    afterEach(() => {
        sandbox.restore();
    });

    it("fires the correct callbacks when a signal on a channel is published", () => {
        const icons = SettingsIcons.create("top-right", ["audioOff"], mockSignal);
        console.log(window.s.bus);
        assert(false);
    });
});
