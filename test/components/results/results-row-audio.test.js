/**
 * @copyright BBC 2020
 * @author BBC Children's D+E
 * @license Apache-2.0
 */
import { playRowAudio } from "../../../src/components/results/results-row-audio.js";

describe("ResultsRow - Row Audio", () => {
	let mockScene;
	let mockAudioConfig;
	let mockContainers;

	beforeEach(() => {
		mockScene = {
			time: { addEvent: jest.fn() },
			sound: { play: jest.fn() },
			scene: { key: "results" },
			transientData: { results: { keys: 0 } },
		};
		mockAudioConfig = { key: "mockAudioKey", delay: 1000 };
		mockContainers = [{ rowConfig: { audio: mockAudioConfig } }];
	});

	afterEach(() => jest.clearAllMocks());

	test("sets asset key from string template when one is used", () => {
		mockAudioConfig = { key: "results_<%= keys %>" };
		mockContainers = [{ rowConfig: { audio: mockAudioConfig } }];
		playRowAudio(mockScene, mockContainers);
		const callback = mockScene.time.addEvent.mock.calls[0][0].callback;
		callback();
		expect(mockScene.sound.play).toHaveBeenCalledWith("results_0");
	});

	test("sets up a time event for audio when specified in config", () => {
		playRowAudio(mockScene, mockContainers);
		expect(mockScene.time.addEvent.mock.calls[0][0]).toEqual(
			expect.objectContaining({ delay: 1000, callback: expect.any(Function) }),
		);
	});

	test("callback triggers audio", () => {
		playRowAudio(mockScene, mockContainers);
		const callback = mockScene.time.addEvent.mock.calls[0][0].callback;
		callback();
		expect(mockScene.sound.play).toHaveBeenCalledWith("mockAudioKey");
	});

	test("does not set up audio when absent from config", () => {
		delete mockContainers[0].rowConfig.audio;
		playRowAudio(mockScene, mockContainers);
		expect(mockScene.time.addEvent).not.toHaveBeenCalled();
	});
});
