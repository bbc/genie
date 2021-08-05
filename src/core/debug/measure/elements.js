/**
 * @copyright BBC 2020
 * @author BBC Children's D+E
 * @license Apache-2.0
 */
import { getMode } from "./mode.js";

const style = {
	color: "#FFF",
	backgroundColor: "#000",
	fontSize: "10px",
	fontFamily: "Arial",
	strokeThickness: 1,
	resolution: 2,
	padding: {
		left: 4,
		right: 4,
		top: 1,
		bottom: 4,
	},
};

const updateCoordsFn = (coords, handle) => rect => {
	const mode = getMode();
	const x = mode.x(rect);
	const y = mode.y(rect);
	const width = mode.width(rect);
	const height = mode.height(rect);

	coords.text = `X: ${x}\nY: ${y}\nW ${width}\nH: ${height}\n${mode.type}`;
	coords.x = rect.x;
	coords.y = rect.y;

	handle.x = rect.x - 5 + rect.width;
	handle.y = rect.y - 5 + rect.height;
};

export const createElements = scene => {
	const rect = scene.add
		.rectangle(0, 0, 100, 100, 0x000000, 0x000000)
		.setStrokeStyle(1, 0x000000)
		.setInteractive({ draggable: true, useHandCursor: true })
		.setOrigin(0, 0);

	const handle = scene.add
		.rectangle(45, 45, 10, 10, 0x000000)
		.setInteractive({ draggable: true, useHandCursor: true });

	const coords = scene.add.text(0, 0, " ", style);
	const legend = scene.add.text(0, 100, "CURSOR KEYS: MOVE\n+X: SIZE\n+Z: SLOWER\nC: MODE", style).setOrigin(0.5, 0);

	const updateCoords = updateCoordsFn(coords, handle);

	const toggleUi = () => {
		const visible = !rect.visible;
		scene.input.topOnly = visible;
		[rect, coords, legend, handle].forEach(o => (o.visible = visible));
		return visible;
	};

	toggleUi();

	return { rect, coords, legend, handle, updateCoords, toggleUi };
};
