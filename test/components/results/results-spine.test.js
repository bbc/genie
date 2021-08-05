/**
 * @copyright BBC 2020
 * @author BBC Children's D+E
 * @license Apache-2.0
 */

import { gmi } from "../../../src/core/gmi/gmi.js";
import { ResultsSpine } from "../../../src/components/results/results-spine.js";
import { mockBaseScene } from "../../mock/mock-scene.js";

describe("ResultsSprite", () => {
	let mockScene;
	let mockConfig;
	let mockSettings = { motion: true };

	beforeEach(() => {
		mockScene = mockBaseScene();
		mockSettings = { motion: true };
		mockScene.scene = { key: "results" };
		mockScene.add = {
			existing: jest.fn(),
			spine: jest.fn(() => {
				return {
					active: true,
					scale: 1,
					setSize: jest.fn(),
				};
			}),
		};
		mockConfig = {
			offsetX: 0,
			offsetY: 0,
			key: "test_key",
			animationName: "test-animation",
			loop: true,
		};
		gmi.getAllSettings = jest.fn(() => mockSettings);
	});

	afterEach(() => jest.clearAllMocks());

	test("adds spine to the update and displaylists", () => {
		const resultsSpine = new ResultsSpine(mockScene, mockConfig);
		expect(mockScene.add.existing).toHaveBeenCalledWith(resultsSpine);
	});

	test("creates the animation", () => {
		new ResultsSpine(mockScene, mockConfig);
		expect(mockScene.add.spine).toHaveBeenCalledWith(0, 0, mockConfig.key, "test-animation", true);
	});

	test("plays the animation when motion effects are on", () => {
		const resultsSpine = new ResultsSpine(mockScene, mockConfig);
		expect(resultsSpine.active).toBe(true);
	});

	test("creates the animation when motion effects are off", () => {
		mockSettings.motion = false;
		new ResultsSpine(mockScene, mockConfig);
		expect(mockScene.add.spine).toHaveBeenCalled();
	});

	test("does not play the animation when motion effects are off", () => {
		mockSettings.motion = false;
		const resultsSpine = new ResultsSpine(mockScene, mockConfig);
		expect(resultsSpine.active).toBe(false);
	});

	test("adds scale from config props", () => {
		mockConfig.props = { scale: 0.5 };
		const resultsSpine = new ResultsSpine(mockScene, mockConfig);
		expect(resultsSpine.scale).toBe(0.5);
	});
});
