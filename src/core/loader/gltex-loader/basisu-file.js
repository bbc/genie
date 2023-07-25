/**
 * JSON5 File loader plugin.
 *
 * @module components/loader/JSON5File.js
 * @copyright BBC 2019
 * @author BBC Children's D+E
 * @license Apache-2.0
 */
//import { BasisTextureLoader } from "./basis-texture-loader.js";	//THis is the PIXI file
//import JSON5 from "/node_modules/json5/dist/index.mjs";
//import { BASIS } from "./basis_transcoder.js"
import { BasisLoader } from "./basis-loader.js";

let time = {};
time.start = new Date().getTime();

const timeLeft = () => "| time >> " + (new Date().getTime() - time.start) + "ms"

const transcoderPath = "http://127.0.0.1:9000/src/core/loader/gltex-loader/"

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


        //const loader = new BasisTextureLoader();

		/*
			basisu-file.js: Phaser plugin setup file
			basisu-plugin.js: Forget how this works. Phaser specific file that aids in setting up the format as a plugin?
			basis-loader.js:
			basis-texture-loader.js:
			basis-transcoder.js: file processor. Sideloaded on init of plugin in basisu-file.js
			basis-transcoder.wasm: The web assembly part of the processor. Sideloaded on init of plugin in basisu-file.js
		 */


		//debugger
		//this.data = JSON5.parse(this.xhrLoader.responseText);	//Think this is the image data actually.

		// image data = this.xhrLoader.response


		let basisLoader = new BasisLoader()
		let gl = this.loader.scene.renderer.gl
		basisLoader.setWebGLContext(gl)

	 // To allow separate color and alpha textures to be returned in cases where
	 // it would provide higher quality:
	 //basisLoader.allowSeparateAlpha = true;

		//basis-loader is the off the shelf file
		//basis



		//TODO parse the data here:
		//basisLoader.loadFromUrl()

		basisLoader.TranscoderWorker.loadTranscoder(`${transcoderPath}basis_transcoder.js`, `${transcoderPath}basis_transcoder.wasm`).then(() => {
			console.log("%c BasisLoader, promise solved");
			debugger
			//initPixi();
			//eruda.init();
		});

		// THIS >>> loader.DOSOMETHING!
				debugger

		console.log(this.data)

        this.onProcessComplete();
    }
}
