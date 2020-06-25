/**
 * @copyright BBC 2020
 * @author BBC Children's D+E
 * @license Apache-2.0
 */
import { Launcher } from "./launcher.js";
import { examples } from "./examples.js";
import { getDebugConfig } from "../loader/get-config.js";
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
    Object.keys(examples).map(key => (launcherScreen.debug.routes[key] = key));
    return launcherScreen;
};

const prependDebug = key => `debug-${key}`;

const addScene = (scene, examples) => key => scene.scene.add(key, examples[key].scene);

const addScreens = scene => {
    Object.keys(examples).map(addScene(scene, examples));
    const debugTheme = fp.mapKeys(prependDebug, getDebugConfig(scene, Object.keys(examples)));
    const config = scene.context.config;
    config.navigation = scene.context.navigation;

    Object.assign(config, debugTheme);
    Object.assign(config.navigation, examples);

    scene.setConfig(config);
};

export const addExampleScreens = fp.once(addScreens);
export const getLauncherScreen = isDebug => (isDebug ? getDebugScreenWithRoutes() : {});
