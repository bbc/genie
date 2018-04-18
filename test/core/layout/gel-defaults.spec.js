import { assert } from "chai";
import * as gel from "../../../src/core/layout/gel-defaults";
import * as sinon from "sinon";

describe("Layout - Gel Defaults", () => {
    it("has an exit button with title 'Exit'", () => {
        assert(gel.config.exit.title === "Exit");
    });

    it("has a play button with group 'middleCenterV'", () => {
        assert(gel.config.play.group === "middleCenterV");
    });

    it("has a settings button with aria label 'Game Settings'", () => {
        assert(gel.config.settings.ariaLabel === "Game Settings");
    });

    it("has a home button with key 'home'", () => {
        assert(gel.config.home.key === "home");
    });

    it("stores the gmi variable for use in actions", () => {
        const gmiSpy = sinon.spy();
        gel.setGmi({ exit: gmiSpy });

        gel.config.exit.action();

        sinon.assert.calledOnce(gmiSpy);
    });
});
