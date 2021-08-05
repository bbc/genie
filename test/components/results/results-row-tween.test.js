/**
 * @copyright BBC 2020
 * @author BBC Children's D+E
 * @license Apache-2.0
 */
import { gmi } from "../../../src/core/gmi/gmi.js";
import { tweenRows, tweenRowBackdrops } from "../../../src/components/results/results-row-tween.js";

jest.mock("../../../src/core/gmi/gmi.js");

describe("ResultsRow - Tween Rows", () => {
	let mockScene;
	let mockTweenConfig;
	let mockContainers;
	let mockSettings;

	beforeEach(() => {
		mockScene = { add: { tween: jest.fn() } };
		mockTweenConfig = {
			duration: 1000,
			alpha: { from: 0, to: 1 },
		};
		mockContainers = [{ rowConfig: { transition: mockTweenConfig } }];
		mockSettings = { motion: true };
		gmi.getAllSettings = jest.fn(() => mockSettings);
	});

	afterEach(() => jest.clearAllMocks());

	test("sets up tweens as specified in config", () => {
		tweenRows(mockScene, mockContainers);
		expect(mockScene.add.tween).toHaveBeenCalledWith(expect.objectContaining(mockTweenConfig));
	});

	test("adds a tween for every container which has a tween configured", () => {
		mockContainers = [
			{ rowConfig: { transition: mockTweenConfig } },
			{ rowConfig: {} },
			{ rowConfig: { transition: mockTweenConfig } },
		];
		tweenRows(mockScene, mockContainers);
		expect(mockScene.add.tween).toHaveBeenCalledWith(expect.objectContaining(mockTweenConfig));
		expect(mockScene.add.tween).toHaveBeenCalledTimes(2);
	});

	test("does not add any tweens when no tweens are configured", () => {
		mockContainers = [{ rowConfig: {} }];
		tweenRows(mockScene, mockContainers);
		expect(mockScene.add.tween).not.toHaveBeenCalled();
	});

	test("rows do not animate when motion is off in the settings", () => {
		mockSettings.motion = false;
		tweenRows(mockScene, mockContainers);
		expect(mockScene.add.tween.mock.calls[0][0].duration).toBe(0);
	});

	test("tweenRowBackdrops function sets the correct target to tween", () => {
		const mockTargets = [{ mock: "target" }];
		tweenRowBackdrops(mockScene, mockTargets, mockContainers);
		expect(mockScene.add.tween).toHaveBeenCalledWith({ targets: mockTargets[0], ...mockTweenConfig });
	});
});
