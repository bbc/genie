/**
 * @copyright BBC 2018
 * @author BBC Children's D+E
 * @license Apache-2.0
 */
import { addCustomStyles } from "../../src/core/custom-styles.js";

describe("Custom styles", () => {
	let mockStyleElement;

	beforeEach(() => {
		mockStyleElement = { innerHTML: [] };
		global.document.createElement = jest.fn().mockImplementation(() => mockStyleElement);
		global.document.head.appendChild = jest.fn();
		addCustomStyles();
	});

	describe("addCustomStyles method", () => {
		test("creates a new style element", () => {
			expect(global.document.createElement).toHaveBeenCalledWith("style");
		});

		test("adds custom styles to the style element", () => {
			const expectedStyles =
				".hide-focus-ring:focus { outline:none; } .gel-button { -webkit-user-select: none; }";
			expect(mockStyleElement.innerHTML).toBe(expectedStyles);
		});

		test("adds the custom styles to the head", () => {
			const head = global.document.head.appendChild;
			expect(head).toHaveBeenCalledWith(mockStyleElement);
		});
	});
});
