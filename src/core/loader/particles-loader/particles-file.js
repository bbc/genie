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

    createPhaserGeomObject(obj) {
        const geometryObject = {
            rectangle: Phaser.Geom.Rectangle,
            circle: Phaser.Geom.Circle,
            ellipse: Phaser.Geom.Ellipse,
            line: Phaser.Geom.Line,
            point: Phaser.Geom.Point,
            polygon: Phaser.Geom.Polygon,
            triangle: Phaser.Geom.Triangle,
        };
        if (!geometryObject[obj.type]) {
            throw `Incorrect geometry object type provided: ${[obj.type]}`;
        }
        return new geometryObject[obj.type]({ ...obj.properties });
    }

    traverse(obj) {
        Object.keys(obj).forEach(key => {
            if (typeof obj[key] === "object") {
                if (obj[key].phaserGeom && obj[key].phaserGeom === true) {
                    obj[key] = this.createPhaserGeomObject(obj[key]);
                } else {
                    this.traverse(obj[key]);
                }
            }
        });
    }

    onProcess() {
        const data = JSON.parse(this.xhrLoader.responseText);
        this.data = this.traverse(data);
        this.onProcessComplete();
    }
}
