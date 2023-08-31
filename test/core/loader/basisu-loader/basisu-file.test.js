/**
 * @copyright BBC 2023
 * @author BBC Children's D+E
 * @license Apache-2.0
 */
import * as BasisLoaderModule from "../../../../src/core/loader/basisu-loader/basis-loader.js";
import { BasisUFile } from "../../../../src/core/loader/basisu-loader/basisu-file.js";

describe("BASISUFile", () => {
	let mockLoader;
	let mockFileConfig;
	let transcodeSpy;
	let mockWorker;

	beforeEach(() => {
		transcodeSpy = jest.fn(() => Promise.resolve({}));
		BasisLoaderModule.BasisLoader = jest.fn(() => ({
			transcodeBuffer: {
				bind: () => transcodeSpy,
			},
		}));

		mockLoader = {
			nextFile: jest.fn(),
			emit: jest.fn(),
			cacheManager: {
				json: {},
			},
			scene: {
				renderer: {
					gl: {
						getExtension: jest.fn(),
					},
				},
				textures: {
					addGLTexture: jest.fn(),
				},
			},
		};
		mockFileConfig = {
			type: "basisu",
			key: "testConfig",
			url: "test/test.basisu",
		};
		mockWorker = jest.fn();
		global.Worker = mockWorker;
	});
	afterEach(() => jest.clearAllMocks());

	describe("onProcess method", () => {
		test("calls the the BASISU parser", async () => {
			const file = new BasisUFile(mockLoader, mockFileConfig);
			const testBASIS = { basis: true };

			file.xhrLoader = {
				response: {
					arrayBuffer: jest.fn(() => Promise.resolve(testBASIS)),
				},
			};
			file.onProcessComplete = jest.fn();
			await file.onProcess();

			expect(transcodeSpy).toHaveBeenCalledWith(testBASIS);
		});

		test("calls onProcessComplete", async () => {
			const file = new BasisUFile(mockLoader, mockFileConfig);

			file.xhrLoader = {
				response: {
					arrayBuffer: jest.fn(() => Promise.resolve({})),
				},
			};
			file.onProcessComplete = jest.fn();
			await file.onProcess();
			expect(file.onProcessComplete).toHaveBeenCalled();
		});
	});
});
