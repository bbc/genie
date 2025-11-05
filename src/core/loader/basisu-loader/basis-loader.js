/**
 * @copyright BBC 2023
 * @author BBC Children's D+E
 * @license Apache-2.0
 */
import { PendingTextureRequest } from "../../../../lib/basisu/pending-texture-request.js";
import { gmi } from "../../gmi/gmi.js";

export class BasisLoader {
	constructor(gl) {
		this.setWebGLContext(gl);
		this.pendingTextures = {};
		this.nextPendingTextureId = 1;
		this.allowSeparateAlpha = false;

		// Load worker script
		this.worker = new Worker(`${gmi.info.gameDir}lib/basisu/worker.js`, { type: "module" });
		this.worker.onmessage = msg => {
			// Find the pending texture associated with the data we just received
			// from the worker.
			let pendingTexture = this.pendingTextures[msg.data.id];
			if (!pendingTexture) {
				if (msg.data.error) {
					console.error(`Basis transcode failed: ${msg.data.error}`); // eslint-disable-line
				}
				console.error(`Invalid pending texture ID: ${msg.data.id}`); // eslint-disable-line
				return;
			}

			// Remove the pending texture from the waiting list.
			delete this.pendingTextures[msg.data.id];

			// If the worker indicated an error has occured handle it now.
			if (msg.data.error) {
				console.error(`Basis transcode failed: ${msg.data.error}`); // eslint-disable-line
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

	transcodeBuffer(buffer) {
		let pendingTexture = new PendingTextureRequest(this.gl);
		this.pendingTextures[this.nextPendingTextureId] = pendingTexture;

		this.worker.postMessage({
			id: this.nextPendingTextureId,
			buffer,
			allowSeparateAlpha: this.allowSeparateAlpha,
			supportedFormats: this.supportedFormats,
		});

		this.nextPendingTextureId++;
		return pendingTexture.promise;
	}
}
