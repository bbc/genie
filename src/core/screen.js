import _ from "../../lib/lodash/lodash.js";
import * as GameSound from "../core/game-sound.js";

/**
 * The `Screen` class extends `Phaser.State`, providing the `Context` to objects that extend from it.
 * All the game screens will extend from this class.
 */
export class Screen extends Phaser.State {
    get context() {
        return this._context;
    }

    set context(newContext) {
        this._context = _.merge({}, this._context, newContext);
    }

    getAsset(name) {
        return this.game.state.current + "." + name;
    }

    init(transientData, scene, context, navigation) {
        this.scene = scene;
        this._context = context;
        this.navigation = navigation[this.game.state.current].routes;
        const themeScreenConfig = this.context.config.theme[this.game.state.current];
        GameSound.setupScreenMusic(this.game, themeScreenConfig);
        this.transientData = transientData;
    }

    get visibleLayer() {
        const popupScreens = this.context.popupScreens;

        if (popupScreens.length > 0) {
            return popupScreens[popupScreens.length - 1];
        } else {
            return this.game.state.current;
        }
    }
}
