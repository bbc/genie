// Worker
import { BASIS } from "./basis_transcoder.js";
import { BASIS_FORMAT } from "./basis-format.js";
import { BASIS_WEBGL_FORMAT_MAP } from "./basis-webgl-format-map.js";

let BasisFile = null;

const BASIS_INITIALIZED = BASIS({
	onRuntimeInitialized: () => {
		console.log("BASIS RUNTIME INITIALISED");
	},
}).then(module => {
	BasisFile = module.BasisFile;
	module.initializeBasis();
});

// Notifies the main thread when a texture has failed to load for any reason.
function fail(id, errorMsg) {
	postMessage({
		id: id,
		error: errorMsg,
	});
}

function basisFileFail(id, basisFile, errorMsg) {
	fail(id, errorMsg);
	basisFile.close();
	basisFile.delete();
}

// This utility currently only transcodes the first image in the file.
const IMAGE_INDEX = 0;
const TOP_LEVEL_MIP = 0;

function transcode(id, arrayBuffer, supportedFormats, allowSeparateAlpha) {
	let basisData = new Uint8Array(arrayBuffer);

	let basisFile = new BasisFile(basisData);
	let images = basisFile.getNumImages();
	let levels = basisFile.getNumLevels(IMAGE_INDEX);
	let hasAlpha = basisFile.getHasAlpha();
	if (!images || !levels) {
		basisFileFail(id, basisFile, "Invalid Basis data");
		return;
	}

	if (!basisFile.startTranscoding()) {
		basisFileFail(id, basisFile, "startTranscoding failed");
		return;
	}

	let basisFormat = undefined;
	let needsSecondaryAlpha = false;
	if (hasAlpha) {
		if (supportedFormats.etc2) {
			basisFormat = BASIS_FORMAT.cTFETC2_RGBA;
		} else if (supportedFormats.bptc) {
			basisFormat = BASIS_FORMAT.cTFBC7_RGBA;
		} else if (supportedFormats.s3tc) {
			basisFormat = BASIS_FORMAT.cTFBC3_RGBA;
		} else if (supportedFormats.astc) {
			basisFormat = BASIS_FORMAT.cTFASTC_4x4_RGBA;
		} else if (supportedFormats.pvrtc) {
			if (allowSeparateAlpha) {
				basisFormat = BASIS_FORMAT.cTFPVRTC1_4_RGB;
				needsSecondaryAlpha = true;
			} else {
				basisFormat = BASIS_FORMAT.cTFPVRTC1_4_RGBA;
			}
		} else if (supportedFormats.etc1 && allowSeparateAlpha) {
			basisFormat = BASIS_FORMAT.cTFETC1_RGB;
			needsSecondaryAlpha = true;
		} else {
			// If we don't support any appropriate compressed formats transcode to
			// raw pixels. This is something of a last resort, because the GPU
			// upload will be significantly slower and take a lot more memory, but
			// at least it prevents you from needing to store a fallback JPG/PNG and
			// the download size will still likely be smaller.
			basisFormat = BASIS_FORMAT.RGBA32;
		}
	} else {
		if (supportedFormats.etc1) {
			// Should be the highest quality, so use when available.
			// http://richg42.blogspot.com/2018/05/basis-universal-gpu-texture-format.html
			basisFormat = BASIS_FORMAT.cTFETC1_RGB;
		} else if (supportedFormats.bptc) {
			basisFormat = BASIS_FORMAT.cTFBC7_RGBA;
		} else if (supportedFormats.s3tc) {
			basisFormat = BASIS_FORMAT.cTFBC1_RGB;
		} else if (supportedFormats.etc2) {
			basisFormat = BASIS_FORMAT.cTFETC2_RGBA;
		} else if (supportedFormats.astc) {
			basisFormat = BASIS_FORMAT.cTFASTC_4x4_RGBA;
		} else if (supportedFormats.pvrtc) {
			basisFormat = BASIS_FORMAT.cTFPVRTC1_4_RGB;
		} else {
			// See note on uncompressed transcode above.
			basisFormat = BASIS_FORMAT.cTFRGB565;
		}
	}

	if (basisFormat === undefined) {
		basisFileFail(id, basisFile, "No supported transcode formats");
		return;
	}

	let webglFormat = BASIS_WEBGL_FORMAT_MAP[basisFormat];

	// If we're not using compressed textures it'll be cheaper to generate
	// mipmaps on the fly, so only transcode a single level.
	if (webglFormat.uncompressed) {
		levels = 1;
	}

	// Gather information about each mip level to be transcoded.
	let mipLevels = [];
	let totalTranscodeSize = 0;

	for (let mipLevel = 0; mipLevel < levels; ++mipLevel) {
		let transcodeSize = basisFile.getImageTranscodedSizeInBytes(IMAGE_INDEX, mipLevel, basisFormat);
		mipLevels.push({
			level: mipLevel,
			offset: totalTranscodeSize,
			size: transcodeSize,
			width: basisFile.getImageWidth(IMAGE_INDEX, mipLevel),
			height: basisFile.getImageHeight(IMAGE_INDEX, mipLevel),
		});
		totalTranscodeSize += transcodeSize;
	}

	// Allocate a buffer large enough to hold all of the transcoded mip levels at once.
	let transcodeData = new Uint8Array(totalTranscodeSize);
	let alphaTranscodeData = needsSecondaryAlpha ? new Uint8Array(totalTranscodeSize) : null;

	// Transcode each mip level into the appropriate section of the overall buffer.
	for (let mipLevel of mipLevels) {
		let levelData = new Uint8Array(transcodeData.buffer, mipLevel.offset, mipLevel.size);
		if (!basisFile.transcodeImage(levelData, IMAGE_INDEX, mipLevel.level, basisFormat, 1, 0)) {
			basisFileFail(id, basisFile, "transcodeImage failed");
			return;
		}
		if (needsSecondaryAlpha) {
			let alphaLevelData = new Uint8Array(alphaTranscodeData.buffer, mipLevel.offset, mipLevel.size);
			if (!basisFile.transcodeImage(alphaLevelData, IMAGE_INDEX, mipLevel.level, basisFormat, 1, 1)) {
				basisFileFail(id, basisFile, "alpha transcodeImage failed");
				return;
			}
		}
	}

	basisFile.close();
	basisFile.delete();

	// Post the transcoded results back to the main thread.
	let transferList = [transcodeData.buffer];
	if (needsSecondaryAlpha) {
		transferList.push(alphaTranscodeData.buffer);
	}
	postMessage(
		{
			id: id,
			buffer: transcodeData.buffer,
			alphaBuffer: needsSecondaryAlpha ? alphaTranscodeData.buffer : null,
			webglFormat: webglFormat,
			mipLevels: mipLevels,
			hasAlpha: hasAlpha,
		},
		transferList,
	);
}

