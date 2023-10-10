var astcSupported = false;
var etcSupported = false;
var dxtSupported = false;
var bc7Supported = false;
var pvrtcSupported = false;
var drawMode = 0;

var tex, width, height, images, levels, have_alpha, alignedWidth, alignedHeight, format, displayWidth, displayHeight;

export const dataLoaded = (data, Module) => {
	console.log('Done loading .basis file, decoded header:');

	const { BasisFile, initializeBasis } = Module;
	initializeBasis();

	const startTime = performance.now();

	const basisFile = new BasisFile(new Uint8Array(data));

	width = basisFile.getImageWidth(0, 0);
	height = basisFile.getImageHeight(0, 0);
	images = basisFile.getNumImages();
	levels = basisFile.getNumLevels(0);
	has_alpha = basisFile.getHasAlpha();

	//dumpBasisFileDesc(basisFile);

	if (!width || !height || !images || !levels) {
		console.warn('Invalid .basis file');
		basisFile.close();
		basisFile.delete();
		return;
	}

	// Note: If the file is UASTC, the preferred formats are ASTC/BC7.
	// If the file is ETC1S and doesn't have alpha, the preferred formats are ETC1 and BC1. For alpha, the preferred formats are ETC2, BC3 or BC7.

	var formatString = 'UNKNOWN';
	if (astcSupported)
	{
		formatString = 'ASTC';
		format = BASIS_FORMAT.cTFASTC_4x4;
	}
	else if (bc7Supported)
	{
		formatString = 'BC7';
		format = BASIS_FORMAT.cTFBC7;
	}
	else if (dxtSupported)
	{
		if (has_alpha)
		{
			formatString = 'BC3';
			format = BASIS_FORMAT.cTFBC3;
		}
		else
		{
			formatString = 'BC1';
			format = BASIS_FORMAT.cTFBC1;
		}
	}
	else if (pvrtcSupported)
	{
		if (has_alpha)
		{
			formatString = 'PVRTC1_RGBA';
			format = BASIS_FORMAT.cTFPVRTC1_4_RGBA;
		}
		else
		{
			formatString = 'PVRTC1_RGB';
			format = BASIS_FORMAT.cTFPVRTC1_4_RGB;
		}

		if (
			((width & (width - 1)) != 0) || ((height & (height - 1)) != 0)
		)
		{
			log('ERROR: PVRTC1 requires square power of 2 textures');
		}
		if (width != height)
		{
			log('ERROR: PVRTC1 requires square power of 2 textures');
		}
	}
	else if (etcSupported)
	{
		formatString = 'ETC1';
		format = BASIS_FORMAT.cTFETC1;
	}
	else
	{
		formatString = 'RGB565';
		format = BASIS_FORMAT.cTFRGB565;
		log('Decoding .basis data to 565');
	}

	//elem('format').innerText = formatString;

	console.log('format: ' + format);

	if (!basisFile.startTranscoding()) {
		log('startTranscoding failed');
		console.warn('startTranscoding failed');
		basisFile.close();
		basisFile.delete();
		return;
	}

	const isUncompressedFormat = Module.formatIsUncompressed(format);

	const blockWidth = isUncompressedFormat ? 1 : 4, blockHeight = isUncompressedFormat ? 1 : 4;

	const bytesPerBlockOrPixel = Module.getBytesPerBlockOrPixel(format);
	log('isUncompressedFormat: ' + isUncompressedFormat + ' bytesPerBlockOrPixel: ' + bytesPerBlockOrPixel);

	const dstSize = basisFile.getImageTranscodedSizeInBytes(0, 0, format);
	const dst = new Uint8Array(dstSize);

//  log('getImageTranscodedSizeInBytes() returned ' + dstSize);

	// Use the low or high level transcoding API's. The high level API's require .basis files, while the low-level API's just work off blobs of memory and parameters.
	if (elem('ContainerIndependentTranscoding').checked)
	{
		// Always transcode the first image and the first mipmap level
		const image_index = 0;
		const level_index = 0;

		// Get the .basis file description
		var basisFileDesc = basisFile.getFileDesc();

		// Get the description of the file's first image (there could be multiple images, for texture arrays or videos)
		var basisImageDesc = basisFile.getImageDesc(image_index);

		// Get the description of this image's mipmap level
		var basisImageLevelDesc = basisFile.getImageLevelDesc(image_index, level_index);

		var status = false;

		// If we're transcoding to ETC1S, use the LowLevelETC1SImageTranscoder class. Otherwise use the transcodeUASTCImage() function.
		if (basisFileDesc.texFormat == Module.basis_tex_format.cETC1S.value)
		{
			// Create an instance of the LowLevelETC1SImageTranscoder class.
			const etc1s_transcoder = new Module.LowLevelETC1SImageTranscoder();

			// Create Uint8Array's pointing into the various bits of the .basis file holding the compressed data for the codebooks and the Huffman tables.
			var selectorPalette = new Uint8Array(data, basisFileDesc.selectorPaletteOfs, basisFileDesc.selectorPaletteLen);
			var endpointPalette = new Uint8Array(data, basisFileDesc.endpointPaletteOfs, basisFileDesc.endpointPaletteLen);
			var tables = new Uint8Array(data, basisFileDesc.tablesOfs, basisFileDesc.tablesLen);

			// Create a Uint8Array pointing to the image's compressed data.
			// If it's an opaque .basis file, there will only be RGB data. For transparant .basis files, each RGB slice will be immediately followed by an alpha slice.
			// Compressed ETC1S alpha data is guaranteed to immediately follow the RGB data (it's always at odd slices in the .basis file).
			var compData = new Uint8Array(data, basisImageLevelDesc.rgbFileOfs, basisImageLevelDesc.rgbFileLen + basisImageLevelDesc.alphaFileLen);

			// Decompress the palettes. This only has to be done once for each .basis file.
			var status = etc1s_transcoder.decodePalettes(basisFileDesc.numEndpoints, endpointPalette, basisFileDesc.numSelectors, selectorPalette);
			if (status)
			{
				// Decompress the Huffman tables. This only has to be done once for each .basis file.
				status = etc1s_transcoder.decodeTables(tables);
				if (status)
				{
					// Now transcode the image using the container independent transcode API. This API does not interpret any .basis file structures - only the compressed ETC1S data.
					status = etc1s_transcoder.transcodeImage(
						format,
						dst, dstSize / bytesPerBlockOrPixel,
						compData,
						basisImageDesc.numBlocksX, basisImageDesc.numBlocksY, basisImageDesc.origWidth, basisImageDesc.origHeight, level_index,
						0, basisImageLevelDesc.rgbFileLen, basisFileDesc.hasAlphaSlices ? basisImageLevelDesc.rgbFileLen : 0, basisImageLevelDesc.alphaFileLen,
						0,
						basisFileDesc.hasAlphaSlices,
						basisFileDesc.isVideo,
						0,
						0);

					if (!status)
						log('transcodeImage() failed');
				}
				else
				{
					log('decodeTables() failed');
				}
			}
			else
			{
				log('decodePalettes() failed');
			}

			etc1s_transcoder.delete();

			if (!status)
			{
				log('etc1s_transcoder failed');
				console.warn('etc1s_transcoder failed');
				basisFile.close();
				basisFile.delete();
				return;
			}
			else
			{
				log('Successfully called etc1s_transcoder.transcodeImage()');
			}
		}
		else
		{
			// Create a Uint8Array pointing to the image's compressed data.
			var compData = new Uint8Array(data, basisImageLevelDesc.rgbFileOfs, basisImageLevelDesc.rgbFileLen);

			// Transcode the UASTC texture data to the desired output format.
			status = Module.transcodeUASTCImage(
				format,
				dst, dstSize / bytesPerBlockOrPixel,
				compData,
				basisImageDesc.numBlocksX, basisImageDesc.numBlocksY, basisImageDesc.origWidth, basisImageDesc.origHeight, level_index,
				0, basisImageLevelDesc.rgbFileLen,
				0,
				basisFileDesc.hasAlphaSlices,
				basisFileDesc.isVideo,
				0,
				0,
				-1, -1);

			if (!status)
			{
				log('transcodeUASTCImage() failed');
				console.warn('transcodeUASTCImage() failed');
				basisFile.close();
				basisFile.delete();
				return;
			}
			else
			{
				log('Successfully called transcodeUASTCImage()');
			}
		}
	}
	else
	{
		// Use the high-level transcode API, which requires a .basis file.
		if (!basisFile.transcodeImage(dst, 0, 0, format, 0, 0)) {
			console.log('basisFile.transcodeImage failed');
			console.warn('transcodeImage failed');
			basisFile.close();
			basisFile.delete();

			return;
		}
	}

	const elapsed = performance.now() - startTime;

	basisFile.close();
	basisFile.delete();

	log('width: ' + width);
	log('height: ' + height);
	log('images: ' + images);
	log('first image mipmap levels: ' + levels);
	log('has_alpha: ' + has_alpha);
	logTime('transcoding time', elapsed.toFixed(2));

	alignedWidth = (width + 3) & ~3;
	alignedHeight = (height + 3) & ~3;

	displayWidth = alignedWidth;
	displayHeight = alignedHeight;

	var canvas = elem('canvas');
	canvas.width = alignedWidth;
	canvas.height = alignedHeight;

	if (format === BASIS_FORMAT.cTFASTC_4x4)
	{
		tex = renderer.createCompressedTexture(dst, alignedWidth, alignedHeight, COMPRESSED_RGBA_ASTC_4x4_KHR);
	}
	else if ((format === BASIS_FORMAT.cTFBC3) || (format === BASIS_FORMAT.cTFBC1) || (format == BASIS_FORMAT.cTFBC7))
	{
		tex = renderer.createCompressedTexture(dst, alignedWidth, alignedHeight, DXT_FORMAT_MAP[format]);
	}
	else if (format === BASIS_FORMAT.cTFETC1)
	{
		tex = renderer.createCompressedTexture(dst, alignedWidth, alignedHeight, COMPRESSED_RGB_ETC1_WEBGL);
	}
	else if (format === BASIS_FORMAT.cTFPVRTC1_4_RGB)
	{
		tex = renderer.createCompressedTexture(dst, alignedWidth, alignedHeight, COMPRESSED_RGB_PVRTC_4BPPV1_IMG);
	}
	else if (format === BASIS_FORMAT.cTFPVRTC1_4_RGBA)
	{
		tex = renderer.createCompressedTexture(dst, alignedWidth, alignedHeight, COMPRESSED_RGBA_PVRTC_4BPPV1_IMG);
	}
	else
	{
		canvas.width = width;
		canvas.height = height;
		displayWidth = width;
		displayHeight = height;

		// Create 565 texture.
		var dstTex = new Uint16Array(width * height);

		// Convert the array of bytes to an array of uint16's.
		var pix = 0;
		for (var y = 0; y < height; y++)
			for (var x = 0; x < width; x++, pix++)
				dstTex[pix] = dst[2 * pix + 0] | (dst[2 * pix + 1] << 8);

		tex = renderer.createRgb565Texture(dstTex, width, height);
	}

	redraw();
}