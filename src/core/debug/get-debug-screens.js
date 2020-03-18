/**
 * @copyright BBC 2020
 * @author BBC Children's D+E
 * @license Apache-2.0
 */
import { Launcher } from "./launcher.js";
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
        title: "Select 1 item",
        routes: {
            next: "debug",
            home: "debug",
        },
    },
    "select-grid": {
        scene: Select,
        title: "Select Grid",
        routes: {
            next: "debug",
            home: "debug",
        },
    },
};

export const getDebugScreens = isDebug => (isDebug ? debugScreens : {});
