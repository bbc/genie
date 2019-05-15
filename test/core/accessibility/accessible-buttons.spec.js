/**
 * @copyright BBC 2018
 * @author BBC Children's D+E
 * @license Apache-2.0
 */
import { Buttons, findButtonByElementId } from "../../../src/core/accessibility/accessible-buttons.js";

describe("#Buttons", () => {
    test("returns an object", () => {
        expect(typeof Buttons).toBe("object");
    });
});

describe("findButtonByElementId Method", () => {
    let button1;

    beforeEach(() => {
        button1 = { name: "play" };
        Buttons["home__something"] = button1;
    });

    test("takes an id and returns a Phaser button", () => {
        const btn = findButtonByElementId("home__something");
        expect(btn).toEqual(button1);
    });
});
