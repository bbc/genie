/**
 * @copyright BBC 2018
 * @author BBC Children's D+E
 * @license Apache-2.0
 */

const dedupeGlobalSettings = customSettings => {
	return customSettings.filter(customSettings => {
		return !(customSettings.key === "audio" || customSettings.key === "motion");
	});
};

const addExtraGlobalSettings = (customSettingsObject, settingsConfig) => {
	const extraGlobalSettings = dedupeGlobalSettings(customSettingsObject.settings);
	return settingsConfig.pages[0].settings.concat(extraGlobalSettings);
};

const getDefaultGlobals = () => {
	return {
		pages: [
			{
				title: "Global Settings",
				settings: [
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
				],
			},
		],
	};
};

export let gmi = {};

export const setGmi = (customSettings, windowObj) => {
	const settingsConfig = getDefaultGlobals();

	if (customSettings && customSettings.pages) {
		customSettings.pages.forEach(customSettingsObject => {
			if (customSettingsObject.title === "Global Settings") {
				settingsConfig.pages[0].settings = addExtraGlobalSettings(customSettingsObject, settingsConfig);
			} else {
				settingsConfig.pages = settingsConfig.pages.concat([customSettingsObject]);
			}
		});
	}

	gmi = windowObj.getGMI({ settingsConfig });
};
