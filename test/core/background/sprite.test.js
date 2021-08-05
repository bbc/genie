/**
 * @copyright BBC 2020
 * @author BBC Children's D+E
 * @license Apache-2.0
 */
import { isSprite, addSprite } from "../../../src/core/background/sprite.js";
import * as gmiModule from "../../../src/core/gmi/gmi.js";

describe("Background Sprite", () => {
	let mockScene;
	let mockSettings;
	let mockSprite;

	beforeEach(() => {
		mockSprite = {
			play: jest.fn(),
		};

		mockScene = {
			add: {
				sprite: jest.fn(() => mockSprite),
			},
			textures: {
				exists: jest.fn(key => key === "example_sprite"),
			},
			anims: {
				create: jest.fn(),
				generateFrameNumbers: jest.fn(() => [0, 1, 2, 3]),
			},
		};

		mockSettings = { motion: true };
		gmiModule.gmi = {
			getAllSettings: jest.fn(() => mockSettings),
		};
	});

	afterEach(jest.clearAllMocks);

	describe("isSprite", () => {
		test("returns false if texture does not exist", () => {
			const config = {
				key: "example_sprite_bad",
				frames: [0, 1, 2],
			};
			expect(isSprite(mockScene)(config)).toBe(false);
		});

		test("returns false if config has no frames", () => {
			const config = {
				key: "example_sprite",
			};
			expect(isSprite(mockScene)(config)).toBe(false);
		});

		test("returns true if texture exists and config has frames", () => {
			const config = {
				key: "example_sprite",
				frames: [0, 1, 2],
			};
			expect(isSprite(mockScene)(config)).toBe(true);
		});
	});

	describe("addSprite", () => {
		test("Adds a sprite with default props if configured", () => {
			addSprite(mockScene)({ key: "example_sprite", frames: {} });
			expect(mockScene.add.sprite).toHaveBeenCalledWith(0, 0, "example_sprite", 0);
		});

		test("Adds a sprite with custom props if configured", () => {
			const config = {
				key: "example_sprite",
				x: -100,
				y: 100,
				frames: { key: "example_sprite_animation", start: 0, end: 7, default: 5, repeat: -1, rate: 10 },
				props: {
					propName: "propValue",
				},
			};

			addSprite(mockScene)(config);

			expect(mockScene.add.sprite).toHaveBeenCalledWith(config.x, config.y, config.key, config.frames.default);

			expect(mockScene.anims.create).toHaveBeenCalledWith({
				frameRate: config.frames.rate,
				frames: [0, 1, 2, 3],
				key: config.frames.key,
				repeat: config.frames.repeat,
			});

			expect(mockSprite.propName).toEqual("propValue");
		});

		test("Does not play animations if motion is disabled", () => {
			mockSettings.motion = false;

			addSprite(mockScene)({ key: "example_sprite", frames: {} });
			expect(mockSprite.play).not.toHaveBeenCalled();
		});
	});
});
