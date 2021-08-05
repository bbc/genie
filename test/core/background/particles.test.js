/**
 * @copyright BBC 2020
 * @author BBC Children's D+E
 * @license Apache-2.0
 */

import { isParticles, addParticles } from "../../../src/core/background/particles.js";
import * as gmiModule from "../../../src/core/gmi/gmi.js";

describe("Background Spine", () => {
	let mockScene;
	let mockSettings;
	let mockParticles;

	beforeEach(() => {
		mockParticles = {
			createEmitter: jest.fn(),
		};

		mockScene = {
			add: {
				particles: jest.fn(() => mockParticles),
			},
			cache: {
				json: {
					get: jest.fn(() => ({
						key: "example_emitter",
					})),
					exists: jest.fn(key => key === "example_spray"),
				},
			},
			textures: {
				exists: jest.fn(key => key === "example_sprite"),
			},
		};

		mockSettings = { motion: true };
		gmiModule.gmi = {
			getAllSettings: jest.fn(() => mockSettings),
		};
	});

	afterEach(jest.clearAllMocks);

	describe("isParticles", () => {
		test("returns false if key does not exist in json cache", () => {
			const config = { key: "example_particles_bad" };
			expect(isParticles(mockScene)(config)).toBe(false);
		});

		test("returns true if spine key exists exists in cache", () => {
			const config = { key: "example_spray" };
			expect(isParticles(mockScene)(config)).toBe(true);
		});
	});

	describe("addParticles", () => {
		test("Adds a particle system if configured", () => {
			const mockConfig = {
				key: "example_spray",
				assetKey: "example_sprite",
			};

			addParticles(mockScene)(mockConfig);

			expect(mockScene.add.particles).toHaveBeenCalledWith("example_sprite");
			expect(mockParticles.createEmitter).toHaveBeenCalledWith({ key: "example_emitter" });
		});

		test("Adds a particle system with custom props if configured", () => {
			const mockConfig = {
				key: "example_spray",
				assetKey: "example_sprite",
				props: {
					x: 250,
				},
			};

			addParticles(mockScene)(mockConfig);

			expect(mockParticles.createEmitter).toHaveBeenCalledWith({ key: "example_emitter", x: 250 });
		});

		test("Does not add particles if motion is disabled", () => {
			mockSettings.motion = false;
			const mockConfig = {
				key: "example_spray",
				assetKey: "example_sprite",
			};

			addParticles(mockScene)(mockConfig);
			expect(mockScene.add.particles).not.toHaveBeenCalled();
		});
	});
});
