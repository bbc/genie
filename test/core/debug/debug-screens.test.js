/**
 * @copyright BBC 2018
 * @author BBC Children's D+E
 * @license Apache-2.0
 */
import { getLauncherScreen, addExampleScreens } from "../../../src/core/debug/debug-screens.js";
import * as Load from "../../../src/core/loader/load-collections.js";
import * as Examples from "../../../src/core/debug/examples.js";
import * as Config from "../../../src/core/loader/get-config.js";

jest.mock("../../../src/core/loader/get-config.js");
jest.mock("../../../src/core/debug/examples.js");
jest.mock("../../../src/core/loader/load-collections.js");

describe("getDebugScreens", () => {
	describe("getLauncherScreen", () => {
		test("Returns empty object if not debug mode", () => {
			expect(getLauncherScreen(false)).toEqual({});
		});

		test("Returns debug screen if debug mode", () => {
			expect(Object.keys(getLauncherScreen(true))).toEqual(["debug"]);
		});
	});

	describe("addExampleScreens", () => {
		let mockScreen;

		beforeEach(() => {
			Config.getConfig = jest.fn(() => ({ screen: "mockConfig" }));
			Examples.examples = { "debug-mockKey1": "", "debug-mockKey2": "", "debug-mockKey3": "" };

			mockScreen = {
				setConfig: jest.fn(),
				context: {
					config: {},
					navigation: {},
				},
				load: {
					setBaseURL: jest.fn(),
					setPath: jest.fn(),
				},
				scene: {
					add: jest.fn(),
				},
			};
		});

		afterEach(jest.clearAllMocks);

		test("gets and sets config for all example screens", () => {
			addExampleScreens(mockScreen);
			expect(mockScreen.scene.add).toHaveBeenCalled();
			expect(Config.getConfig).toHaveBeenCalledWith(mockScreen, Object.keys(Examples.examples));
			expect(mockScreen.setConfig.mock.calls[0][0]).toEqual({
				navigation: { "debug-mockKey1": "", "debug-mockKey2": "", "debug-mockKey3": "" },
				screen: "mockConfig",
			});

			expect(Load.loadCollections).toHaveBeenCalledWith(mockScreen, { screen: "mockConfig" }, "debug/");
		});

		test("Does not call a second time (fp.once)", () => {
			addExampleScreens(mockScreen);
			expect(mockScreen.setConfig).not.toHaveBeenCalled();
		});
	});
});
