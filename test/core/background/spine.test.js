/**
 * @copyright BBC 2020
 * @author BBC Children's D+E
 * @license Apache-2.0
 */

import { isSpine, addSpine } from "../../../src/core/background/spine.js";
import * as gmiModule from "../../../src/core/gmi/gmi.js";

describe("Background Spine", () => {
	let mockScene;
	let mockSettings;
	let mockSpine;

	beforeEach(() => {
		mockSpine = {
			play: jest.fn(),
		};

		mockScene = {
			add: {
				spine: jest.fn(() => mockSpine),
			},
			cache: {
				custom: {
					spine: {
						exists: jest.fn(key => key === "example_spine"),
					},
				},
			},
		};

		mockSettings = { motion: true };
		gmiModule.gmi = {
			getAllSettings: jest.fn(() => mockSettings),
		};
	});

	afterEach(jest.clearAllMocks);

	describe("isSpine", () => {
		test("returns false if key does not exist in spine cache", () => {
			const config = { key: "example_spine_bad" };
			expect(isSpine(mockScene)(config)).toBe(false);
		});

		test("returns true if spine key exists exists in cache", () => {
			const config = { key: "example_spine" };
			expect(isSpine(mockScene)(config)).toBe(true);
		});
	});

	describe("addSpine", () => {
		test("Adds a spine anim with default props if configured", () => {
			addSpine(mockScene)({ key: "example_spine" });
			expect(mockScene.add.spine).toHaveBeenCalledWith(0, 0, "example_spine", "default", true);
		});

		test("Adds a spine anim with custom props if configured", () => {
			const config = {
				key: "example_spine",
				x: -100,
				y: 100,
				animationName: "idle",
				loop: false,
				props: {
					propName: "propValue",
				},
			};

			addSpine(mockScene)(config);

			expect(mockScene.add.spine).toHaveBeenCalledWith(
				config.x,
				config.y,
				config.key,
				config.animationName,
				config.loop,
			);

			expect(mockSpine.propName).toEqual("propValue");
		});

		test("Does not play animations if motion is disabled", () => {
			mockSettings.motion = false;

			addSpine(mockScene)({ key: "example_spine" });
			expect(mockSpine.active).toEqual(false);
		});
	});
});
