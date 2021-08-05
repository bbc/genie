/**
 * JSON5LoaderPlugin loads JSON5 files using the Phaser.Loader
 *
 * @module components/loader/font-loader/font-plugin
 * @copyright BBC 2019
 * @author BBC Children's D+E
 * @license Apache-2.0
 */
import { ParticlesFile } from "./particles-file.js";

export class ParticlesPlugin extends Phaser.Plugins.BasePlugin {
	constructor(pluginManager) {
		super(pluginManager);
		pluginManager.registerFileType("particles", this.loaderCallback);
	}

	addToScene(scene) {
		scene.sys.load["particles"] = this.loaderCallback;
	}

	loaderCallback(fileConfig, xhrSettings, dataKey) {
		this.addFile(new ParticlesFile(this, fileConfig, xhrSettings, dataKey));
	}
}
