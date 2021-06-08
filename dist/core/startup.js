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
import { hookErrors } from "./loader/hook-errors.js";
import * as a11y from "./accessibility/accessibility-layer.js";
import { addGelButton } from "./layout/gel-game-objects.js";
import { getPhaserDefaults } from "./loader/phaserDefaults.js";
export function startup(config) {
  setGmi(config.settings || {}, window);
  hookErrors(gmi.gameContainerId);
  Phaser.GameObjects.GameObjectFactory.register("gelButton", addGelButton);
  addCustomStyles();
  var game = new Phaser.Game(getPhaserDefaults(config));
  debugMode.create(window, game);
  a11y.create();
}