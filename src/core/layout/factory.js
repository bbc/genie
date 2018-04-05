/**
 * The Layout Factory is instantiated once in {@link module:core/sequencer}
 *
 * It instantiates {@link module:core/scaler} and provides methods for adding display objects to foreground and
 * background. It also provides a factory function for making [ gel layouts]{@link module:layout/layout}
 *
 * @example
 * this.layoutFactory.addToBackground(this.game.add.image(0, 0, this.keyLookup.background));
 * this.layoutFactory.addToBackground(this.game.add.image(0, -150, this.keyLookup.title));
 * this.layoutFactory.addLayout(["exit", "howToPlay", "play", "audioOff", "settings"]);
 *
 * @module core/layout/factory
 */
import * as Scaler from "../scaler.js";
import { Layout } from "./layout.js";

/**
 * Create a new Layout Factory
 *
 * @param {Phaser.Game} game
 * @returns {{keyLookups: {}, addToBackground(), addToForeground(), addLayout(), removeAll(), addLookups(), getSize()}} - {{@link module:layout/factory.addLayout addLayout}}
 */
export function create(game) {
    const root = game.add.group(undefined, "gelGroup", true);
    const background = game.add.group(undefined, "gelBackground");
    const foreground = game.add.group(undefined, "foreground");
    const keyLookups = {};

    //TODO stageHeight should come from config
    const scaler = Scaler.create(600, game);

    root.addChild(background);
    root.addChild(foreground);

    scaler.onScaleChange.add(scaleBackground);

    return {
        keyLookups,
        addToBackground,
        addToForeground,
        addLayout,
        removeAll,
        addLookups,
        getSize: scaler.getSize,
    };

    /**
     * Create a new GEL layout for a given set of Gel Buttons
     * Called in the create method of a given screen
     *
     * @example
     * layoutFactory.create(["home", "restart", "continue", "pause"]);
     *
     * @param {Array} buttons - Array of standard button names to include. See {@link ./gel-defaults.js} for available names
     * @memberof module:layout/factory
     * @returns {Layout}
     */
    function addLayout(buttons) {
        const layout = new Layout(game, scaler, buttons);

        addToBackground(layout.root);

        return layout;
    }

    function addToBackground(object) {
        if (object.anchor) {
            object.anchor.setTo(0.5, 0.5);
        }
        return background.addChild(object);
    }

    function addToForeground(object) {
        return foreground.addChild(object);
    }

    function scaleBackground(width, height, scale) {
        background.scale.set(scale, scale);
        background.position.set(width / 2, height / 2);
    }

    function removeAll() {
        background.removeAll(true);
        // buttons.removeAll();
    }

    function addLookups(moreLookups) {
        Object.assign(keyLookups, moreLookups);
    }
}
