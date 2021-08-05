/**
 * @copyright BBC 2020
 * @author BBC Children's D+E
 * @license Apache-2.0
 */
import { ResultsBitmapText } from "../../../src/components/results/results-bitmaptext.js";
import { mockBaseScene } from "../../mock/mock-scene.js";

describe("ResultsBitmapText", () => {
	let mockScene;
	let mockConfig;

	beforeEach(() => {
		mockScene = mockBaseScene();
		mockScene.scene = { key: "results" };
		mockScene.transientData = {
			results: {
				name: "darkness",
			},
		};
		mockConfig = {
			content: "Hello <%= name %>",
			font: "somefont",
		};
		ResultsBitmapText.prototype.updateDisplayOrigin = () => {};
	});

	afterEach(() => jest.clearAllMocks());

	test("sets text on the gameobject using transient data and the string template", () => {
		const resultsText = new ResultsBitmapText(mockScene, mockConfig);
		expect(resultsText.text).toBe("Hello darkness");
	});
});
