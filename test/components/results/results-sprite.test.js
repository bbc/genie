/**
 * @copyright BBC 2020
 * @author BBC Children's D+E
 * @license Apache-2.0
 */

import { gmi } from "../../../src/core/gmi/gmi.js";
import { ResultsSprite } from "../../../src/components/results/results-sprite.js";
import { mockBaseScene } from "../../mock/mock-scene.js";

describe("ResultsSprite", () => {
	let mockScene;
	let mockConfig;
	let mockSettings = { motion: true };

	beforeEach(() => {
		mockScene = mockBaseScene();
		mockSettings = { motion: true };
		mockScene.scene = { key: "results" };
		mockScene.sys = { anims: { on: jest.fn(), once: jest.fn() }, queueDepthSort: jest.fn(), game: {} };
		mockScene.transientData = { results: {} };
		mockScene.add = { existing: jest.fn() };
		mockScene.anims = { create: jest.fn(), generateFrameNumbers: jest.fn(), once: jest.fn() };
		mockConfig = {
			key: "image",
			frame: 5,
		};
		ResultsSprite.prototype.play = jest.fn();
		ResultsSprite.prototype.setOrigin = jest.fn();
		ResultsSprite.prototype.setTexture = jest.fn();
		ResultsSprite.prototype.setSizeToFrame = () => {};
		ResultsSprite.prototype.animationManager = { on: () => {} };
		gmi.getAllSettings = jest.fn(() => mockSettings);
	});

	afterEach(() => jest.clearAllMocks());

	test("sets origin of ResultsSprite to 0,0", () => {
		const resultsSprite = new ResultsSprite(mockScene, mockConfig);
		expect(resultsSprite.setOrigin).toHaveBeenCalledWith(0, 0);
	});

	test("sets key to spriteConfig.key and frame to spriteConfig.frame", () => {
		const resultsSprite = new ResultsSprite(mockScene, mockConfig);
		expect(resultsSprite.setTexture).toHaveBeenCalledWith(mockConfig.key, mockConfig.frame);
	});

	test("sets correct key when string template provided", () => {
		mockConfig.key = "stars_<%= stars %>";
		mockScene.transientData.results.stars = 5;
		const resultsSprite = new ResultsSprite(mockScene, mockConfig);
		expect(resultsSprite.setTexture).toHaveBeenCalledWith("stars_5", mockConfig.frame);
	});

	test("adds itself to the update and displaylists when animation is defined", () => {
		mockConfig.anim = {};
		const resultsSprite = new ResultsSprite(mockScene, mockConfig);
		expect(resultsSprite.scene.add.existing).toHaveBeenCalledWith(resultsSprite);
	});

	test("does not add itself to the update and displaylists when animation is not defined", () => {
		const resultsSprite = new ResultsSprite(mockScene, mockConfig);
		expect(resultsSprite.scene.add.existing).not.toHaveBeenCalled();
	});

	test("creates an animation when animation is defined and motion effects are on", () => {
		mockConfig.anim = {};
		new ResultsSprite(mockScene, mockConfig);
		expect(mockScene.anims.create).toHaveBeenCalledWith({ key: mockConfig.key });
	});

	test("plays the animation when animation is defined and motion effects are on", () => {
		mockConfig.anim = {};
		const resultsSprite = new ResultsSprite(mockScene, mockConfig);
		expect(resultsSprite.play).toHaveBeenCalledWith(mockConfig.key);
	});

	test("does not create the animation when animation is defined and motion effects are off", () => {
		mockSettings.motion = false;
		mockConfig.anim = {};
		new ResultsSprite(mockScene, mockConfig);
		expect(mockScene.anims.create).not.toHaveBeenCalled();
	});

	test("does not play the animation when animation is defined and motion effects are off", () => {
		mockSettings.motion = false;
		mockConfig.anim = {};
		const resultsSprite = new ResultsSprite(mockScene, mockConfig);
		expect(resultsSprite.play).not.toHaveBeenCalled();
	});

	test("generates the correct frames when animation frames are defined", () => {
		mockConfig.anim = {
			frames: {
				start: 0,
				end: 10,
			},
		};
		new ResultsSprite(mockScene, mockConfig);
		expect(mockScene.anims.generateFrameNumbers).toHaveBeenCalledWith(mockConfig.key, mockConfig.anim.frames);
	});
});
