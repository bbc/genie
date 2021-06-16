/**
 * Startup extends `Phaser.State` and creates a new `Phaser.Game`, as well as a new `Navigation` object.
 * It also instantiates the `Context` object.
 *
 * @module core/startup
 * @copyright BBC 2018
 * @author BBC Children's D+E
 * @license Apache-2.0
 */
import "../../lib/polyfills/element-remove-polyfil.js";
import { gmi, setGmi } from "./gmi/gmi.js";
import { addCustomStyles } from "./custom-styles.js";
import * as debugMode from "./debug/debug-mode.js";
import { hookErrors } from "./loader/hook-errors.js";
import * as a11y from "./accessibility/accessibility-layer.js";
import { addGelButton } from "./layout/gel-game-objects.js";
import { getPhaserDefaults } from "./loader/phaser-defaults/get-phaser-defaults.js";
import { initGelDom } from "./layout/gel-dom.js";
import { addDomText } from "./layout/dom-text.js";

export const startup = config => {
    setGmi(config.settings || {}, window);
    hookErrors(gmi.gameContainerId);
    Phaser.GameObjects.GameObjectFactory.register("gelButton", addGelButton);
    Phaser.GameObjects.GameObjectFactory.register("domText", addDomText);
    addCustomStyles();
    const game = new Phaser.Game(getPhaserDefaults(config));
    game.device.audio.mp4 = true;
    debugMode.create(window, game);
    initGelDom(game);
    a11y.create();
};
