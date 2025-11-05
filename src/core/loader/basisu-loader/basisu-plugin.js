/**
 * Basis U plugin loads .basiu files and transcoded them to the correct webgl texture format
 *
 * @module components/loader/basisu-loader/basisu-plugin
 * @copyright BBC 2023
 * @author BBC Children's D+E
 * @license Apache-2.0
 */
import { BasisUFile } from "./basisu-file.js";

export class BasisUPlugin extends Phaser.Plugins.BasePlugin {
	constructor(pluginManager) {
		super(pluginManager);
		pluginManager.registerFileType("basisu", this.loaderCallback);
	}

	addToScene(scene) {
		scene.sys.load["basisu"] = this.loaderCallback;
	}

	loaderCallback(fileConfig, xhrSettings, dataKey) {
		this.addFile(new BasisUFile(this, fileConfig, xhrSettings, dataKey));
	}
}
