/**
 * The debug module provides a helper to set up objects with phaser debug draw.
 *
 * Currently it only supports physics bodies
 * TODO Strip debug from final builds
 * TODO Support all Phaser.Debug methods
 *
 * @example
 * import * as debug from "./debug.js";
 *
 * // Inside your screen's update() provide a toggle e.g:
 * const debugKey = this.game.input.keyboard.addKey(Phaser.Keyboard.D);
 * debugKey.onUp.add(() => {debug.toggle(this.game);});
 *
 * // Inside your screen's render() call:
 * debug.render(this.game);
 *
 * debug.add(this.player, "rgba(255,0,0,1)", false);
 *
 * @module core/debug
 * @copyright BBC 2018
 * @author BBC Children's D+E
 * @license Apache-2.0
 */
let enabled = false;
let bodies = [];
let groups = [];

/**
 * Swap between enabled and disabled debug modes.
 */
export const toggle = game => enable(game, !enabled);

export const enable = (game, bool = true) => {
    enabled = bool;
    if (!enabled) {
        game.debug.reset();
    }
};

/**
 *
 * @param {Object} item - Phaser.Sprite (whose physics body we want to show) or Phaser.Group
 * @param {String} color - colour of the debug overlay
 * @param {Boolean} filled - draw an outline or a solid block
 */
export const add = (item, color = "rgba(0,255,0,0.4)", filled = true) => {
    if (item instanceof Phaser.Group) {
        groups.push({ item, color, filled });
    } else if (item instanceof Phaser.Sprite) {
        bodies.push([item, color, filled]);
    }
};

export const clear = () => {
    bodies = [];
    groups = [];
};

/**
 * Render the debug items.
 *
 * @param {Phaser.game} game
 */
export const render = game => {
    if (enabled) {
        bodies.forEach(body => game.debug.body(...body));
        groups.forEach(group => game.debug.geom(group.item.getBounds(), group.color, group.filled));
    }
};
