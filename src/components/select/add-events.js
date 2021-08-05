/**
 * @copyright BBC 2020
 * @author BBC Children's D+E
 * @license Apache-2.0
 */
import { eventBus } from "../../core/event-bus.js";
import { buttonsChannel } from "../../core/layout/gel-defaults.js";

export const addEvents = scene => {
	const grid = scene.grid;
	grid.choices().map(choice => {
		eventBus.subscribe({
			channel: buttonsChannel(scene),
			name: choice.id,
			callback: scene.next(() => choice),
		});
	});
	eventBus.subscribe({
		channel: buttonsChannel(scene),
		name: "continue",
		callback: scene.next(scene.grid.getCurrentSelection),
	});
	eventBus.subscribe({
		channel: buttonsChannel(scene),
		name: "next",
		callback: () => grid.showPage(grid.page + 1),
	});
	eventBus.subscribe({
		channel: buttonsChannel(scene),
		name: "previous",
		callback: () => grid.showPage(grid.page - 1),
	});
};
