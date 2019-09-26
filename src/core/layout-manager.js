/**
 * A Genie layoutManager is instantiated once in {@link module:core/navigation}
 *
 * It instantiates {@link module:core/scaler} and provides methods for adding display objects to foreground and
 * background groups (It is expected that most of a game would be added to the background group and any overlays /
 * HUD would go in the foreground group).
 *
 * It also provides a factory function for making [ gel layouts]{@link module:layout/layout}
 * and sets the phaser debug sprite to be at the top of the display list
 *
 * @example
 * this.layoutManager.addToBackground(this.game.add.image(0, 0, "sceneName.background"));
 * this.layoutManager.addToBackground(this.game.add.image(0, -150, "sceneName.title"));
 * this.layoutManager.addLayout(["exit", "howToPlay", "play", "audio", "settings"]);
 *
 * @module core/layoutManager
 * @copyright BBC 2018
 * @author BBC Children's D+E
 * @license Apache-2.0
 */

/**
 * Create a new layoutManager
 *
 * @param {Phaser.Game} game
 * @returns {{addToBackground(), addToForeground(), addLayout(), removeAll(), getSize()}} - {{@link module:layout/factory.addLayout addLayout}}
 */
export function create(game) {
    /*
        TODO P3

        Most of this functionality has moved into screen.js
        We may need to move some of the remaning methods there

        I have deleted from this file anything that has already been moved [NT]
     */

    if (!game.accessibleButtons) {
        game.accessibleButtons = [];
    }
    const customAccessibleButtons = game.accessibleButtons;

    //TODO P3 next line part of debug draw
    //const debug = game.add.group(undefined, "debug", true);

    //TODO P3 Debug sprite will rely on how P3 does debug draws
    //if (game.debug.sprite) {
    //    debug.addChild(game.debug.sprite);
    //}

    const getLayouts = () => _layouts;
    const getAccessibleGameButtons = () => customAccessibleButtons;

    const removeAll = () => {
        //TODO P3 - is cleanup required still? NT
        //background.removeAll(true);
        _layouts.forEach(layout => layout.destroy());
        _layouts = [];
    };

    const removeLast = () => {
        _layouts[_layouts.length - 1].destroy();
        _layouts.pop();
    };

    return {
        getLayouts,
        getAccessibleGameButtons,
        removeAll,
        removeLast,
    };
}
