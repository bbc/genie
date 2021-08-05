/**
 * Narrative screens are used to relay information to the player.
 *
 * @module components/narrative
 * @copyright BBC 2020
 * @author BBC Children's D+E
 * @license Apache-2.0
 */
import { buttonsChannel } from "../core/layout/gel-defaults.js";
import { Screen } from "../core/screen.js";
import { eventBus } from "../core/event-bus.js";
import { nextPage, skip } from "../core/background/pages.js";
import { gmi } from "../core/gmi/gmi.js";

const fireStatsEvent = (eventName, eventType, screen) => {
	const params = {
		metadata: `PAG=[${screen.pageIdx}]`,
		source: `narrative-${screen.scene.key}`,
	};
	gmi.sendStatsEvent(eventName, eventType, params);
};

export class Narrative extends Screen {
	create() {
		this.addBackgroundItems();
		this.setLayout(["continue", "skip", "pause"]);
		this.events.once("shutdown", () => skip(this.timedItems));

		eventBus.subscribe({
			channel: buttonsChannel(this),
			name: "continue",
			callback: ({ screen }) => {
				fireStatsEvent("narrative", "continue", screen);
				nextPage(screen)();
			},
		});

		eventBus.subscribe({
			channel: buttonsChannel(this),
			name: "skip",
			callback: ({ screen }) => {
				fireStatsEvent("narrative", "skip", screen);
			},
		});
	}
}
