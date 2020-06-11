/**
 * @copyright BBC 2020
 * @author BBC Children's D+E
 * @license Apache-2.0
 */
import { createMeasureUi } from "./ui.js";
import fp from "../../../../lib/lodash/fp/fp.js";

export const createMeasure = parent => {
    const { update, toggleUi } = createMeasureUi(parent);
    const shutdown = () => parent.scene.events.off("update", update, parent.scene);

    const addEvents = () => {
        parent.scene.events.on("update", update, parent.scene);
        parent.scene.events.once("shutdown", shutdown);
    };

    const toggleEvents = visible => (visible ? addEvents() : shutdown());

    return fp.flow(toggleUi, toggleEvents);
};
