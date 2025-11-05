// Copied from enum class transcoder_texture_format in basisu_transcoder.h with minor javascript-ification
export const BASIS_FORMAT = {
	// Compressed formats
	// ETC1-2
	cTFETC1_RGB: 0, // Opaque only, returns RGB or alpha data if cDecodeFlagsTranscodeAlphaDataToOpaqueFormats flag is specified
	cTFETC2_RGBA: 1, // Opaque+alpha, ETC2_EAC_A8 block followed by a ETC1 block, alpha channel will be opaque for opaque .basis files

	// BC1-5, BC7 (desktop, some mobile devices)
	cTFBC1_RGB: 2, // Opaque only, no punchthrough alpha support yet, transcodes alpha slice if cDecodeFlagsTranscodeAlphaDataToOpaqueFormats flag is specified
	cTFBC3_RGBA: 3, // Opaque+alpha, BC4 followed by a BC1 block, alpha channel will be opaque for opaque .basis files
	cTFBC4_R: 4, // Red only, alpha slice is transcoded to output if cDecodeFlagsTranscodeAlphaDataToOpaqueFormats flag is specified
	cTFBC5_RG: 5, // XY: Two BC4 blocks, X=R and Y=Alpha, .basis file should have alpha data (if not Y will be all 255's)
	cTFBC7_RGBA: 6, // RGB or RGBA, mode 5 for ETC1S, modes (1,2,3,5,6,7) for UASTC

	// PVRTC1 4bpp (mobile, PowerVR devices)
	cTFPVRTC1_4_RGB: 8, // Opaque only, RGB or alpha if cDecodeFlagsTranscodeAlphaDataToOpaqueFormats flag is specified, nearly lowest quality of any texture format.
	cTFPVRTC1_4_RGBA: 9, // Opaque+alpha, most useful for simple opacity maps. If .basis file doesn't have alpha cTFPVRTC1_4_RGB will be used instead. Lowest quality of any supported texture format.

	// ASTC (mobile, Intel devices, hopefully all desktop GPU's one day)
	cTFASTC_4x4_RGBA: 10, // Opaque+alpha, ASTC 4x4, alpha channel will be opaque for opaque .basis files. Transcoder uses RGB/RGBA/L/LA modes, void extent, and up to two ([0,47] and [0,255]) endpoint precisions.

	// Uncompressed (raw pixel) formats
	cTFRGBA32: 13, // 32bpp RGBA image stored in raster (not block) order in memory, R is first byte, A is last byte.
	cTFRGB565: 14, // 166pp RGB image stored in raster (not block) order in memory, R at bit position 11
	cTFBGR565: 15, // 16bpp RGB image stored in raster (not block) order in memory, R at bit position 0
	cTFRGBA4444: 16, // 16bpp RGBA image stored in raster (not block) order in memory, R at bit position 12, A at bit position 0

	cTFTotalTextureFormats: 22,
};
