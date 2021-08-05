/**
 * @copyright BBC 2020
 * @author BBC Children's D+E
 * @license Apache-2.0
 */
import { ResultsTextCountup, ResultsBitmapTextCountup } from "../../../src/components/results/results-countup.js";
import { mockBaseScene } from "../../mock/mock-scene.js";

describe("ResultsTextCountup", () => {
	let mockScene;
	let mockConfig;

	beforeEach(() => {
		mockScene = mockBaseScene();
		mockScene.scene = { key: "results" };
		mockScene.events = { on: jest.fn(), once: jest.fn(), off: jest.fn() };
		mockScene.sound = { play: jest.fn() };
		mockScene.time = { addEvent: jest.fn(), delayedCall: jest.fn() };
		mockScene.transientData = { results: { stars: 10 } };
		mockConfig = {
			startCount: 0,
			endCount: "<%= stars %>",
			startDelay: 1000,
			countupDuration: 1000,
			audio: {
				key: "results.coin-sfx",
				singleTicksRange: 5,
				ticksPerSecond: 10,
				startPlayRate: 0.8,
				endPlayRate: 1.2,
			},
		};
		ResultsBitmapTextCountup.prototype.updateDisplayOrigin = () => {};
	});

	afterEach(() => jest.clearAllMocks());

	test("allows creation of a ResultsCountup using a Phaser BitmapText object", () => {
		const resultsBitmapTextCountup = new ResultsBitmapTextCountup(mockScene, mockConfig);
		expect(resultsBitmapTextCountup.type).toBe("BitmapText");
	});

	test("sets text to the end count when initialised", () => {
		const resultsTextCountup = new ResultsTextCountup(mockScene, mockConfig);
		expect(resultsTextCountup.text).toBe("10");
	});

	test("sets endCount properly when a string template is provided", () => {
		const resultsText = new ResultsTextCountup(mockScene, mockConfig);
		expect(resultsText.endCount).toBe(mockScene.transientData.results.stars.toString());
	});

	test("sets delayProgress to 0 when initialised", () => {
		const resultsTextCountup = new ResultsTextCountup(mockScene, mockConfig);
		expect(resultsTextCountup.delayProgress).toBe(0);
	});

	test("sets numberOfTicks to 0 when initialised", () => {
		const resultsTextCountup = new ResultsTextCountup(mockScene, mockConfig);
		expect(resultsTextCountup.numberOfTicks).toBe(0);
	});

	test("sets currentValue to startCount when initialised", () => {
		const resultsTextCountup = new ResultsTextCountup(mockScene, mockConfig);
		expect(resultsTextCountup.currentValue).toBe(mockConfig.startCount);
	});

	test("sets countupRange to the correct value when initialised", () => {
		const resultsTextCountup = new ResultsTextCountup(mockScene, mockConfig);
		expect(resultsTextCountup.countupRange).toBe(10);
	});

	test("sets shouldSingleTick to true when countupRange is less than singleTicksRange", () => {
		mockConfig.audio.singleTicksRange = Infinity;
		const resultsTextCountup = new ResultsTextCountup(mockScene, mockConfig);
		expect(resultsTextCountup.shouldSingleTick).toBe(true);
	});

	test("sets shouldSingleTick to false when countupRange is more than singleTicksRange", () => {
		mockConfig.audio.singleTicksRange = -Infinity;
		const resultsTextCountup = new ResultsTextCountup(mockScene, mockConfig);
		expect(resultsTextCountup.shouldSingleTick).toBe(false);
	});

	test("sets shouldSingleTick to false when audio is not defined in config", () => {
		delete mockConfig.audio;
		const resultsTextCountup = new ResultsTextCountup(mockScene, mockConfig);
		expect(resultsTextCountup.shouldSingleTick).toBe(false);
	});

	test("sets countupState to DELAYED (0) when initialised", () => {
		const resultsTextCountup = new ResultsTextCountup(mockScene, mockConfig);
		expect(resultsTextCountup.countupState).toBe(0);
	});

	test("sets a function on boundUpdateFn when initialised", () => {
		const resultsTextCountup = new ResultsTextCountup(mockScene, mockConfig);
		expect(resultsTextCountup.boundUpdateFn).toEqual(expect.any(Function));
	});

	test("adds update function to the update event", () => {
		const resultsTextCountup = new ResultsTextCountup(mockScene, mockConfig);
		expect(mockScene.events.on).toHaveBeenCalledWith("update", resultsTextCountup.boundUpdateFn);
	});

	test("adds cleanup function to the shutdown event", () => {
		const resultsTextCountup = new ResultsTextCountup(mockScene, mockConfig);
		expect(mockScene.events.once).toHaveBeenCalledWith("shutdown", expect.any(Function));
		mockScene.events.once.mock.calls[0][1]();
		expect(mockScene.events.off).toHaveBeenCalledWith("update", resultsTextCountup.boundUpdateFn);
	});

	test("update function sets text to start count when state is INITIALISED (0)", () => {
		const resultsTextCountup = new ResultsTextCountup(mockScene, mockConfig);
		expect(resultsTextCountup.countupState).toBe(0);
		resultsTextCountup.update(undefined, 16);
		expect(resultsTextCountup.text).toBe(mockConfig.startCount.toString());
	});

	test("update function increases delay when state is DELAYED (1)", () => {
		const resultsTextCountup = new ResultsTextCountup(mockScene, mockConfig);
		resultsTextCountup.countupState = 1;
		resultsTextCountup.update(undefined, 16);
		expect(resultsTextCountup.delayProgress).toBe(16);
	});

	test("update function changes states from DELAYED (1) to COUNTING (2) when delay is complete", () => {
		const resultsTextCountup = new ResultsTextCountup(mockScene, mockConfig);
		resultsTextCountup.countupState = 1;
		resultsTextCountup.currentValue = -Infinity;
		resultsTextCountup.update(undefined, 1001);
		expect(resultsTextCountup.countupState).toBe(2);
	});

	test("update function increases currentValue when state is COUNTING (2)", () => {
		const resultsTextCountup = new ResultsTextCountup(mockScene, mockConfig);
		resultsTextCountup.countupState = 2;
		resultsTextCountup.update(undefined, 16);
		expect(resultsTextCountup.currentValue).toBe(0.16);
	});

	test("canPlaySound returns true when singleTicksRange is false and ticks need firing", () => {
		const resultsTextCountup = new ResultsTextCountup(mockScene, mockConfig);
		resultsTextCountup.shouldSingleTick = false;
		resultsTextCountup.numberOfTicks = 0;
		expect(resultsTextCountup.canPlaySound(1, 30, 1000)).toBe(true);
	});

	test("canPlaySound returns false when singleTicksRange is false and ticks do not need firing", () => {
		const resultsTextCountup = new ResultsTextCountup(mockScene, mockConfig);
		resultsTextCountup.shouldSingleTick = false;
		resultsTextCountup.numberOfTicks = Infinity;
		expect(resultsTextCountup.canPlaySound(0, 30, 2000)).toBe(false);
	});

	test("canPlaySound returns true when singleTicksRange is true and the text has been updated", () => {
		const resultsTextCountup = new ResultsTextCountup(mockScene, mockConfig);
		resultsTextCountup.shouldSingleTick = true;
		resultsTextCountup.text = "21";
		resultsTextCountup.previousText = "20";
		expect(resultsTextCountup.canPlaySound(1, 30, 1000)).toBe(true);
	});

	test("canPlaySound returns true when ticksPerSecond is undefined and the text has been updated", () => {
		delete mockConfig.audio.ticksPerSecond;
		const resultsTextCountup = new ResultsTextCountup(mockScene, mockConfig);
		resultsTextCountup.text = "21";
		resultsTextCountup.previousText = "20";
		expect(resultsTextCountup.canPlaySound(1, undefined, 1000)).toBe(true);
	});

	test("canPlaySound returns false when ticksPerSecond is undefined and the text has not been updated", () => {
		delete mockConfig.audio.ticksPerSecond;
		const resultsTextCountup = new ResultsTextCountup(mockScene, mockConfig);
		resultsTextCountup.text = "21";
		resultsTextCountup.previousText = "21";
		expect(resultsTextCountup.canPlaySound(1, undefined, 1000)).toBe(false);
	});

	test("canPlaySound returns false when singleTicksRange is true and the text has not been updated", () => {
		const resultsTextCountup = new ResultsTextCountup(mockScene, mockConfig);
		resultsTextCountup.shouldSingleTick = true;
		resultsTextCountup.text = "21";
		resultsTextCountup.previousText = "21";
		expect(resultsTextCountup.canPlaySound(1, 30, 1000)).toBe(false);
	});

	test("incrementCount does not play audio when it is not defined in config", () => {
		delete mockConfig.audio;
		const resultsTextCountup = new ResultsTextCountup(mockScene, mockConfig);
		resultsTextCountup.incrementCount(0, mockConfig);
		expect(mockScene.sound.play).not.toHaveBeenCalled();
	});

	test("incrementCount plays audio when canPlaySound is true", () => {
		const resultsTextCountup = new ResultsTextCountup(mockScene, mockConfig);
		resultsTextCountup.canPlaySound = () => true;
		resultsTextCountup.incrementCount(0, mockConfig);
		expect(mockScene.sound.play).toHaveBeenCalledWith(mockConfig.audio.key, { rate: 0.8 });
	});

	test("incrementCount increases current value by range / duration * dt", () => {
		const dt = 31;
		const resultsTextCountup = new ResultsTextCountup(mockScene, mockConfig);
		resultsTextCountup.incrementCount(dt, mockConfig);
		expect(resultsTextCountup.currentValue).toBe(0.0 + (10 / 1000) * dt);
	});

	test("incrementCount sets state to ENDED (3) and text to end count when current value is above end count", () => {
		const resultsTextCountup = new ResultsTextCountup(mockScene, mockConfig);
		resultsTextCountup.currentValue = 5;
		resultsTextCountup.endCount = 4;
		resultsTextCountup.incrementCount(0, mockConfig);
		expect(resultsTextCountup.countupState).toBe(3);
		expect(resultsTextCountup.text).toBe("4");
	});

	test("playAudio defaults starting and ending play rate to 1", () => {
		delete mockConfig.audio.startPlayRate;
		delete mockConfig.audio.endPlayRate;
		const resultsTextCountup = new ResultsTextCountup(mockScene, mockConfig);
		resultsTextCountup.canPlaySound = () => true;
		resultsTextCountup.incrementCount(0, mockConfig);
		expect(mockScene.sound.play).toHaveBeenCalledWith(mockConfig.audio.key, { rate: 1 });
	});
});
