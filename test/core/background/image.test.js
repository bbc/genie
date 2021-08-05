/**
 * @copyright BBC 2020
 * @author BBC Children's D+E
 * @license Apache-2.0
 */

import { isImage, addImage } from "../../../src/core/background/image.js";
import * as gmiModule from "../../../src/core/gmi/gmi.js";

describe("Background Image", () => {
	let mockScene;
	let mockTheme;
	let mockSettings;
	let mockImage;

	beforeEach(() => {
		mockImage = {
			testTag: "testTag",
		};

		mockTheme = {};

		mockScene = {
			context: { theme: mockTheme },
			add: {
				image: jest.fn(() => mockImage),
			},
			textures: {
				exists: jest.fn(key => key === "example_image"),
			},
		};

		mockSettings = { motion: true };
		gmiModule.gmi = {
			getAllSettings: jest.fn(() => mockSettings),
		};
	});

	afterEach(jest.clearAllMocks);

	describe("isImage", () => {
		test("returns false if texture does not exist", () => {
			const config = { key: "example_image_bad" };
			expect(isImage(mockScene)(config)).toBe(false);
		});

		test("returns false if config has frames", () => {
			const config = { key: "example_image", frames: {} };
			expect(isImage(mockScene)(config)).toBe(false);
		});

		test("returns true if texture exists and config has no frames", () => {
			const config = { key: "example_image" };
			expect(isImage(mockScene)(config)).toBe(true);
		});
	});

	describe("addImage", () => {
		test("Adds an image with default props if configured", () => {
			const config = { key: "example_image" };
			addImage(mockScene)(config);
			expect(mockScene.add.image).toHaveBeenCalledWith(0, 0, "example_image");
		});

		test("Adds an image with custom props if configured", () => {
			const config = {
				key: "example_image",
				x: -10,
				y: 10,
				props: {
					propName: "propValue",
				},
			};

			addImage(mockScene)(config);

			expect(mockScene.add.image).toHaveBeenCalledWith(config.x, config.y, config.key);

			expect(mockImage.propName).toEqual("propValue");
		});
	});
});
