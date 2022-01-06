/**
 * @copyright BBC 2018
 * @author BBC Children's D+E
 * @license Apache-2.0
 */
import fp from "../../../lib/lodash/fp/fp.js";

const globalSettings = [
	{
		key: "audio",
		type: "toggle",
		title: "Audio",
		description: "Turn off/on sound and music",
	},
	{
		key: "motion",
		type: "toggle",
		title: "Motion FX",
		description: "Turn off/on motion effects",
	},
];

export let gmi = {};

const parsePage = page =>
	page.title === "Global Settings"
		? { ...page, ...{ settings: fp.unionBy("key", globalSettings, page.settings) } }
		: page;

export const setGmi = (customSettings = {}, windowObj) => {

	const customGlobalPage = customSettings.pages?.find(page => page.title === "Global Settings")

	//map isn't needed as we only merge
	const pages = customSettings.pages?.map(parsePage);

	const settingsConfig = { pages };

	gmi = windowObj.getGMI({ settingsConfig });
};
