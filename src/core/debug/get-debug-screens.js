/**
 * @copyright BBC 2020
 * @author BBC Children's D+E
 * @license Apache-2.0
 */
import { Launcher } from "./launcher.js";
import { examples } from "./examples.js";

/*
TODO
- Strip debug config from routes
- Separate example config files into own loader
- test in starter pack
- doc or auto strip from build example files (may need a tidy here
- check if build can strip un-needed files when it copies the themes directory
- move debugScreens into own modules
- standardise terminology - debug / launcher / examples?
 */
const launcherScreen = {
    debug: {
        scene: Launcher,
        routes: {
            home: "home",
        },
    },
};

const getAllScreens = () => {
    Object.keys(examples).map(screenKey => (launcherScreen.debug.routes[screenKey] = screenKey));

    return Object.assign({}, launcherScreen, examples);
};

export const getDebugScreens = isDebug => (isDebug ? getAllScreens() : {});
