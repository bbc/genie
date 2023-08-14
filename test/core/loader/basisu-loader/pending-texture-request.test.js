/**
 * @copyright BBC 2023
 * @author BBC Children's D+E
 * @license Apache-2.0
 */
import { PendingTextureRequest } from "../../../../src/core/loader/basisu-loader/pending-texture-request.js";

describe("Pending Texture Request", () => {
	let mockGL;
	beforeEach(() => {
		mockGL = {
			createTexture: jest.fn(),
			bindTexture: jest.fn(),
			texParameteri: jest.fn(),
			texImage2D: jest.fn(),
			generateMipmap: jest.fn(),
			compressedTexImage2D: jest.fn(),
		};
	});
	afterEach(jest.clearAllMocks);

	test("Creates a new class with passed in gl property", () => {
		const pendingTextureRequest = new PendingTextureRequest(mockGL);
		expect(pendingTextureRequest.gl).toBe(mockGL);
	});

	test("uploadImageData method creates a gl texture base", () => {
		const pendingTextureRequest = new PendingTextureRequest(mockGL);

		pendingTextureRequest.uploadImageData({}, [], [1]);
		expect(mockGL.createTexture).toHaveBeenCalled();
	});

	test("uploadImageData method auto generates mipmaps if uncompressed and mipLevels length is 1", () => {
		const pendingTextureRequest = new PendingTextureRequest(mockGL);

		mockGL.TEXTURE_2D = "TEST_TAG";

		pendingTextureRequest.uploadImageData({ uncompressed: true }, [], [1]);
		expect(mockGL.generateMipmap).toHaveBeenCalledWith("TEST_TAG");
	});

	test("uploadImageData method creates Unit8Array if compressed and type is signed", () => {
		const pendingTextureRequest = new PendingTextureRequest(mockGL);

		mockGL.TEXTURE_2D = "TEST_TAG";

		pendingTextureRequest.uploadImageData({ uncompressed: true, type: "signed test" }, [], [1]);

		const levelData = mockGL.texImage2D.mock.calls[0][8];
		expect(levelData.constructor).toBe(Uint8Array);
	});
});
