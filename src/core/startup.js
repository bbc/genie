/**
 * Startup extends `Phaser.State` and creates a new `Phaser.Game`, as well as a new `Navigation` object.
 * It also instantiates the `Context` object.
 *
 * @module core/startup
 * @copyright BBC 2018
 * @author BBC Children's D+E
 * @license Apache-2.0 Apache-2.0
 */
import { gmi, setGmi } from "./gmi/gmi.js";
import { addCustomStyles } from "./custom-styles.js";
import * as qaMode from "./qa/qa-mode.js";
import { getBrowser } from "./browser.js";
import { Loader } from "./loader/loader.js";
import { Boot } from "./loader/boot.js";
import { hookErrors } from "./loader/hook-errors.js";
import FontLoaderPlugin from "./loader/font-loader/font-plugin.js";
import { JSON5Plugin } from "./loader/json5-loader/json5-plugin.js";
import * as a11y from "./accessibility/accessibility-layer.js";
//import "/node_modules/phaser/plugins/spine/dist/SpineWebGLPlugin.js";   //TODO Re-enable if we can get our PR merged. NT:06:12:19
import "/lib/SpinePlugin.js";

export const getScenes = conf => Object.keys(conf).map(key => new conf[key].scene({ key, ...conf[key].settings }));

/**
 * @param {Object=} settingsConfig - Additional state that is added to the inState context.
 * @param {Object=} screenConfig -
 */
export function startup(screenConfig, settingsConfig = {}) {
    setGmi(settingsConfig, window);
    hookErrors(gmi.gameContainerId);

    const browser = getBrowser();
    const scenes = getScenes(screenConfig);
    scenes.unshift(new Loader());
    scenes.unshift(new Boot(screenConfig));

    const phaserConfig = {
        width: 1400,
        height: 600,
        renderer: browser.forceCanvas ? Phaser.CANVAS : Phaser.AUTO,
        antialias: true,
        multiTexture: true,
        parent: getContainerDiv(),
        banner: true,
        title: "Game Title Here", //TODO P3 these could be useful [NT]
        version: "Version Info here", //TODO P3 these could be useful [NT]
        transparent: browser.isSilk, // Fixes silk browser flickering
        clearBeforeRender: false,
        scale: {
            mode: Phaser.Scale.NONE,
        },
        scene: scenes,
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
            ],
            scene: [
                {
                    key: "SpinePlugin",
                    plugin: window.SpinePlugin,
                    mapping: "spine",
                },
            ],
        },
    };

    if (qaMode.debugMode()) {
        phaserConfig.physics = {
            default: "arcade",
            arcade: {
                debug: true,
            },
        };
    }

    addCustomStyles();

    const game = new Phaser.Game(phaserConfig);

    qaMode.create(window, game);
    a11y.setup(getContainerDiv());
}

function getContainerDiv() {
    const containerDiv = document.getElementById(gmi.gameContainerId);
    if (!containerDiv) {
        throw Error(`Container element "#${gmi.gameContainerId}" not found`);
    } else {
        return containerDiv;
    }
}
