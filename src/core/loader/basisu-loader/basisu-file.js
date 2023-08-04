/**
 * JSON5 File loader plugin.
 *
 * @module components/loader/JSON5File.js
 * @copyright BBC 2019
 * @author BBC Children's D+E
 * @license Apache-2.0
 */
import "./basis_loader.js";
//import { BasisLoader } from "./basis-loader.js";

const transcoderPath = "http://127.0.0.1:9000/src/core/loader/basis-loader/";


export class BasisUFile extends Phaser.Loader.File {
	constructor(loader, fileConfig, xhrSettings, dataKey) {
		super(loader, Object.assign(fileConfig, { type: "basisu" }));

		const json5Defaults = {
			cache: loader.cacheManager.json,
			extension: "basis",
			responseType: "text",
			xhrSettings: xhrSettings,
			config: dataKey,
		};

		Object.assign(fileConfig, json5Defaults);

		Phaser.Loader.File.call(this, loader, fileConfig);
	}

	/**
	 * Called automatically by Loader.nextFile.
	 * This method controls what extra work this File does with its loaded data.
	 *
	 * @method Phaser.Loader.FileTypes.JSONFile#onProcess
	 * @since 3.7.0
	 */
	onProcess() {
		const data = this.data;

		const basisLoader = new BasisLoader();
		let gl = this.loader.scene.renderer.gl;
		basisLoader.setWebGLContext(gl);

		const file = this

		basisLoader.loadFromUrl(this.src).then(result => {
			// WebGL color+alpha texture;
			// result.texture;
			//
			// // WebGL alpha texture, only if basisLoader.allowSeparateAlpha is true.
			// // null if alpha is encoded in result.texture or result.alpha is false.
			// result.alphaTexture;
			//
			// // True if the texture contained an alpha channel.
			// result.alpha;
			//
			// // Number of mip levels in texture/alphaTexture
			// result.mipLevels;
			//
			// // Dimensions of the base mip level.
			// result.width;
			// result.height;

			// var image = new Phaser.Loader.FileTypes.BinaryFile(file.loader, file.key, file.src., file.xhrSettings);
			// file.loader.addFile(image);

			/**
			 * An object containing the dimensions and mipmap data for a Compressed Texture.
			 *
			 * @typedef {object} Phaser.Types.Textures.CompressedTextureData
			 * @since 3.60.0
			 *
			 * @property {boolean} compressed - Is this a compressed texture?
			 * @property {boolean} generateMipmap - Should this texture have mipmaps generated?
			 * @property {number} width - The width of the maximum size of the texture.
			 * @property {number} height - The height of the maximum size of the texture.
			 * @property {GLenum} internalFormat - The WebGL internal texture format.
			 * @property {Phaser.Types.Textures.MipmapType[]} mipmaps - An array of MipmapType objects.
			 */

			/**
			 * A Mipmap Data entry for a Compressed Texture.
			 *
			 * @typedef {object} Phaser.Types.Textures.MipmapType
			 * @since 3.60.0
			 *
			 * @property {number} width - The width of this level of the mipmap.
			 * @property {number} height - The height of this level of the mipmap.
			 * @property {Uint8Array} data - The decoded pixel data.
			 */


			const compressedTexture = {
				compressed: true,
				generateMipmap: false,
				width: result.width,
				height: result.height,
				internalFormat: gl.BYTE, //The data type of the attribute. Either `gl.BYTE`, `gl.SHORT`, `gl.UNSIGNED_BYTE`, `gl.UNSIGNED_SHORT` or `gl.FLOAT`.
				mipmaps: [{
					width: result.width,
					height: result.height,
					data: result.texture //TODO this might need to be a Uint8Array
				}],
			}

			//debugger

			//file.loader.textureManager.addCompressedTexture(file.key, compressedTexture, null);
			//file.loader.textureManager.addImage(file.key, result.texture)


			file.loader.scene.textures.addGLTexture(file.key, result.texture, result.width, result.height);


			window.tm = file.loader.textureManager;
			this.onProcessComplete();
		});

		//console.log(this.data);


	}
}
