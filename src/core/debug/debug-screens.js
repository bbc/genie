/**
 * @copyright BBC 2020
 * @author BBC Children's D+E
 * @license Apache-2.0
 */
import { Launcher } from "./launcher.js";
import { examples } from "./examples.js";
import { getConfig } from "../loader/get-config.js";
import fp from "../../../lib/lodash/fp/fp.js";

/*
TODO
- Finish labels for all screens
- test in starter pack (may need routing in local web server)
- button to launcher on home page
- doc or auto strip from build example theme files (may need a tidy here)
- check if build can strip un-needed files when it copies the themes directory


- "When the user lands on the example launcher screen, It is clear to the user which screen they are on" - what does that even mean?
- "When the user lands on the example launcher screen, it is clear to the user WHAT the screen is for and HOW they should use it " unsure what this means?
- The example files cannot be included/packaged with the final game - will this need to be a manual delete?
- It is clear to the agency dev what type of example configurations they are choosing to view - even before they actually open one [discuss approach to this during preamigo]
        - this is the one that should just be "the name on the button".
 */
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
