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

    init(screensData, transientData) {
        this.layoutFactory = screensData.layoutFactory;
        this._context = screensData.context;
        this.screens = screensData.screens;
        this.navigation = screensData.screens[this.game.state.current];
        this.transientData = transientData;
    }
}
