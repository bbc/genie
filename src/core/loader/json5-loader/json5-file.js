/**
 * JSON5 File loader plugin.
 *
 * @module components/loader/JSON5File.js
 * @copyright BBC 2019
 * @author BBC Children's D+E
 * @license Apache-2.0
 */
import JSON5 from "/node_modules/json5/dist/index.mjs";

export class JSON5File extends Phaser.Loader.File {
	constructor(loader, fileConfig, xhrSettings, dataKey) {
		super(loader, Object.assign(fileConfig, { type: "json5" }));

		const json5Defaults = {
			cache: loader.cacheManager.json,
			extension: "json5",
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
		this.data = JSON5.parse(this.xhrLoader.responseText);

		this.onProcessComplete();
	}
}
