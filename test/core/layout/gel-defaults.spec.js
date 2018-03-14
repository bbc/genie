import { assert } from "chai";
import config from "../../../src/core/layout/gel-defaults";

describe("Layout - Gel Defaults", () => {
    it("has an exit button with title 'Exit'", () => {
        assert(config.exit.title === "Exit");
    });

    it("has a play button with group 'middleCenterV'", () => {
        assert(config.play.group === "middleCenterV");
    });

    it("has a settings button with aria label 'Game Settings'", () => {
        assert(config.settings.ariaLabel === "Game Settings");
    });

    it("has a home button with key 'home'", () => {
        assert(config.home.key === "home");
    });
});
