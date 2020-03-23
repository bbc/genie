/**
 * @copyright BBC 2020
 * @author BBC Children's D+E
 * @license Apache-2.0
 */
import { Launcher } from "./launcher.js";
import { examples } from "./examples.js";

/*
TODO
- Separate example config files into own loader - or can we use the preload method?
- Stop auto loader from attempting to load example screen packs
- show path to config file (could just use labels for now? or automate?
- Strip debug config from routes
- test in starter pack
- doc or auto strip from build example files (may need a tidy here
- check if build can strip un-needed files when it copies the themes directory
- move debugScreens into own modules
- standardise terminology - debug / launcher / examples?
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

const getAllScreens = () => {
    Object.keys(examples).map(screenKey => (launcherScreen.debug.routes[screenKey] = screenKey));

    return Object.assign({}, launcherScreen, examples);
};

export const getDebugScreens = isDebug => (isDebug ? getAllScreens() : {});
