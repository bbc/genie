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

export const getScenes = conf => Object.keys(conf).map(key => new conf[key].scene({ key }));

/**
 * @param {Object=} settingsConfig - Additional state that is added to the inState context.
 * @param {Object=} navigationConfig -
 */
export function startup(settingsConfig = {}, screenConfig) {
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

    // Keep the console tidy:
    window.PhaserGlobal = window.PhaserGlobal || {};
    window.PhaserGlobal.hideBanner = true;

    addCustomStyles();

    const game = new Phaser.Game(phaserConfig);

    qaMode.create(window, game);
}

function getContainerDiv() {
    const containerDiv = document.getElementById(gmi.gameContainerId);
    if (!containerDiv) {
        throw Error(`Container element "#${gmi.gameContainerId}" not found`);
    } else {
        return containerDiv;
    }
}
