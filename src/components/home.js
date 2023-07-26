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
import { gmi } from "../core/gmi/gmi.js";

export class Home extends Screen {
	create() {
		const achievements = gmi.achievements.get().length ? ["achievements"] : [];
		const exit = gmi.shouldShowExitButton ? ["exit"] : [];
		const debug = isDebug() ? ["debug"] : [];
		this.addBackgroundItems();
		const buttons = ["howToPlay", "play", "audio", "settings"];
		this.setLayout(buttons.concat(exit, achievements, debug));

		this.add.image(0, 0, "home.basisoo")

		eventBus.subscribe({
			channel: buttonsChannel(this),
			name: "play",
			callback: this.navigation.next,
		});
	}
}
