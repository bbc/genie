/**
 * @copyright BBC 2020
 * @author BBC Children's D+E
 * @license Apache-2.0
 */
import { isTween, createTween } from "../../../src/core/background/tweens.js";

describe("Background Tweens", () => {
	let mockTween;
	let mockScene;
	beforeEach(() => {
		mockTween = { name: "test_tween" };
		mockScene = {
			tweens: { add: jest.fn(() => "mockTween") },
			children: { list: [] },
			config: { background: { tweens: [mockTween] } },
		};
	});

	afterEach(jest.clearAllMocks);

	describe("isTween method", () => {
		test("returns true if matching named tween exists in scene config", () => {
			expect(isTween(mockScene)("test_tween")).toBe(true);
		});
	});

	describe("createTween method", () => {
		test("returns newly created tween if matching named tween exists in scene config", () => {
			mockTween.targets = ["test_background_item"];
			mockScene.children.list = [{ name: "test_background_item" }];

			const returned = createTween(mockScene)("test_tween");

			expect(mockScene.tweens.add).toHaveBeenCalledWith({ targets: [{ name: "test_background_item" }] });
			expect(returned).toBe("mockTween");
		});
	});
});
