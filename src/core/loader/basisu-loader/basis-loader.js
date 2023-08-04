import { PendingTextureRequest } from "./pending-texture-request.js";

const SCRIPT_PATH =
	typeof document !== "undefined" && document.currentScript ? document.currentScript.src : import.meta.url;

//TODO this isn't used yet...

export class BasisLoader {
	constructor() {
		this.gl = null;
		this.supportedFormats = {};
		this.pendingTextures = {};
		this.nextPendingTextureId = 1;
		this.allowSeparateAlpha = false;

		// Reload the current script as a worker
		this.worker = new Worker(SCRIPT_PATH, { type: "module" });
		this.worker.onmessage = msg => {
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