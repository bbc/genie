/**
 * @copyright BBC 2020
 * @author BBC Children's D+E
 * @license Apache-2.0
 */
import { ResultsText } from "../../../src/components/results/results-text.js";
import { mockBaseScene } from "../../mock/mock-scene.js";

describe("ResultsText", () => {
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
		};
	});

	afterEach(() => jest.clearAllMocks());

	test("sets text on the gameobject using transient data and the string template", () => {
		const resultsText = new ResultsText(mockScene, mockConfig);
		expect(resultsText.text).toBe("Hello darkness");
	});
});
