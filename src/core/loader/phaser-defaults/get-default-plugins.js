/**
 * @copyright BBC 2020
 * @author BBC Children's D+E
 * @license Apache-2.0
 */
import FontLoaderPlugin from "../font-loader/font-plugin.js";
import { JSON5Plugin } from "../json5-loader/json5-plugin.js";
import { ParticlesPlugin } from "../particles-loader/particles-plugin.js";

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
        ],
        scene: [
            {
                key: "SpinePlugin",
                plugin: window.SpinePlugin,
                mapping: "spine",
            },
            {
                key: "rexUI",
                plugin: window.rexuiplugin, 
                mapping: "rexUI",
            },
        ],
    };

    return {
        global: [...defaultPlugins.global, ...(options?.plugins?.global ?? [])],
        scene: [...defaultPlugins.scene, ...(options?.plugins?.scene ?? [])],
    };
};
