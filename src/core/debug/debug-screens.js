/**
 * @copyright BBC 2020
 * @author BBC Children's D+E
 * @license Apache-2.0
 */
import { Launcher } from "./launcher.js";
import { examples } from "./examples.js";
import { getConfig } from "../loader/get-config.js";
import fp from "../../../lib/lodash/fp/fp.js";

const launcherScreen = {
    debug: {
        scene: Launcher,
        routes: {
            home: "home",
        },
    },
};

const getDebugScreenWithRoutes = () => {
    Object.keys(examples).map(screenKey => (launcherScreen.debug.routes[screenKey] = screenKey));

    return launcherScreen;
};

const addScene = scene => key => scene.scene.add(key, examples[key].scene);

const addScreens = scene => {
    Object.keys(examples).map(addScene(scene));
    const debugTheme = getConfig(scene, "example-files").theme;
    const config = scene.context.config;
    config.navigation = scene.context.navigation;

    Object.assign(config.theme, debugTheme);
    Object.assign(config.navigation, examples); //name method for this

    scene.setConfig(config);
};

export const addExampleScreens = fp.once(addScreens);
export const getLauncherScreen = isDebug => (isDebug ? getDebugScreenWithRoutes() : {});
