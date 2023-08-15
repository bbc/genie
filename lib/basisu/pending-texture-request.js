export class PendingTextureRequest {
	constructor(gl) {
		this.gl = gl;
		this.texture = null;
		this.alphaTexture = null;
		this.promise = new Promise((resolve, reject) => {
			this.resolve = resolve;
			this.reject = reject;
		});
	}

	uploadImageData(webglFormat, buffer, mipLevels) {
		let gl = this.gl;
		let texture = gl.createTexture();
		gl.bindTexture(gl.TEXTURE_2D, texture);
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
		gl.texParameteri(
			gl.TEXTURE_2D,
			gl.TEXTURE_MIN_FILTER,
			mipLevels.length > 1 || webglFormat.uncompressed ? gl.LINEAR_MIPMAP_LINEAR : gl.LINEAR,
		);

		let levelData = null;

		for (let mipLevel of mipLevels) {
			if (!webglFormat.uncompressed) {
				levelData = new Uint8Array(buffer, mipLevel.offset, mipLevel.size);
				gl.compressedTexImage2D(
					gl.TEXTURE_2D,
					mipLevel.level,
					webglFormat.format,
					mipLevel.width,
					mipLevel.height,
					0,
					levelData,
				);
			} else {
				switch (webglFormat.type) {
					case WebGLRenderingContext.UNSIGNED_SHORT_4_4_4_4:
					case WebGLRenderingContext.UNSIGNED_SHORT_5_5_5_1:
					case WebGLRenderingContext.UNSIGNED_SHORT_5_6_5:
						levelData = new Uint16Array(buffer, mipLevel.offset, mipLevel.size / 2);
						break;
					default:
						levelData = new Uint8Array(buffer, mipLevel.offset, mipLevel.size);
						break;
				}
				gl.texImage2D(
					gl.TEXTURE_2D,
					mipLevel.level,
					webglFormat.format,
					mipLevel.width,
					mipLevel.height,
					0,
					webglFormat.format,
					webglFormat.type,
					levelData,
				);
			}
		}

		if (webglFormat.uncompressed && mipLevels.length == 1) {
			gl.generateMipmap(gl.TEXTURE_2D);
		}

		return texture;
	}
}