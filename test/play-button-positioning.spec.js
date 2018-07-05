import { assert } from "chai";
import { setGelButtonY } from "../src/core/gel-button-positioning.js";

describe("play button positioning", () => {
    let button = {
        y: 0,
    };

    describe("when play button Y coord is configured to 100px", () => {
        beforeEach(() => {
            setGelButtonY(button, 100);
        });

        it("sets the button Y position to 100px below game center", () => {
            assert.equal(button.y, 100);
        });
    });
});
