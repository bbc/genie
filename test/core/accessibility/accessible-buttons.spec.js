import { expect } from "chai";
import { Buttons, findButtonByElementId } from "../../../src/core/accessibility/accessible-buttons.js";

describe("#Buttons", () => {
    it("returns an object", () => {
        expect(Buttons).to.be.an("object");
    });
});

describe("#findButtonByElementId", () => {
    let button1;

    before(() => {
        button1 = { name: "play" };
        Buttons["home__something"] = button1;
    });

    it("takes an id and returns a Phaser button", () => {
        const btn = findButtonByElementId("home__something");
        expect(btn).to.eql(button1);
    });
});
