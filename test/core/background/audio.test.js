/**
 * @copyright BBC 2020
 * @author BBC Children's D+E
 * @license Apache-2.0
 */
import { isAudio, createAudio } from "../../../src/core/background/audio.js";

describe("Background Audio", () => {
	let mockScene;
	let mockSound;
	beforeEach(() => {
		mockSound = { play: jest.fn() };
		mockScene = {
			config: { background: { audio: [{ name: "test_audio", key: "test_key" }] } },
			sound: {
				add: jest.fn(() => mockSound),
			},
		};
	});

	afterEach(jest.clearAllMocks);

	describe("isAudio method", () => {
		test("returns true if matching named audio exists in scene config", () => {
			expect(isAudio(mockScene)("test_audio")).toBe(true);
		});
	});

	describe("createAudio method", () => {
		test("returns newly created Phaser sound object if matching named audio exists in scene config", () => {
			const returned = createAudio(mockScene)("test_audio");

			expect(mockScene.sound.add).toHaveBeenCalledWith("test_key", { key: "test_key", name: "test_audio" });
			expect(mockSound.play).toHaveBeenCalled();
			expect(returned).toBe(mockSound);
		});
	});
});
