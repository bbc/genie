/**
 * @copyright BBC 2020
 * @author BBC Children's D+E
 * @license Apache-2.0
 */
import * as gmiModule from "../../../src/core/gmi/gmi.js";
import { isText, addText } from "../../../src/core/background/text.js";

describe("Background Text", () => {
	let mockScene;
	let mockSettings;

	beforeEach(() => {
		mockScene = {
			add: {
				text: jest.fn(),
			},
		};

		mockSettings = { motion: true };
		gmiModule.gmi = {
			getAllSettings: jest.fn(() => mockSettings),
		};
	});

	afterEach(jest.clearAllMocks);

	config => Boolean(config.text);

	describe("isText", () => {
		test("returns false if no config.text ", () => {
			const config = {};
			expect(isText(config)).toBe(false);
		});

		test("returns true if texture exists and config has no frames", () => {
			const config = { text: "example text" };
			expect(isText(config)).toBe(true);
		});
	});

	describe("addText", () => {
		test("Adds an text with default props if configured", () => {
			const config = { text: "example text" };
			addText(mockScene)(config);
			expect(mockScene.add.text).toHaveBeenCalledWith(0, 0, "example text", {
				fontFamily: '"ReithSans"',
				fontSize: 24,
			});
		});

		test("Adds text with custom options if configured", () => {
			const config = {
				text: "example text",
				x: -10,
				y: 10,
				style: {
					fontFamily: '"ReithSans"',
					fontSize: 24,
					resolution: 2,
					backgroundColor: "rgba(0,0,0,0.5)",
					padding: {
						left: 6,
						right: 6,
						top: 4,
						bottom: 4,
					},
				},
			};

			addText(mockScene)(config);
			expect(mockScene.add.text).toHaveBeenCalledWith(config.x, config.y, config.text, config.style);
		});
	});
});
