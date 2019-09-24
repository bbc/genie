/**
 * Startup extends `Phaser.State` and creates a new `Phaser.Game`, as well as a new `Navigation` object.
 * It also instantiates the `Context` object.
 *
 * @module core/startup
 * @copyright BBC 2018
 * @author BBC Children's D+E
 * @license Apache-2.0 Apache-2.0
 */
import * as Navigation from "./navigation.js";
import * as LayoutManager from "./layout-manager.js";
import { loadFonts } from "./font-loader.js";
import { gmi, setGmi } from "./gmi/gmi.js";
import * as a11y from "./accessibility/accessibility-layer.js";
import { addCustomStyles } from "./custom-styles.js";
import * as qaMode from "./qa/qa-mode.js";
import { getBrowser } from "./browser.js";
import { Boot } from "../components/loader/bootscreen.js";
import { hookErrors} from '../components/loader/hook-errors.js';

//TODO P3 this is just a quick shim to create the scenes array
export const getScenes = conf => Object.keys(conf).map(key => new conf[key].state());

/**
 * @param {Object=} settingsConfig - Additional state that is added to the inState context.
 * @param {Object=} navigationConfig -
 */
export function startup(settingsConfig = {}, navigationConfig) {
    setGmi(settingsConfig, window);
    hookErrors(gmi.gameContainerId);

    const browser = getBrowser();

    const scenes = getScenes(navigationConfig());
    scenes.unshift(new Boot(onStarted));

    const phaserConfig = {
        width: 1400,
        height: 600,
        renderer: browser.forceCanvas ? Phaser.CANVAS : Phaser.AUTO,
        antialias: true,
        multiTexture: true,
        parent: getContainerDiv(),
        title: "Game Title Here",       //TODO P3 these could be useful [NT]
        version: "Version Info here",   //TODO P3 these could be useful [NT]
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

    const game = new Phaser.Game(phaserConfig);

    //TODO P3 This is called at the end of boot - which mainly loads the config
    // could this just be set in loadscreen?
    function onStarted() {
        //TODO P3 these could be set using this.game on loadscreen?
        // Phaser is now set up and we can use all game properties.
        game.canvas.setAttribute("tabindex", "-1");
        game.canvas.setAttribute("aria-hidden", "true");
        const layoutManager = LayoutManager.create(game);

        //TODO P3 now part of camera and set per scene e.g: this.cameras.main.backgroundColor.setTo(255,255,255);
        //game.stage.backgroundColor = "#333";

        //TODO P3 goToScreen could be moved to screen method [NT]
        const onFontsLoaded = () => {
            this.switchScene("loadscreen");
        };
        loadFonts(game, onFontsLoaded);

        a11y.setup(game.canvas.parentElement);
    }
}

function getContainerDiv() {
    const containerDiv = document.getElementById(gmi.gameContainerId);
    if (!containerDiv) {
        throw Error(`Container element "#${gmi.gameContainerId}" not found`);
    } else {
        return containerDiv;
    }
}
