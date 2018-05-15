import _ from "../lib/lodash/lodash.js";

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

    init(data) {
        this.layoutFactory = data.layoutFactory;
        this._context = data.context;
        this.screens = data.screens;
        this.navigation = data.screens[this.game.state.current];
    }
}
