/**
 * @copyright BBC 2020
 * @author BBC Children's D+E
 * @license Apache-2.0
 */
import { getDefaultPlugins } from "../../../../src/core/loader/phaser-defaults/get-default-plugins.js";
const getPluginKeys = plugins => plugins.map(i => i.key);

describe("Default Plugins", () => {
	beforeEach(() => {});

	afterEach(jest.clearAllMocks);

	test("Returns required plugins by default (no passed in options)", () => {
		const options = {};
		const defaults = getDefaultPlugins(options);

		expect(Object.keys(defaults)).toEqual(["global", "scene"]);
		expect(getPluginKeys(defaults.global)).toEqual([
			"FontLoader",
			"JSON5Loader",
			"ParticlesLoader",
			"rexBBCodeTextPlugin",
			"rexNinePatchPlugin",
			"BasisULoader",
		]);
		expect(getPluginKeys(defaults.scene)).toEqual(["SpinePlugin"]);
	});

	test("Returns additional merged plugins if passed in as options", () => {
		const options = {
			plugins: {
				global: [{ key: "testGlobalPlugin" }],
				scene: [{ key: "testScenePlugin" }],
			},
		};
		const defaults = getDefaultPlugins(options);

		expect(Object.keys(defaults)).toEqual(["global", "scene"]);
		expect(getPluginKeys(defaults.global)).toEqual([
			"FontLoader",
			"JSON5Loader",
			"ParticlesLoader",
			"rexBBCodeTextPlugin",
			"rexNinePatchPlugin",
			"BasisULoader",
			"testGlobalPlugin",
		]);
		expect(getPluginKeys(defaults.scene)).toEqual(["SpinePlugin", "testScenePlugin"]);
	});
});
