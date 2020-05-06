/**
 * @copyright BBC 2020
 * @author BBC Children's D+E
 * @license Apache-2.0
 */
import { CANVAS_HEIGHT, CANVAS_WIDTH } from "../layout/metrics.js";
import FontLoaderPlugin from "./font-loader/font-plugin.js";
import { JSON5Plugin } from "./json5-loader/json5-plugin.js";
import { ParticlesPlugin } from "./particles-loader/particles-plugin.js";
import { getLauncherScreen } from "../debug/debug-screens.js";
import * as debugMode from "../debug/debug-mode.js";
import { Loader } from "./loader.js";
import { Boot } from "./boot.js";
import { getBrowser } from "../browser.js";
import { getContainerDiv } from "./container.js";

const getScenes = conf => Object.keys(conf).map(key => new conf[key].scene({ key, ...conf[key].settings }));

export const getPhaserDefaults = config => {
    const browser = getBrowser();
    const scene = getScenes(Object.assign(config.screens, getLauncherScreen(debugMode.isDebug())));
    scene.unshift(new Loader());
    scene.unshift(new Boot(config.screens));

    return {
        ...{
            width: CANVAS_WIDTH,
            height: CANVAS_HEIGHT,
            type: browser.forceCanvas ? Phaser.CANVAS : Phaser.AUTO,
            antialias: true,
            multiTexture: true,
            parent: getContainerDiv(),
            banner: true,
            title: "BBC Games Genie",
            version: __GENIE__.version, //TODO add game name / build version possible?
            transparent: browser.isSilk, // Fixes silk browser flickering
            clearBeforeRender: false,
            scale: {
                mode: Phaser.Scale.NONE,
            },
            input: {
                windowEvents: false,
            },
            scene,
            plugins: {
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
                ],
            },
        },
        ...config.gameOptions,
    };
};
