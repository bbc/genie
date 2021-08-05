/**
 * @copyright BBC 2020
 * @author BBC Children's D+E
 * @license Apache-2.0
 */
import { rectUpdateFn } from "./update-rect.js";
import { createElements } from "./elements.js";
import { cycleMode } from "./mode.js";
import { getInputFn } from "./get-input-fn.js";
import fp from "../../../../lib/lodash/fp/fp.js";

export const createMeasureUi = parent => {
	const { rect, coords, legend, handle, updateCoords, toggleUi } = createElements(parent.scene);

	const dragUpdate = (pointer, dragX, dragY) => {
		rect.x = parseInt(dragX);
		rect.y = parseInt(dragY);
		updateCoords(rect);
	};

	rect.on("drag", dragUpdate);

	const sizeDrag = (pointer, dragX, dragY) => {
		updateRect({
			x: 0,
			y: 0,
			width: parseInt(5 + dragX - rect.x - rect.width),
			height: parseInt(5 + dragY - rect.y - rect.height),
		});
		updateCoords(rect);
	};

	handle.on("drag", sizeDrag);

	const keys = parent.scene.input.keyboard.addKeys("z,x,c,up,down,left,right");
	keys.c.on("up", cycleMode);

	const updateRect = rectUpdateFn(rect, updateCoords);
	updateRect({ x: 0, y: 0, width: 0, height: 0 });

	[rect, coords, legend, handle].forEach(parent.add, parent);

	const update = fp.flow(getInputFn(keys), updateRect);

	return { update, toggleUi };
};
