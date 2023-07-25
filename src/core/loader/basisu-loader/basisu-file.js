/**
 * JSON5 File loader plugin.
 *
 * @module components/loader/JSON5File.js
 * @copyright BBC 2019
 * @author BBC Children's D+E
 * @license Apache-2.0
 */
import "./basis_loader.js";

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

		const basisLoader = new BasisLoader();	//TODO NT initialising this causes a missed file load url.
		// let gl = this.loader.scene.renderer.gl;
		// basisLoader.setWebGLContext(gl);

		const doIt = () => {
			console.log(basisLoader);
			debugger;
		};

		basisLoader.loadFromUrl(this.src).then(result => {
			debugger;
			// WebGL color+alpha texture;
			result.texture;

			// WebGL alpha texture, only if basisLoader.allowSeparateAlpha is true.
			// null if alpha is encoded in result.texture or result.alpha is false.
			result.alphaTexture;

			// True if the texture contained an alpha channel.
			result.alpha;

			// Number of mip levels in texture/alphaTexture
			result.mipLevels;

			// Dimensions of the base mip level.
			result.width;
			result.height;
		});

		console.log(this.data);

		this.onProcessComplete();
	}
}
