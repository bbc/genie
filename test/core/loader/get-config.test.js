/**
 * @copyright BBC 2020
 * @author BBC Children's D+E
 * @license Apache-2.0
 */
import { getConfig, loadConfig } from "../../../src/core/loader/get-config.js";

describe("Examples Launcher", () => {
	let mockScreen;

	beforeEach(() => {
		mockScreen = { load: { json5: jest.fn() } };
	});

	afterEach(() => jest.clearAllMocks());

	describe("loadConfig method", () => {
		test("loads each screens config", () => {
			loadConfig(mockScreen, ["home", "select"]);
			expect(mockScreen.load.json5).toHaveBeenCalledWith({
				key: "config-home",
				url: "home/config.json5",
			});
			expect(mockScreen.load.json5).toHaveBeenCalledWith({
				key: "config-select",
				url: "select/config.json5",
			});
			expect(mockScreen.load.json5).toHaveBeenCalledTimes(2);
		});

		test("loads debug screens config correctly", () => {
			loadConfig(mockScreen, ["home", "../../debug"]);
			expect(mockScreen.load.json5).toHaveBeenCalledWith({
				key: "config-home",
				url: "home/config.json5",
			});
			expect(mockScreen.load.json5).toHaveBeenCalledWith({
				key: "config-debug",
				url: "../../debug/config.json5",
			});
			expect(mockScreen.load.json5).toHaveBeenCalledTimes(2);
		});
	});

	describe("getConfig method", () => {
		test("Gets merged, preloaded configs from file path", () => {
			const mockKeys = ["home", "select", "results"];

			const json = {
				"config-home": { key0: "mockConfig0" },
				"config-select": { key1: "mockConfig1" },
				"config-results": { key2: "mockConfig2" },
			};

			mockScreen = {
				cache: {
					json: {
						get: jest.fn(path => json[path]),
					},
				},
			};

			expect(getConfig(mockScreen, mockKeys)).toEqual({
				home: {
					key0: "mockConfig0",
				},
				results: {
					key2: "mockConfig2",
				},
				select: {
					key1: "mockConfig1",
				},
			});
		});

		test("gets debug config correctly", () => {
			const mockKeys = ["home", "../../debug", "results"];

			const json = {
				"config-home": { key0: "mockConfig0" },
				"config-debug": { key1: "mockConfig1" },
				"config-results": { key2: "mockConfig2" },
			};

			mockScreen = {
				cache: {
					json: {
						get: jest.fn(path => json[path]),
					},
				},
			};

			expect(getConfig(mockScreen, mockKeys)).toEqual({
				home: {
					key0: "mockConfig0",
				},
				debug: {
					key1: "mockConfig1",
				},
				results: {
					key2: "mockConfig2",
				},
			});
		});
	});
});
