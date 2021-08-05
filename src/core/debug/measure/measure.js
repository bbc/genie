/**
 * @copyright BBC 2020
 * @author BBC Children's D+E
 * @license Apache-2.0
 */
import { createMeasureUi } from "./ui.js";
import fp from "../../../../lib/lodash/fp/fp.js";

export const createMeasure = parent => {
	const { update, toggleUi } = createMeasureUi(parent);
	const scene = parent.scene;
	const shutdown = () => scene.events.off("update", update, scene);

	const addEvents = () => {
		scene.events.on("update", update, scene);
		scene.events.once("shutdown", shutdown, scene);
	};

	const toggleEvents = visible => (visible ? addEvents() : shutdown());

	return fp.flow(toggleUi, toggleEvents);
};
