/**
 * @copyright BBC 2020
 * @author BBC Children's D+E
 * @license Apache-2.0
 */
import { getLauncherScreen } from "../../debug/debug-screens.js";
import * as debugMode from "../../debug/debug-mode.js";
import { Loader } from "../loader.js";
import { Boot } from "../boot.js";
import { getBrowser } from "../../browser.js";
import { getBaseDefaults } from "./base-defaults.js";
import { getDefaultPlugins } from "./get-default-plugins.js";
import { getContainerDiv } from "../container.js";

const getScenes = conf => Object.keys(conf).map(key => new conf[key].scene({ key, ...conf[key].settings }));

export const getPhaserDefaults = config => {
	const browser = getBrowser();
	const scene = getScenes(Object.assign(config.screens, getLauncherScreen(debugMode.isDebug())));
	scene.unshift(new Loader());
	scene.unshift(new Boot(config.screens));

	const plugins = getDefaultPlugins(config.gameOptions);
	delete config?.gameOptions?.plugins;

	return {
		...getBaseDefaults(),
		...{
			type: Phaser.CANVAS ,
			transparent: browser.isSilk, // Fixes silk browser flickering
			parent: getContainerDiv(),
			scene,
			plugins,
		},
		...config.gameOptions,
	};
};
