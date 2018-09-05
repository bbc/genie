/**
 * @copyright BBC 2018
 * @author BBC Children's D+E
 * @license Apache-2.0
 */
import { assert } from "chai";

import { addCustomStyles } from "../../src/core/custom-styles.js";

describe("custom styles", () => {
    beforeEach(() => addCustomStyles());

    describe("#addCustomStyles", () => {
        it("creates a new style element in the head", () => {
            const headElement = document.getElementsByTagName("head")[0];
            assert.exists(headElement.querySelector("style"));
        });

        it("fills this element with all custom styles", () => {
            const styleElement = document.getElementsByTagName("style")[0];
            assert.equal(
                styleElement.innerHTML,
                ".hide-focus-ring:focus { outline:none; } .gel-button { -webkit-user-select: none; }",
            );
        });
    });
});
