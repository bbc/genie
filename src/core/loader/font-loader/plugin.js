/**
 * FontLoaderPlugin loads web fonts using the Phaser.Loader
 *
 * @module components/loader/font-loader/plugin
 * @copyright BBC 2019
 * @author BBC Children's D+E
 * @license Apache-2.0
 */
class FontLoaderPlugin extends Phaser.Plugins.BasePlugin {
    constructor(pluginManager: Phaser.Plugins.PluginManager) {
        super(pluginManager);
        pluginManager.registerFileType("webfont", fontLoaderCallback);
    }

    addToScene(scene) {
        scene.sys.load["webfont"] = fontLoaderCallback;
    }

    fontLoaderCallback() {}
}

export default FontLoaderPlugin;
