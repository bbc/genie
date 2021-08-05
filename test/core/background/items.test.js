/**
 * @copyright BBC 2020
 * @author BBC Children's D+E
 * @license Apache-2.0
 */
import { createMockGmi } from "../../mock/gmi.js";
import { furnish } from "../../../src/core/background/items.js";

import * as spriteModule from "../../../src/core/background/sprite.js";
import * as particlesModule from "../../../src/core/background/particles.js";
import * as imageModule from "../../../src/core/background/image.js";
import * as textModule from "../../../src/core/background/text.js";
import * as spineModule from "../../../src/core/background/spine.js";

describe("Background Furniture", () => {
	let mockTheme;
	let mockScene;
	let mockGmi;
	let mockSettings;

	let isSpriteSpy;
	let isSpineSpy;
	let isImageSpy;
	let isParticlesSpy;

	beforeEach(() => {
		isSpriteSpy = jest.fn();
		isSpineSpy = jest.fn();
		isImageSpy = jest.fn();
		isParticlesSpy = jest.fn();

		spriteModule.isSprite = jest.fn(() => isSpriteSpy);
		spineModule.isSpine = jest.fn(() => isSpineSpy);
		particlesModule.isParticles = jest.fn(() => isParticlesSpy);
		textModule.isText = jest.fn();
		imageModule.isImage = jest.fn(() => isImageSpy);

		mockTheme = { background: {} };
		mockScene = {
			config: mockTheme,
			add: {
				sprite: jest.fn(),
				image: jest.fn(),
				spine: jest.fn(() => ({})),
				particles: jest.fn(),
				text: jest.fn(),
			},
		};

		mockSettings = { motion: true };
		mockGmi = {
			getAllSettings: jest.fn(() => mockSettings),
		};
		createMockGmi(mockGmi);
	});

	afterEach(() => jest.clearAllMocks());

	describe("Furnish", () => {
		test("does not add any items if config.furniture has not been set", () => {
			delete mockTheme.background.items;

			furnish(mockScene)();
			expect(mockScene.add.spine).not.toHaveBeenCalled();
			expect(mockScene.add.sprite).not.toHaveBeenCalled();
			expect(mockScene.add.image).not.toHaveBeenCalled();
			expect(mockScene.add.particles).not.toHaveBeenCalled();
			expect(mockScene.add.text).not.toHaveBeenCalled();
		});

		test("Tests each item in background furniture config array", () => {
			mockTheme.background.items = [1, 2, 3];

			furnish(mockScene)();

			expect(isSpriteSpy).toHaveBeenCalledTimes(3);
			expect(isSpineSpy).toHaveBeenCalledTimes(3);
			expect(isImageSpy).toHaveBeenCalledTimes(3);
			expect(isParticlesSpy).toHaveBeenCalledTimes(3);
			expect(textModule.isText).toHaveBeenCalledTimes(3);
		});

		test("Adds name to items if present in config", () => {
			const mockSprite = {};
			spriteModule.isSprite = jest.fn(() => () => true);
			spriteModule.addSprite = jest.fn(() => () => mockSprite);

			mockTheme.background.items = [{ name: "test_name" }];

			furnish(mockScene)();
			expect(mockSprite.name).toBe("test_name");
		});

		test("Does not add name if no item created (e.g: MotionFx disabled particles)", () => {
			mockSettings.motion = false;
			const mockSprite = {};
			spriteModule.isSprite = jest.fn(() => () => true);
			spriteModule.addSprite = jest.fn(() => () => undefined);

			mockTheme.background.items = [{ name: "test_name" }];

			furnish(mockScene)();
			expect(mockSprite.name).toBeUndefined();
		});
	});
});
