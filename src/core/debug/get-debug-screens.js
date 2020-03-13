/**
 * @copyright BBC 2020
 * @author BBC Children's D+E
 * @license Apache-2.0
 */
import { Launcher } from "./examples/launcher.js";
import { Select } from "../../components/select/select-screen.js";

const debugScreens = {
    debug: {
        scene: Launcher,
        routes: {
            home: "home",
            select1: "select-1",
            selectGrid: "select-grid",
        },
    },
    "select-1": {
        scene: Select,
        routes: {
            next: "debug",
            home: "debug",
        },
    },
    "select-grid": {
        scene: Select,
        routes: {
            next: "debug",
            home: "debug",
        },
    },
};

export const getDebugScreens = isDebug => (isDebug ? debugScreens : {});
