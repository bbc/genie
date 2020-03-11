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
import * as debugMode from "./debug/debug-mode.js";
import { getBrowser } from "./browser.js";
import { Loader } from "./loader/loader.js";
import { Boot } from "./loader/boot.js";
import { hookErrors } from "./loader/hook-errors.js";
import FontLoaderPlugin from "./loader/font-loader/font-plugin.js";
import { JSON5Plugin } from "./loader/json5-loader/json5-plugin.js";
import * as a11y from "./accessibility/accessibility-layer.js";
import { addGelButton } from "./layout/gel-game-objects.js";
import { CANVAS_HEIGHT, CANVAS_WIDTH } from "./layout/metrics.js";
import { debugScreens } from "./debug/debug-screens.js";

export const getScenes = conf => Object.keys(conf).map(key => new conf[key].scene({ key, ...conf[key].settings }));

/**
 * @param {Object=} settingsConfig - Additional state that is added to the inState context.
 * @param {Object=} screenConfig -
 */
export function startup(screenConfig, settingsConfig = {}) {
    setGmi(settingsConfig, window);
    hookErrors(gmi.gameContainerId);

    Phaser.GameObjects.GameObjectFactory.register("gelButton", addGelButton);

    const browser = getBrowser();
    const scenes = getScenes(Object.assign(screenConfig, debugScreens));
    scenes.unshift(new Loader());
    scenes.unshift(new Boot(screenConfig));

    const phaserConfig = {
        width: CANVAS_WIDTH,
        height: CANVAS_HEIGHT,
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
        input: {
            windowEvents: false,
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

    addCustomStyles();

    const game = new Phaser.Game(phaserConfig);

    debugMode.create(window, game);
    a11y.create(getContainerDiv());
}

function getContainerDiv() {
    const containerDiv = document.getElementById(gmi.gameContainerId);
    if (!containerDiv) {
        throw Error(`Container element "#${gmi.gameContainerId}" not found`);
    } else {
        return containerDiv;
    }
}
