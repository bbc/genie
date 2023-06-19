/**
 * JSON5LoaderPlugin loads JSON5 files using the Phaser.Loader
 *
 * @module components/loader/font-loader/font-plugin
 * @copyright BBC 2019
 * @author BBC Children's D+E
 * @license Apache-2.0
 */
import { GltexFile } from "./gltex-file.js";

export class GltexPlugin extends Phaser.Plugins.BasePlugin {
    constructor(pluginManager) {
        super(pluginManager);
        pluginManager.registerFileType("gltex", this.loaderCallback);
    }

    addToScene(scene) {
        scene.sys.load["gltex"] = this.loaderCallback;
    }

    loaderCallback(fileConfig, xhrSettings, dataKey) {
        this.addFile(new GltexFile(this, fileConfig, xhrSettings, dataKey));
    }
}
