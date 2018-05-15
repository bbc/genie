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

    init(context, screens, layoutFactory) {
        console.log("screen.js - Screen - init");
        this.layoutFactory = layoutFactory;
        this.screens = screens;
        this._context = context;
        console.log("screen.js - Screen - init - layoutFactory: ", this.layoutFactory);
        console.log("screen.js - Screen - init - screens: ", this.screens);
        console.log("screen.js - Screen - init - context: ", this.context);
    }
}
