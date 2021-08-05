/**
 * @copyright BBC 2020
 * @author BBC Children's D+E
 * @license Apache-2.0
 */
import { ResultsRow } from "../../../src/components/results/results-row.js";
import { ResultsBitmapText } from "../../../src/components/results/results-bitmaptext.js";
import { ResultsText } from "../../../src/components/results/results-text.js";
import { ResultsSprite } from "../../../src/components/results/results-sprite.js";
import { ResultsSpine } from "../../../src/components/results/results-spine.js";
import { ResultsTextCountup, ResultsBitmapTextCountup } from "../../../src/components/results/results-countup.js";
import { mockBaseScene } from "../../mock/mock-scene.js";

jest.mock("../../../src/components/results/results-bitmaptext.js");
jest.mock("../../../src/components/results/results-text.js");
jest.mock("../../../src/components/results/results-sprite.js");
jest.mock("../../../src/components/results/results-spine.js");
jest.mock("../../../src/components/results/results-countup.js");

describe("Results Row", () => {
	let mockScene;
	let mockRowConfig;
	let mockGetDrawArea;
	let mockDrawArea;
	let mockGameObject;
	let mockImage;

	beforeEach(() => {
		mockImage = {};
		mockScene = mockBaseScene();
		mockScene.scene = { key: "results" };
		mockScene.add = { image: jest.fn(() => mockImage) };
		mockRowConfig = {
			format: [{ type: "text", content: "" }],
		};
		mockScene.transientData = {
			results: {
				name: "darkness",
			},
		};
		mockDrawArea = {
			x: -12,
			y: -11,
			centerX: 47,
			centerY: 23,
		};
		mockGetDrawArea = () => mockDrawArea;
		mockGameObject = {
			x: 50,
			y: 0,
			width: 100,
			height: 100,
		};
		ResultsRow.prototype.add = jest.fn();
		ResultsRow.prototype.removeAll = jest.fn();
		ResultsRow.prototype.sendToBack = jest.fn();
	});

	afterEach(() => jest.clearAllMocks());

	test("sets container alpha when specified in config", () => {
		mockRowConfig.alpha = 0.6;
		const resultsRow = new ResultsRow(mockScene, mockRowConfig, mockGetDrawArea);
		expect(resultsRow.alpha).toEqual(0.6);
	});

	test("sets container alpha to 1 when not specified in config", () => {
		const resultsRow = new ResultsRow(mockScene, mockRowConfig, mockGetDrawArea);
		expect(resultsRow.alpha).toEqual(1);
	});

	test("align moves the gameobject half the rows width by default", () => {
		const resultsRow = new ResultsRow(mockScene, mockRowConfig, mockGetDrawArea);
		resultsRow.list = [mockGameObject];
		resultsRow.align();
		expect(mockGameObject.x).toBe(-25);
	});

	test("addSection adds the gameobject to the container", () => {
		const resultsRow = new ResultsRow(mockScene, mockRowConfig, mockGetDrawArea);
		resultsRow.addSection(mockGameObject);
		expect(resultsRow.add).toHaveBeenCalledWith(mockGameObject);
	});

	test("addSection sets the gameobjects x to 0 when it is the only gameobject in the container", () => {
		const resultsRow = new ResultsRow(mockScene, mockRowConfig, mockGetDrawArea);
		resultsRow.addSection(mockGameObject);
		expect(mockGameObject.x).toBe(0);
	});

	test("addSection applies the x offset", () => {
		const resultsRow = new ResultsRow(mockScene, mockRowConfig, mockGetDrawArea);
		resultsRow.addSection(mockGameObject, 50, 0);
		expect(mockGameObject.x).toBe(50);
	});

	test("addSection applies the y offset", () => {
		const resultsRow = new ResultsRow(mockScene, mockRowConfig, mockGetDrawArea);
		resultsRow.addSection(mockGameObject, 0, 50);
		expect(mockGameObject.y).toBe(0);
	});

	test("addSection sets the gameobjects x to the end of the last added object when it is the only object in the container", () => {
		const resultsRow = new ResultsRow(mockScene, mockRowConfig, mockGetDrawArea);
		const mockObject = {};
		resultsRow.list = [mockGameObject];
		resultsRow.addSection(mockObject);
		expect(mockObject.x).toBe(150);
	});

	test("addSection subtracts half of the gameobjects height from its y position", () => {
		const resultsRow = new ResultsRow(mockScene, mockRowConfig, mockGetDrawArea);
		resultsRow.addSection(mockGameObject);
		expect(mockGameObject.y).toBe(-50);
	});

	test("drawRow adds a ResultsBitmapText object to the container when defined in rowConfig", () => {
		mockRowConfig = {
			format: [{ type: "bitmaptext", content: "" }],
		};
		const resultsRow = new ResultsRow(mockScene, mockRowConfig, mockGetDrawArea);
		expect(resultsRow.add).toHaveBeenCalledWith(expect.any(ResultsBitmapText));
	});

	test("drawRow adds a ResultsText object to the container when defined in rowConfig", () => {
		const resultsRow = new ResultsRow(mockScene, mockRowConfig, mockGetDrawArea);
		expect(resultsRow.add).toHaveBeenCalledWith(expect.any(ResultsText));
	});

	test("drawRow adds a ResultsSprite object to the container when defined in rowConfig", () => {
		mockRowConfig = {
			format: [{ type: "sprite", key: "image", frame: 0 }],
		};
		const resultsRow = new ResultsRow(mockScene, mockRowConfig, mockGetDrawArea);
		expect(resultsRow.add).toHaveBeenCalledWith(expect.any(ResultsSprite));
	});

	test("drawRow adds a ResultsSpine object to the container when defined in rowConfig", () => {
		mockRowConfig = {
			format: [{ type: "spine", key: "image", frame: 0 }],
		};
		const resultsRow = new ResultsRow(mockScene, mockRowConfig, mockGetDrawArea);
		expect(resultsRow.add).toHaveBeenCalledWith(expect.any(ResultsSpine));
	});

	test("drawRow adds a ResultsTextCountup object to the container when defined in rowConfig", () => {
		mockRowConfig = {
			format: [{ type: "countup", content: "test" }],
		};
		const resultsRow = new ResultsRow(mockScene, mockRowConfig, mockGetDrawArea);
		expect(resultsRow.add).toHaveBeenCalledWith(expect.any(ResultsTextCountup));
	});

	test("drawRow adds a ResultsBitmapTextCountup object to the container when a countup has a bitmapFont", () => {
		mockRowConfig = {
			format: [{ type: "countup", content: "test", bitmapFont: "test" }],
		};
		const resultsRow = new ResultsRow(mockScene, mockRowConfig, mockGetDrawArea);
		expect(resultsRow.add).toHaveBeenCalledWith(expect.any(ResultsBitmapTextCountup));
	});

	test("getBoundingRect returns getDrawArea function", () => {
		const resultsRow = new ResultsRow(mockScene, mockRowConfig, mockGetDrawArea);
		expect(resultsRow.getBoundingRect()).toEqual(mockDrawArea);
	});

	test("setContainerPosition sets the containers x and y position correctly", () => {
		const resultsRow = new ResultsRow(mockScene, mockRowConfig, mockGetDrawArea);
		resultsRow.setContainerPosition();
		expect(resultsRow.x).toBe(mockDrawArea.centerX);
		expect(resultsRow.y).toBe(mockDrawArea.centerY);
	});

	test("reset updates container position", () => {
		const resultsRow = new ResultsRow(mockScene, mockRowConfig, mockGetDrawArea);
		mockDrawArea.centerX = 43;
		mockDrawArea.centerY = 23;
		resultsRow.reset();
		expect(resultsRow.x).toBe(mockDrawArea.centerX);
		expect(resultsRow.y).toBe(mockDrawArea.centerY);
	});

	test("the makeAccessible function has been implemented to stop overlays from crashing", () => {
		const resultsRow = new ResultsRow(mockScene, mockRowConfig, mockGetDrawArea);
		expect(resultsRow.makeAccessible).not.toThrow();
	});
});
