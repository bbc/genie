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
import { Boot } from "./loader/bootscreen.js";
import { hookErrors } from "./loader/hook-errors.js";

//TODO P3 this is just a quick shim to create the scenes array
export const getScenes = conf => Object.keys(conf).map(key => new conf[key].state());

/**
 * @param {Object=} settingsConfig - Additional state that is added to the inState context.
 * @param {Object=} navigationConfig -
 */
export function startup(settingsConfig = {}, screenConfig) {
    setGmi(settingsConfig, window);
    hookErrors(gmi.gameContainerId);

    const browser = getBrowser();
    const scenes = getScenes(screenConfig);
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
            mode: Phaser.Scale.HEIGHT_CONTROLS_WIDTH, //TODO P3 look at ENVELOP / FIT or look here: https://codepen.io/samme/pen/paOjMO
            autoCenter: Phaser.Scale.CENTER_BOTH,
        },
        scene: scenes,
    };
    // Keep the console tidy:
    window.PhaserGlobal = window.PhaserGlobal || {};
    window.PhaserGlobal.hideBanner = true;

    addCustomStyles();

    new Phaser.Game(phaserConfig);
}

function getContainerDiv() {
    const containerDiv = document.getElementById(gmi.gameContainerId);
    if (!containerDiv) {
        throw Error(`Container element "#${gmi.gameContainerId}" not found`);
    } else {
        return containerDiv;
    }
}
