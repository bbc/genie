/**
 * JSON5LoaderPlugin loads JSON5 files using the Phaser.Loader
 *
 * @module components/loader/font-loader/font-plugin
 * @copyright BBC 2019
 * @author BBC Children's D+E
 * @license Apache-2.0
 */
import { JSON5File } from "./json5-file.js";

export class JSON5Plugin extends Phaser.Plugins.BasePlugin {
	constructor(pluginManager) {
		super(pluginManager);
		pluginManager.registerFileType("json5", this.loaderCallback);
	}

	addToScene(scene) {
		scene.sys.load["json5"] = this.loaderCallback;
	}

	loaderCallback(fileConfig, xhrSettings, dataKey) {
		this.addFile(new JSON5File(this, fileConfig, xhrSettings, dataKey));
	}
}
