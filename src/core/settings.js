/**
 * @copyright BBC 2018
 * @author BBC Children's D+E
 * @license Apache-2.0
 */
import { eventBus } from "../core/event-bus.js";
import { gmi } from "./gmi/gmi.js";

export const settingsChannel = "genie-settings";

export const create = () => {
	const onSettingChanged = (key, value) => {
		eventBus.publish({
			channel: settingsChannel,
			name: key,
			data: value,
		});
	};

	const onSettingsClosed = () => {
		eventBus.publish({
			channel: settingsChannel,
			name: "settings-closed",
		});
	};

	return {
		show: () => gmi.showSettings(onSettingChanged, onSettingsClosed),
		getAllSettings: () => gmi.getAllSettings(),
	};
};

// Singleton used by games
export const settings = create();
