/**
 * @copyright BBC 2020
 * @author BBC Children's D+E
 * @license Apache-2.0
 */
import FontLoaderPlugin from "../font-loader/font-plugin.js";
import { JSON5Plugin } from "../json5-loader/json5-plugin.js";
import { ParticlesPlugin } from "../particles-loader/particles-plugin.js";
import BBCodeTextPlugin from "../../../../lib/rexbbcodetextplugin.min.js";
import "../../../../lib/SpinePlugin.min.js";
//import "/node_modules/phaser/plugins/spine/dist/SpinePlugin.min.js"; //TODO re-enable once relative paths work (not working asof Phaser 3.52.0)

export const getDefaultPlugins = options => {
    const defaultPlugins = {
        global: [
            {
                key: "FontLoader",
                plugin: FontLoaderPlugin,
                start: true,
            },
            {
                key: "JSON5Loader",
                plugin: JSON5Plugin,
                start: true,
            },
            {
                key: "ParticlesLoader",
                plugin: ParticlesPlugin,
                start: true,
            },
            {
                key: "rexBBCodeTextPlugin",
                plugin: BBCodeTextPlugin,
                start: true,
            },
        ],
        scene: [
            {
                key: "SpinePlugin",
                plugin: window.SpinePlugin,
                mapping: "spine",
            },
        ],
    };

    return {
        global: [...defaultPlugins.global, ...(options?.plugins?.global ?? [])],
        scene: [...defaultPlugins.scene, ...(options?.plugins?.scene ?? [])],
    };
};
