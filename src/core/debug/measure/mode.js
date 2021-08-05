/**
 * @copyright BBC 2020
 * @author BBC Children's D+E
 * @license Apache-2.0
 */
import { getMetrics } from "../../scaler.js";

let mode = 0;

const modes = [
	{
		type: "ABS",
		x: rect => parseInt(rect.x + Math.min(700, window.innerWidth / 2 / getMetrics().scale)),
		y: rect => rect.y + 300,
		width: rect => rect.width,
		height: rect => rect.height,
	},
	{
		type: "CEN",
		x: rect => rect.x,
		y: rect => rect.y,
		width: rect => rect.width,
		height: rect => rect.height,
	},
	{
		type: "WIN",
		x: rect => parseInt(getMetrics().scale * rect.x + Math.min(window.innerWidth / 2, getMetrics().scale * 700)),
		y: rect => parseInt(getMetrics().scale * (rect.y + 300)),
		width: rect => parseInt(getMetrics().scale * rect.width),
		height: rect => parseInt(getMetrics().scale * rect.height),
	},
];

export const getMode = () => modes[mode];

export const cycleMode = () => (mode = ++mode % modes.length);
