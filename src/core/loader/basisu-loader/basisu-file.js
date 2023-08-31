/**
 * @copyright BBC 2023
 * @author BBC Children's D+E
 * @license Apache-2.0
 */
import { BasisLoader } from "./basis-loader.js";

const onComplete = file => result => {
	file.loader.scene.textures.addGLTexture(file.key, result.texture, result.width, result.height);
	file.onProcessComplete();
};

export class BasisUFile extends Phaser.Loader.File {
	constructor(loader, fileConfig, xhrSettings, config) {
		super(loader, Object.assign(fileConfig, { type: "basisu" }));

		const basisuDefaults = {
			extension: "basis",
			responseType: "blob",
			xhrSettings,
			config,
		};

		Object.assign(fileConfig, basisuDefaults);

		Phaser.Loader.File.call(this, loader, fileConfig);
	}

	onProcess() {
		const basisLoader = new BasisLoader(this.loader.scene.renderer.gl);

		//TODO wouldn't have to do this if this wasn't a class
		const transcodeBuffer = basisLoader.transcodeBuffer.bind(basisLoader);

		return this.xhrLoader.response.arrayBuffer().then(transcodeBuffer).then(onComplete(this));
	}
}
