/**
 * @copyright BBC 2020
 * @author BBC Children's D+E
 * @license Apache-2.0
 */
import { Launcher } from "./launcher.js";
import { examples } from "./examples.js";
import { getConfig } from "../loader/get-config.js";
import fp from "../../../lib/lodash/fp/fp.js";
import { loadCollections } from "../loader/load-collections.js";
import { gmi } from "../gmi/gmi.js";

const launcherScreen = {
	debug: {
		scene: Launcher,
		routes: {
			home: "home",
		},
	},
};

const getDebugScreenWithRoutes = () => {
	Object.keys(examples).map(key => (launcherScreen.debug.routes[key] = key));
	return launcherScreen;
};

const addScene = (scene, examples) => key => scene.scene.add(key, examples[key].scene);

const addScreens = scene => {
	Object.keys(examples).map(addScene(scene, examples));
	const debugTheme = getConfig(scene, Object.keys(examples));
	const config = scene.context.config;
	config.navigation = scene.context.navigation;

	Object.assign(config, debugTheme);
	Object.assign(config.navigation, examples);

	scene.setConfig(config);

	scene.load.setBaseURL(gmi.gameDir);
	scene.load.setPath("debug/");

	return loadCollections(scene, debugTheme, "debug/");
};

export const addExampleScreens = fp.once(addScreens);
export const getLauncherScreen = isDebug => (isDebug ? getDebugScreenWithRoutes() : {});
