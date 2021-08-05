/**
 * @copyright BBC 2021
 * @author BBC Children's D+E
 * @license Apache-2.0
 */
import { addDomText } from "../../../src/core/layout/dom-text.js";
import * as gelDomModule from "../../../src/core/layout/gel-dom.js";

describe("Gel Text", () => {
	beforeEach(() => {
		gelDomModule.gelDom = {
			current: () => ({ appendChild: jest.fn() }),
		};
	});

	afterEach(jest.clearAllMocks);

	describe("addDomText", () => {
		test("throws a warning if incorrect align value is used", () => {
			jest.spyOn(global.console, "warn");
			addDomText("test", { align: "wrong value" });
			expect(console.warn).toHaveBeenCalled(); // eslint-disable-line no-console
		});

		test("converts line breaks to text nodes with breaks", () => {
			const domText = addDomText("line1\nline2\nline3", {});

			expect(domText._textNodes[0]).toEqual(document.createTextNode("line1"));
			expect(domText._textNodes[1]).toEqual(document.createElement("br"));
			expect(domText._textNodes[2]).toEqual(document.createTextNode("line2"));
			expect(domText._textNodes[3]).toEqual(document.createElement("br"));
			expect(domText._textNodes[4]).toEqual(document.createTextNode("line3"));
		});
	});

	describe("GelDom Class Methods", () => {
		test("destroy method removes element from DOM", () => {
			const domText = addDomText("test", {});
			domText.el.remove = jest.fn();

			domText.destroy();

			expect(domText.el.remove).toHaveBeenCalled();
		});

		test("setPosition method changes the CSS with camera offset", () => {
			const domText = addDomText("test", {});
			domText.setPosition(100, 200);

			expect(domText.el.style.left).toBe("800px");
			expect(domText.el.style.top).toBe("500px");
		});

		test("setText method clears existing nodes", () => {
			const domText = addDomText("test1\ntest2\n", {});
			domText.setText("test1");

			expect(domText._textNodes.length).toBe(1);
		});

		test("setStyle Method merges new style props to the element style", () => {
			const domText = addDomText("test", {});
			domText.setStyle({ test: "prop" });

			expect(domText.el.style.test).toBe("prop");
		});
	});
});
