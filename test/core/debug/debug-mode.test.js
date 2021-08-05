/**
 * @copyright BBC 2018
 * @author BBC Children's D+E
 * @license Apache-2.0
 */
import * as debugMode from "../../../src/core/debug/debug-mode.js";
import * as parseUrlParams from "../../../src/core/parse-url-params.js";

describe("Debug Mode", () => {
	const game = {};
	const debugWindowKeys = ["gmi", "collections", "debugParam"];

	let testWindow = {
		location: {
			search: "",
			hostname: "",
		},
	};

	afterEach(() => {
		jest.clearAllMocks();
		testWindow = {
			location: {
				search: "",
				hostname: "",
			},
		};
	});

	test("adds __debug object to window when parseUrlParams returns true", () => {
		jest.spyOn(parseUrlParams, "parseUrlParams").mockImplementation(() => ({ debug: true }));
		debugMode.create(testWindow, game);
		expect(Object.keys(testWindow.__debug)).toEqual(debugWindowKeys);
	});

	test("adds __debug object to window when URL includes www.test.bbc.", () => {
		jest.spyOn(parseUrlParams, "parseUrlParams").mockImplementation(() => ({ debug: false }));
		testWindow = {
			location: {
				search: "",
				hostname: "www.test.bbc.com",
			},
		};
		debugMode.create(testWindow, game);
		expect(Object.keys(testWindow.__debug)).toEqual(debugWindowKeys);
	});

	test("does not add __debug object to window when not correct params or URL", () => {
		jest.fn(parseUrlParams, "parseUrlParams").mockImplementation(() => ({ debug: false }));
		debugMode.create(testWindow, game);
		expect(testWindow.__debug).not.toBeDefined();
	});

	describe("Debug Mode", () => {
		test("is false when url does not includes parameter 'debug=true'", () => {
			jest.spyOn(parseUrlParams, "parseUrlParams").mockImplementation(() => ({ debug: false }));

			expect(debugMode.isDebug()).toEqual(false);
		});

		test("is true when url includes parameter 'debug=true'", () => {
			jest.spyOn(parseUrlParams, "parseUrlParams").mockImplementation(() => ({ debug: true }));

			expect(debugMode.isDebug()).toEqual(true);
		});
	});
});
