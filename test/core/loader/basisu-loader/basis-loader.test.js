/**
 * @copyright BBC 2023
 * @author BBC Children's D+E
 * @license Apache-2.0
 */
import { BasisLoader } from "../../../../src/core/loader/basisu-loader/basis-loader.js";

describe("Basis Loader", () => {
	let mockGL;
	let mockWorker;

	beforeEach(() => {
		mockWorker = jest.fn(() => ({
			postMessage: jest.fn(),
		}));
		global.Worker = mockWorker;
		mockGL = {
			getExtension: jest.fn(),
		};
	});
	afterEach(() => jest.clearAllMocks());

	describe("Constructor", () => {
		test("Creates a Web Worker", () => {
			const loader = new BasisLoader(mockGL);
			expect(Object.keys(loader.worker)).toEqual(["postMessage", "onmessage"]);
		});
	});

	describe("setWebGLContext method", () => {
		test("Detects supported formats", () => {
			const loader = new BasisLoader(mockGL);

			loader.setWebGLContext(mockGL);
			expect(Object.keys(loader.supportedFormats).sort()).toEqual([
				"astc",
				"bptc",
				"etc1",
				"etc2",
				"pvrtc",
				"s3tc",
			]);
		});

		test("Sets formats to blank if nothing passed in", () => {
			const loader = new BasisLoader(mockGL);
			loader.setWebGLContext();
			expect(loader.supportedFormats).toEqual({});
		});
	});

	describe("transcodeBuffer method", () => {
		test("y", () => {
			const loader = new BasisLoader(mockGL);

			loader.transcodeBuffer({});
		});
	});

	describe("Worker onmessage method", () => {
		test("Uploads image data and resolves pending texture", () => {
			const loader = new BasisLoader(mockGL);
			const uploadImageDataSpy = jest.fn();
			const resolveSpy = jest.fn();

			loader.pendingTextures["test"] = {
				uploadImageData: uploadImageDataSpy,
				resolve: resolveSpy,
			};

			const data = { id: "test", mipLevels: [{ width: 256, height: 256 }] };
			loader.worker.onmessage({ data });

			expect(uploadImageDataSpy).toHaveBeenCalled();
			expect(resolveSpy).toHaveBeenCalled();
		});

		test("Adds alpha texture if available", () => {
			const loader = new BasisLoader(mockGL);

			const mockPendingTexture = {
				uploadImageData: jest.fn(() => "Mock Texture"),
				resolve: jest.fn(),
			};

			loader.pendingTextures["test"] = mockPendingTexture;

			const data = { alphaBuffer: true, id: "test", mipLevels: [{ width: 256, height: 256 }] };
			loader.worker.onmessage({ data });
			expect(mockPendingTexture.alphaTexture).toBe("Mock Texture");
		});

		test("Rejects Texture if message data contains error", () => {
			const loader = new BasisLoader(mockGL);
			global.console.error = jest.fn();

			const mockPendingTexture = {
				uploadImageData: jest.fn(() => "Mock Texture"),
				reject: jest.fn(),
			};

			loader.pendingTextures["test"] = mockPendingTexture;

			const data = { error: true, id: "test", mipLevels: [{ width: 256, height: 256 }] };
			loader.worker.onmessage({ data });
			expect(mockPendingTexture.reject).toHaveBeenCalled();
			expect(global.console.error).toHaveBeenCalled();
		});

		test("Errors if texture id does not exist", () => {
			const loader = new BasisLoader(mockGL);
			global.console.error = jest.fn();

			const data = { id: "test", mipLevels: [{ width: 256, height: 256 }] };
			loader.worker.onmessage({ data });
			expect(global.console.error).toHaveBeenCalledTimes(1);
		});

		test("Errors if texture id does not exist and passes msg error if present", () => {
			const loader = new BasisLoader(mockGL);
			global.console.error = jest.fn();

			const data = { error: true, id: "test", mipLevels: [{ width: 256, height: 256 }] };
			loader.worker.onmessage({ data });
			expect(global.console.error).toHaveBeenCalledTimes(2);
		});
	});
});
