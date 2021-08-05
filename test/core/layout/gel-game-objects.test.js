/**
 * @copyright BBC 2020
 * @author BBC Children's D+E
 * @license Apache-2.0
 */
import { addGelButton } from "../../../src/core/layout/gel-game-objects.js";

const mockGelButton = {
	test: "data",
	sprite: "testSprite",
};

jest.mock("../../../src/core/layout/gel-button.js", () => ({
	GelButton: jest.fn(() => mockGelButton),
}));

describe("addGelButton", () => {
	let mockScene;
	let mockThis;

	beforeEach(() => {
		mockScene = {
			add: {
				sprite: jest.fn(),
			},
			sys: {
				queueDepthSort: jest.fn(),
			},
		};

		mockThis = {
			add: jest.fn(),
			scene: mockScene,
			displayList: { add: jest.fn() },
			updateList: { add: jest.fn() },
		};
	});

	afterEach(() => jest.clearAllMocks());

	test("it adds a gel button to the scene's display list", () => {
		const button = addGelButton.call(mockThis, 0, 0, {}, {});
		expect(mockThis.displayList.add).toHaveBeenCalledWith(button);
	});

	test("it adds the gel button's sprite to the scene's update list", () => {
		const button = addGelButton.call(mockThis, 0, 0, {}, {});
		expect(mockThis.updateList.add).toHaveBeenCalledWith(button.sprite);
	});

	test("creates and returns a gel button", () => {
		expect(addGelButton.call(mockThis, 0, 0, {}, {})).toEqual(mockGelButton);
	});
});
