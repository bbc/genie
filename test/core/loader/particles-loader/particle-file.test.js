/**
 * @copyright BBC 2019
 * @author BBC Children's D+E
 * @license Apache-2.0
 */
import { ParticlesFile } from "../../../../src/core/loader/particles-loader/particles-file.js";
import { geomParse } from "../../../../src/core/loader/particles-loader/geom-parse.js";

jest.mock("../../../../src/core/loader/particles-loader/geom-parse.js");

describe("Particles File", () => {
	let mockLoader;
	let mockFileConfig;

	beforeEach(() => {
		mockLoader = {
			nextFile: jest.fn(),
			emit: jest.fn(),
			cacheManager: {
				json: {},
			},
		};
		mockFileConfig = {
			type: "particles",
			key: "testConfig",
			url: "test/test.json5",
		};
	});
	afterEach(() => jest.clearAllMocks());

	describe("onProcess method", () => {
		test("calls the the JSON parser", () => {
			jest.spyOn(global.JSON, "parse");
			const file = new ParticlesFile(mockLoader, mockFileConfig);
			const testJSON = "{}";

			file.xhrLoader = {
				responseText: testJSON,
			};
			file.onProcessComplete = jest.fn();
			file.onProcess();
			expect(global.JSON.parse).toHaveBeenCalledWith(testJSON);
		});

		test("does not call the Geom parser when a emitZone or deathZone source is not provided", () => {
			const file = new ParticlesFile(mockLoader, mockFileConfig);
			const testJSON = "{}";

			file.xhrLoader = {
				responseText: testJSON,
			};
			file.onProcessComplete = jest.fn();
			file.onProcess();
			expect(geomParse).not.toHaveBeenCalled();
		});

		test("calls the Geom parser when a emitZone source is provided", () => {
			const file = new ParticlesFile(mockLoader, mockFileConfig);
			const testJSON = '{ "emitZone": { "source": { "emitZone": "mock" } } }';

			file.xhrLoader = {
				responseText: testJSON,
			};
			file.onProcessComplete = jest.fn();
			file.onProcess();
			expect(geomParse).toHaveBeenCalledWith({ emitZone: "mock" });
		});

		test("sets return value on data when a emitZone source is provided", () => {
			const file = new ParticlesFile(mockLoader, mockFileConfig);
			const testJSON = '{ "emitZone": { "source": { "emitZone": "mock" } } }';
			geomParse.mockImplementation(() => "mock emit zone");
			file.xhrLoader = {
				responseText: testJSON,
			};
			file.onProcessComplete = jest.fn();
			file.onProcess();
			expect(file.data).toEqual({ emitZone: { source: "mock emit zone" } });
		});

		test("calls the Geom parser when a deathZone source is provided", () => {
			const file = new ParticlesFile(mockLoader, mockFileConfig);
			const testJSON = '{ "emitZone": { "source": { "deathZone": "mock" } } }';

			file.xhrLoader = {
				responseText: testJSON,
			};
			file.onProcessComplete = jest.fn();
			file.onProcess();
			expect(geomParse).toHaveBeenCalledWith({ deathZone: "mock" });
		});

		test("sets return value on data when a deathZone source is provided", () => {
			const file = new ParticlesFile(mockLoader, mockFileConfig);
			const testJSON = '{ "deathZone": { "source": { "deathZone": "mock" } } }';
			geomParse.mockImplementation(() => "mock death zone");
			file.xhrLoader = {
				responseText: testJSON,
			};
			file.onProcessComplete = jest.fn();
			file.onProcess();
			expect(file.data).toEqual({ deathZone: { source: "mock death zone" } });
		});

		test("calls onProcessComplete", () => {
			const file = new ParticlesFile(mockLoader, mockFileConfig);
			const testJSON = "{}";

			file.xhrLoader = {
				responseText: testJSON,
			};
			file.onProcessComplete = jest.fn();
			file.onProcess();
			expect(file.onProcessComplete).toHaveBeenCalled();
		});
	});
});
