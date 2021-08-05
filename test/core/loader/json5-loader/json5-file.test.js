/**
 * @copyright BBC 2019
 * @author BBC Children's D+E
 * @license Apache-2.0
 */
import * as JSON5Module from "../../../../node_modules/json5/dist/index.mjs";
import { JSON5File } from "../../../../src/core/loader/json5-loader/json5-file.js";

describe("JSON5File", () => {
	let mockLoader;
	let mockFileConfig;
	let parseSpy;

	beforeEach(() => {
		parseSpy = jest.fn();
		JSON5Module.default.parse = parseSpy;
		mockLoader = {
			nextFile: jest.fn(),
			emit: jest.fn(),
			cacheManager: {
				json: {},
			},
		};
		mockFileConfig = {
			type: "json5",
			key: "testConfig",
			url: "test/test.json5",
		};
	});
	afterEach(() => jest.clearAllMocks());

	describe("onProcess method", () => {
		test("calls the the JSON5 parser", () => {
			const file = new JSON5File(mockLoader, mockFileConfig);
			const testJSON5 = "{}";

			file.xhrLoader = {
				responseText: testJSON5,
			};
			file.onProcessComplete = jest.fn();
			file.onProcess();
			expect(parseSpy).toHaveBeenCalledWith(testJSON5);
		});

		test("calls onProcessComplete", () => {
			const file = new JSON5File(mockLoader, mockFileConfig);
			const testJSON5 = "{}";

			file.xhrLoader = {
				responseText: testJSON5,
			};
			file.onProcessComplete = jest.fn();
			file.onProcess();
			expect(file.onProcessComplete).toHaveBeenCalled();
		});
	});
});
