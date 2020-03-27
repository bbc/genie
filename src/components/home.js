/**
 * Home is the main title screen for the game.
 *
 * @module components/home
 * @copyright BBC 2018
 * @author BBC Children's D+E
 * @license Apache-2.0
 */
import { buttonsChannel } from "../core/layout/gel-defaults.js";
import { Screen } from "../core/screen.js";
import { eventBus } from "../core/event-bus.js";
import { isDebug } from "../core/debug/debug-mode.js";

export class Home extends Screen {
    create() {
        const achievements = this.context.config.theme.game.achievements ? ["achievements"] : [];
        const debug = isDebug() ? ["debug"] : [];
        this.add.image(0, 0, `${this.assetPrefix}.background`);
        this.addAnimations();
        this.add.image(0, -150, `${this.assetPrefix}.title`);

        const buttons = ["exit", "howToPlay", "play", "audio", "settings"];
        this.setLayout(buttons.concat(achievements, debug));

        eventBus.subscribe({
            channel: buttonsChannel(this),
            name: "play",
            callback: this.navigation.next,
        });
    }
}
