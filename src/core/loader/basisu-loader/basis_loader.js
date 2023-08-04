/*
 * Basis Loader
 *
 * Usage:
 * // basis_loader.js should be loaded from the same directory as
 * // basis_transcoder.js and basis_transcoder.wasm
 *
 * // Create the texture loader and set the WebGL context it should use. Spawns
 * // a worker which handles all of the transcoding.
 * let basisLoader = new BasisLoader();
 * basisLoader.setWebGLContext(gl);
 *
 * // To allow separate color and alpha textures to be returned in cases where
 * // it would provide higher quality:
 * basisLoader.allowSeparateAlpha = true;
 *
 * // loadFromUrl() returns a promise which resolves to a completed WebGL
 * // texture or rejects if there's an error loading.
 * basisLoader.loadFromUrl(fullPathToTexture).then((result) => {
 *   // WebGL color+alpha texture;
 *   result.texture;
 *
 *   // WebGL alpha texture, only if basisLoader.allowSeparateAlpha is true.
 *   // null if alpha is encoded in result.texture or result.alpha is false.
 *   result.alphaTexture;
 *
 *   // True if the texture contained an alpha channel.
 *   result.alpha;
 *
 *   // Number of mip levels in texture/alphaTexture
 *   result.mipLevels;
 *
 *   // Dimensions of the base mip level.
 *   result.width;
 *   result.height;
 * });
 */

//TODO this is incorrect due to ES6 import rather than being added as a script tag
const SCRIPT_PATH =
	typeof document !== "undefined" && document.currentScript ? document.currentScript.src : import.meta.url;
//console.log(import.meta.url)

const SCRIPT_PATH_PARTS = SCRIPT_PATH.split("/");
SCRIPT_PATH_PARTS.pop();

const SCRIPT_FOLDER = SCRIPT_PATH_PARTS.join("/");

console.log("SCRIPT_FOLDER", SCRIPT_FOLDER);

import { PendingTextureRequest } from "./pending-texture-request.js";

//
// Main Thread
//

class BasisLoader {
	constructor() {
		this.gl = null;
		this.supportedFormats = {};
		this.pendingTextures = {};
		this.nextPendingTextureId = 1;
		this.allowSeparateAlpha = false;

		// Reload the current script as a worker
		this.worker = new Worker(`${SCRIPT_FOLDER}/worker.js`, { type: "module" });
		this.worker.onmessage = msg => {
			console.log("IN WORKER MESSAGE RECEIVED");
			// Find the pending texture associated with the data we just received
			// from the worker.
			let pendingTexture = this.pendingTextures[msg.data.id];
			if (!pendingTexture) {
				if (msg.data.error) {
					console.error(`Basis transcode failed: ${msg.data.error}`);
				}
				console.error(`Invalid pending texture ID: ${msg.data.id}`);
				return;
			}

			// Remove the pending texture from the waiting list.
			delete this.pendingTextures[msg.data.id];

			// If the worker indicated an error has occured handle it now.
			if (msg.data.error) {
				console.error(`Basis transcode failed: ${msg.data.error}`);
				pendingTexture.reject(`${msg.data.error}`);
				return;
			}

			// Upload the image data returned by the worker.
			pendingTexture.texture = pendingTexture.uploadImageData(
				msg.data.webglFormat,
				msg.data.buffer,
				msg.data.mipLevels,
			);

			if (msg.data.alphaBuffer) {
				pendingTexture.alphaTexture = pendingTexture.uploadImageData(
					msg.data.webglFormat,
					msg.data.alphaBuffer,
					msg.data.mipLevels,
				);
			}

			pendingTexture.resolve({
				mipLevels: msg.data.mipLevels.length,
				width: msg.data.mipLevels[0].width,
				height: msg.data.mipLevels[0].height,
				alpha: msg.data.hasAlpha,
				texture: pendingTexture.texture,
				alphaTexture: pendingTexture.alphaTexture,
			});
		};
	}

	setWebGLContext(gl) {
		if (this.gl != gl) {
			this.gl = gl;
			if (gl) {
				this.supportedFormats = {
					s3tc: !!gl.getExtension("WEBGL_compressed_texture_s3tc"),
					etc1: !!gl.getExtension("WEBGL_compressed_texture_etc1"),
					etc2: !!gl.getExtension("WEBGL_compressed_texture_etc"),
					pvrtc: !!gl.getExtension("WEBGL_compressed_texture_pvrtc"),
					astc: !!gl.getExtension("WEBGL_compressed_texture_astc"),
					bptc: !!gl.getExtension("EXT_texture_compression_bptc"),
				};
			} else {
				this.supportedFormats = {};
			}
		}
	}

	// This method changes the active texture unit's TEXTURE_2D binding
	// immediately prior to resolving the returned promise.
	loadFromUrl(url) {
		let pendingTexture = new PendingTextureRequest(this.gl, url);
		this.pendingTextures[this.nextPendingTextureId] = pendingTexture;

		this.worker.postMessage({
			id: this.nextPendingTextureId,
			url: url,
			allowSeparateAlpha: this.allowSeparateAlpha,
			supportedFormats: this.supportedFormats,
		});

		this.nextPendingTextureId++;
		return pendingTexture.promise;
	}
}

window.BasisLoader = BasisLoader;
