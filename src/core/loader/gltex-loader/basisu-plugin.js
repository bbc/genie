/**
 * JSON5LoaderPlugin loads JSON5 files using the Phaser.Loader
 *
 * @module components/loader/font-loader/font-plugin
 * @copyright BBC 2019
 * @author BBC Children's D+E
 * @license Apache-2.0
 */
import { BasisUFile } from "./basisu-file.js";

function basisInit() {
	console.log("basisInit", timeLeft());
	const check = BasisLoader.loadTranscoder(
		`./basis_transcoder.js`,
		`./basis_transcoder.wasm`
	);
	check.then(function () {
		console.log(
			"%c BasisLoader, promise solved " + timeLeft(),
			"background: #222; color: #bada55; padding: 0.3rem"
		);
		initPixi();
		eruda.init();
	});
}

/**
 * Loads the transcoder source code for use in {@link PIXI.BasisLoader.TranscoderWorker}.
 * @private
 * @param jsURL - URL to the javascript basis transcoder
 * @param wasmURL - URL to the wasm basis transcoder
 */
BasisLoader.loadTranscoder = function (jsURL, wasmURL) {
	return BasisLoader.TranscoderWorker.loadTranscoder(jsURL, wasmURL);
};



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