onmessage = msg => {
	// Each call to the worker must contain:
	let url = msg.data.url; // The URL of the basis image OR
	let buffer = msg.data.buffer; // An array buffer with the basis image data
	let allowSeparateAlpha = msg.data.allowSeparateAlpha;
	let supportedFormats = msg.data.supportedFormats; // The formats this device supports
	let id = msg.data.id; // A unique ID for the texture

	//received from main thread- a url to be fetched and processed?
	if (url) {
		// Make the call to fetch the basis texture data then transcode
		//TODO stop this being hardcoded
		fetch("http://localhost:9000/" + url).then(function (response) {
			if (response.ok) {
				response.arrayBuffer().then(arrayBuffer => {
					if (BasisFile) {
						transcode(id, arrayBuffer, supportedFormats, allowSeparateAlpha);
					} else {
						BASIS_INITIALIZED.then(() => {
							transcode(id, arrayBuffer, supportedFormats, allowSeparateAlpha);
						});
					}
				});
			} else {
				fail(id, `Fetch failed: ${response.status}, ${response.statusText}`);
			}
		});
	}
	//transcode received buffer
	//TODO Tidy this first initialisation
	else if (buffer) {
		if (BasisFile) {
			transcode(id, buffer, supportedFormats, allowSeparateAlpha);
		} else {
			BASIS_INITIALIZED.then(() => {
				transcode(id, buffer, supportedFormats, allowSeparateAlpha);
			});
		}
	} else {
		fail(id, `No url or buffer specified`);
	}
};
