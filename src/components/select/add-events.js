/**
 * @copyright BBC 2020
 * @author BBC Children's D+E
 * @license Apache-2.0
 */
import { eventBus } from "../../core/event-bus.js";
import { buttonsChannel } from "../../core/layout/gel-defaults.js";

export const addEvents = scene => {
    const grid = scene.grid;
    grid.cellIds().map(key => {
        eventBus.subscribe({
            channel: buttonsChannel(scene),
            name: key,
            callback: scene.next(() => key),
        });
    });
    eventBus.subscribe({
        channel: buttonsChannel(scene),
        name: "continue",
        callback: scene.next(scene.grid.getCurrentPageKey),
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
