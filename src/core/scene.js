/**
 * A Genie scene is instantiated once in {@link module:core/sequencer}
 *
 * It instantiates {@link module:core/scaler} and provides methods for adding display objects to foreground and
 * background groups. It also provides a factory function for making [ gel layouts]{@link module:layout/layout}
 * and sets the phaser debug sprite to be at the top of the display list
 *
 * @example
 * this.scene.addToBackground(this.game.add.image(0, 0, this.keyLookup.background));
 * this.scene.addToBackground(this.game.add.image(0, -150, this.keyLookup.title));
 * this.scene.addLayout(["exit", "howToPlay", "play", "audioOff", "settings"]);
 *
 * @module core/layout/factory
 */
import * as Scaler from "./scaler.js";
import * as Layout from "./layout/layout.js";

/**
 * Create a new Scene
 *
 * @param {Phaser.Game} game
 * @returns {{keyLookups: {}, addToBackground(), addToForeground(), addLayout(), removeAll(), addLookups(), getSize()}} - {{@link module:layout/factory.addLayout addLayout}}
 */
export function create(game) {
    let _layouts = [];
    const root = game.add.group(undefined, "root", true);
    const background = game.add.group(undefined, "background");
    const foreground = game.add.group(undefined, "foreground");
    const keyLookups = {};

    //TODO stageHeight should come from config
    const scaler = Scaler.create(600, game);

    root.addChild(background);
    root.addChild(foreground);
    root.addChild(game.debug.sprite);

    scaler.onScaleChange.add(scaleBackground);

    return {
        keyLookups,
        addToBackground,
        addToForeground,
        addLayout,
        getLayouts,
        removeAll,
        addLookups,
        getSize: scaler.getSize,
    };

    /**
     * Create a new GEL layout for a given set of Gel Buttons
     * Called in the create method of a given screen
     *
     * @example
     * scene.addLayout(["home", "restart", "continue", "pause"]);
     * @param {Array} buttons - Array of standard button names to include. See {@link ./gel-defaults.js} for available names
     *
     * @memberof module:layout/factory
     * @returns {Object}
     */
    function addLayout(buttons) {
        const layout = Layout.create(game, scaler, buttons);

        addToBackground(layout.root);

        _layouts.push(layout);
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

    function getLayouts() {
        return _layouts;
    }

    function removeAll() {
        background.removeAll(true);
        _layouts.forEach(layout => layout.destroy());
        _layouts = [];
    }

    function addLookups(moreLookups) {
        Object.assign(keyLookups, moreLookups);
    }
}
