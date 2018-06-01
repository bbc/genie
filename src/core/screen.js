import _ from "../../lib/lodash/lodash.js";
import * as howToPlay from "../components/overlays/how-to-play.js";
import * as pause from "../components/overlays/pause.js";
import * as gel from "../core/layout/gel-defaults.js";
import { settings } from "../core/settings.js";
import * as signal from "../core/signal-bus.js";

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
        this.addGelSubscriptions();
        this.navigation = navigation[this.game.state.current].routes;
        this.transientData = transientData;
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
        signal.bus.subscribe({
            channel: gel.buttonsChannel,
            name: "how-to-play",
            callback: howToPlay.create,
        });
        signal.bus.subscribe({ channel: gel.buttonsChannel, name: "settings", callback: settings.show });
    }
}
