/**
 * @copyright BBC 2018
 * @author BBC Children's D+E
 * @license Apache-2.0
 */
import { assetPath } from "../../../src/core/layout/asset-paths.js";

describe("asset paths", () => {
	test("returns the correct asset path for desktop assets", () => {
		const path = assetPath({ key: "mockId", isMobile: false });
		expect(path).toBe("gelDesktop.mockId");
	});

	test("returns the correct asset path for mobile assets", () => {
		const path = assetPath({ key: "mockId", isMobile: true });
		expect(path).toBe("gelMobile.mockId");
	});

	test("returns the correct asset path for game buttons", () => {
		const path = assetPath({ key: "mockId", scene: "mockScene", gameButton: true });
		expect(path).toBe("mockScene.mockId");
	});

	test("returns the correct asset path for game buttons when no scene prefix provided", () => {
		const path = assetPath({ key: "mockScene.mockId", gameButton: true });
		expect(path).toBe("mockScene.mockId");
	});
});
