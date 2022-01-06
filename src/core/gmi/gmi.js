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

const getGlobalPage = (page = { title: "Global Settings", settings: [] }) => ({
	...page,
	...{ settings: fp.unionBy("key", globalSettings, page.settings) },
});

export const setGmi = (customSettings = {}, windowObj) => {
	const customGlobalPage = customSettings.pages?.find(page => page.title === "Global Settings");
	const globalPage = getGlobalPage(customGlobalPage);
	const pages = fp.unionBy("title", [globalPage], customSettings.pages);

	const settingsConfig = { pages };

	gmi = windowObj.getGMI({ settingsConfig });
};
