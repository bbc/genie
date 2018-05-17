import * as pause from "../components/pause.js";
import * as gel from "../core/layout/gel-defaults.js";
import { settings } from "../core/settings.js";
import * as signal from "../core/signal-bus.js";
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

    init(context, next, layoutFactory) {
        this.layoutFactory = layoutFactory;
        this._context = context;
        this.addGelSubscriptions();
        this._next = next;
    }

    addGelSubscriptions() {
        signal.bus.subscribe({
            channel: gel.buttonsChannel,
            name: "exit",
            callback: () => {
                this.context.gmi.exit();
            },
        });
        signal.bus.subscribe({
            channel: gel.buttonsChannel,
            name: "pause",
            callback: pause.create,
        });
        signal.bus.subscribe({ channel: gel.buttonsChannel, name: "settings", callback: settings.show });
    }

    next(changedState) {
        this._next(changedState);
    }
}
