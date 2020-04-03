/**
 * Particles File loader plugin.
 *
 * @module components/loader/JSON5File.js
 * @copyright BBC 2019
 * @author BBC Children's D+E
 * @license Apache-2.0
 */

export class ParticlesFile extends Phaser.Loader.File {
    constructor(loader, fileConfig, xhrSettings, dataKey) {
        super(loader, Object.assign(fileConfig, { type: "particles" }));

        const particlesDefaults = {
            cache: loader.cacheManager.json,
            extension: "json",
            responseType: "text",
            xhrSettings: xhrSettings,
            config: dataKey,
        };

        Object.assign(fileConfig, particlesDefaults);

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
        this.data = JSON.parse(this.xhrLoader.responseText);

        //TODO parse geom here

        this.onProcessComplete();
    }
}
