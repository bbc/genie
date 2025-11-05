// WebGL compressed formats types, from:
// http://www.khronos.org/registry/webgl/extensions/

// https://www.khronos.org/registry/webgl/extensions/WEBGL_compressed_texture_s3tc/
import { BASIS_FORMAT } from "./basis-format.js";

const COMPRESSED_RGB_S3TC_DXT1_EXT = 0x83f0;
const COMPRESSED_RGBA_S3TC_DXT1_EXT = 0x83f1;
const COMPRESSED_RGBA_S3TC_DXT3_EXT = 0x83f2;
const COMPRESSED_RGBA_S3TC_DXT5_EXT = 0x83f3; //TODO Note this is the desktop format for chrome

// https://www.khronos.org/registry/webgl/extensions/WEBGL_compressed_texture_etc1/
const COMPRESSED_RGB_ETC1_WEBGL = 0x8d64;

// https://www.khronos.org/registry/webgl/extensions/WEBGL_compressed_texture_etc/
const COMPRESSED_R11_EAC = 0x9270;
const COMPRESSED_SIGNED_R11_EAC = 0x9271;
const COMPRESSED_RG11_EAC = 0x9272;
const COMPRESSED_SIGNED_RG11_EAC = 0x9273;
const COMPRESSED_RGB8_ETC2 = 0x9274;
const COMPRESSED_SRGB8_ETC2 = 0x9275;
const COMPRESSED_RGB8_PUNCHTHROUGH_ALPHA1_ETC2 = 0x9276;
const COMPRESSED_SRGB8_PUNCHTHROUGH_ALPHA1_ETC2 = 0x9277;
const COMPRESSED_RGBA8_ETC2_EAC = 0x9278;
const COMPRESSED_SRGB8_ALPHA8_ETC2_EAC = 0x9279;

// https://www.khronos.org/registry/webgl/extensions/WEBGL_compressed_texture_astc/
const COMPRESSED_RGBA_ASTC_4x4_KHR = 0x93b0;

// https://www.khronos.org/registry/webgl/extensions/WEBGL_compressed_texture_pvrtc/
const COMPRESSED_RGB_PVRTC_4BPPV1_IMG = 0x8c00;
const COMPRESSED_RGB_PVRTC_2BPPV1_IMG = 0x8c01;
const COMPRESSED_RGBA_PVRTC_4BPPV1_IMG = 0x8c02;
const COMPRESSED_RGBA_PVRTC_2BPPV1_IMG = 0x8c03;

// https://www.khronos.org/registry/webgl/extensions/EXT_texture_compression_bptc/
const COMPRESSED_RGBA_BPTC_UNORM_EXT = 0x8e8c;
const COMPRESSED_SRGB_ALPHA_BPTC_UNORM_EXT = 0x8e8d;
const COMPRESSED_RGB_BPTC_SIGNED_FLOAT_EXT = 0x8e8e;
const COMPRESSED_RGB_BPTC_UNSIGNED_FLOAT_EXT = 0x8e8f;

export const BASIS_WEBGL_FORMAT_MAP = {};
// Compressed formats
BASIS_WEBGL_FORMAT_MAP[BASIS_FORMAT.cTFBC1_RGB] = { format: COMPRESSED_RGB_S3TC_DXT1_EXT };
BASIS_WEBGL_FORMAT_MAP[BASIS_FORMAT.cTFBC3_RGBA] = { format: COMPRESSED_RGBA_S3TC_DXT5_EXT };
BASIS_WEBGL_FORMAT_MAP[BASIS_FORMAT.cTFBC7_RGBA] = { format: COMPRESSED_RGBA_BPTC_UNORM_EXT };
BASIS_WEBGL_FORMAT_MAP[BASIS_FORMAT.cTFETC1_RGB] = { format: COMPRESSED_RGB_ETC1_WEBGL };
BASIS_WEBGL_FORMAT_MAP[BASIS_FORMAT.cTFETC2_RGBA] = { format: COMPRESSED_RGBA8_ETC2_EAC };
BASIS_WEBGL_FORMAT_MAP[BASIS_FORMAT.cTFASTC_4x4_RGBA] = { format: COMPRESSED_RGBA_ASTC_4x4_KHR };
BASIS_WEBGL_FORMAT_MAP[BASIS_FORMAT.cTFPVRTC1_4_RGB] = { format: COMPRESSED_RGB_PVRTC_4BPPV1_IMG };
BASIS_WEBGL_FORMAT_MAP[BASIS_FORMAT.cTFPVRTC1_4_RGBA] = { format: COMPRESSED_RGBA_PVRTC_4BPPV1_IMG };

// Uncompressed formats
BASIS_WEBGL_FORMAT_MAP[BASIS_FORMAT.cTFRGBA32] = {
	uncompressed: true,
	format: WebGLRenderingContext.RGBA,
	type: WebGLRenderingContext.UNSIGNED_BYTE,
};
BASIS_WEBGL_FORMAT_MAP[BASIS_FORMAT.cTFRGB565] = {
	uncompressed: true,
	format: WebGLRenderingContext.RGB,
	type: WebGLRenderingContext.UNSIGNED_SHORT_5_6_5,
};
BASIS_WEBGL_FORMAT_MAP[BASIS_FORMAT.cTFRGBA4444] = {
	uncompressed: true,
	format: WebGLRenderingContext.RGBA,
	type: WebGLRenderingContext.UNSIGNED_SHORT_4_4_4_4,
};