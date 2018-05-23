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
 * @author Nick Tipping <nick.tipping@bbc.co.uk>
 * @module core/debug
 */
let enabled = false;
let bodies = [];

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
 * @param {Object} body - the sprite whose physics body
 * @param {String} color - colour of the debug overlay
 * @param {Boolean} filled - draw an outline or a solid block
 */
export const add = (body, color = "rgba(0,255,0,0.4)", filled = true) => {
    bodies.push([body, color, filled]);
};

export const clear = () => (bodies = []);

/**
 * Render the debug items.
 *
 * @param {Phaser.game} game
 */
export const render = game => {
    if (enabled) {
        bodies.forEach(body => {
            game.debug.body(...body);
        });
    }
};
