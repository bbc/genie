/**
 * JSON5 File loader plugin.
 *
 * @module components/loader/JSON5File.js
 * @copyright BBC 2019
 * @author BBC Children's D+E
 * @license Apache-2.0
 */
import { BasisLoader } from "./basis-loader.js";

export class BasisUFile extends Phaser.Loader.File {
	constructor(loader, fileConfig, xhrSettings, dataKey) {
		super(loader, Object.assign(fileConfig, { type: "basisu" }));

		const basisuDefaults = {
			extension: "basis",
			responseType: "blob",
			xhrSettings,
			config: dataKey,
		};

		Object.assign(fileConfig, basisuDefaults);

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
		const basisLoader = new BasisLoader();
		let gl = this.loader.scene.renderer.gl;
		basisLoader.setWebGLContext(gl);

		const textures = this.loader.scene.textures

		this.xhrLoader.response.arrayBuffer().then(buffer => {
			basisLoader.transcodeBuffer(buffer).then(result => {
				textures.addGLTexture(this.key, result.texture, result.width, result.height);
				this.onProcessComplete();
			});
		})
	}
}
