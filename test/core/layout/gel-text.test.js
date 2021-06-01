/**
 * @copyright BBC 2021
 * @author BBC Children's D+E
 * @license Apache-2.0
 */
import { addGelText } from "../../../src/core/layout/gel-text.js";
import * as gelContainerModule from "../../../src/core/layout/gel.js";

describe("", () => {
    beforeEach(() => {
        gelContainerModule.gel = {
            current: () => ({appendChild: jest.fn(),})
        };
    });

    afterEach(jest.clearAllMocks);

    describe("addGelText", () => {
        test("x", () => {
            addGelText("test", {});
        });

        test("throws a warning if incorrect align value is used", () => {
            jest.spyOn(global.console, "warn");
            addGelText("test", { align: "wrong value" });
            expect(console.warn).toHaveBeenCalled(); // eslint-disable-line no-console
        });

        test("converts line breaks to text nodes with breaks", () => {
            const gelText = addGelText("line1\nline2\nline3", {});

            expect(gelText._textNodes[0]).toEqual(document.createTextNode("line1"));
            expect(gelText._textNodes[1]).toEqual(document.createElement("br"));
            expect(gelText._textNodes[2]).toEqual(document.createTextNode("line2"));
            expect(gelText._textNodes[3]).toEqual(document.createElement("br"));
            expect(gelText._textNodes[4]).toEqual(document.createTextNode("line3"));
        });
    });

    describe("GelText", () => {
        test("destroy method removes element from DOM", () => {
            const gelText = addGelText("test", {});
            gelText.el.remove = jest.fn();

            gelText.destroy();

            expect(gelText.el.remove).toHaveBeenCalled();
        });

        test("Set position method changes the CSS with camera offset", () => {
            const gelText = addGelText("test", {});
            gelText.setPosition(100, 200);

            expect(gelText.el.style.left).toBe("800px");
            expect(gelText.el.style.top).toBe("500px");
        });

        test("Set Text method clears existing nodes", () => {
            const gelText = addGelText("test1\ntest2\n", {});
            gelText.setText("test1");

            expect(gelText._textNodes.length).toBe(1);
        });
    });
});
