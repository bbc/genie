/**
 * @copyright BBC 2020
 * @author BBC Children's D+E
 * @license Apache-2.0
 */
import { Select } from "../../components/select/select-screen.js";
import { Results } from "../../components/results/results-screen.js";
import { Home } from "../../components/home.js";

export const examples = {
    select1: {
        scene: Select,
        title: "Select 1 item",
        routes: {
            next: "debug",
            home: "debug",
        },
    },
    selectGrid: {
        scene: Select,
        title: "Select Grid",
        routes: {
            next: "debug",
            home: "debug",
        },
    },
    results1Sec: {
        scene: Results,
        title: "Results: 1s countup",
        transientData: {
            results1Sec: {
                stars: 100,
                gems: 50,
                keys: 5,
            },
        },
        routes: {
            continue: "debug",
            restart: "debug",
            home: "debug",
        },
    },
    results10Sec: {
        scene: Results,
        title: "Results: 10s countup",
        transientData: {
            results10Sec: {
                stars: 100,
                gems: 50,
                keys: 5,
            },
        },
        routes: {
            continue: "debug",
            restart: "debug",
            home: "debug",
        },
    },
    backgroundAnimations: {
        scene: Home,
        title: "Background Animations",
        routes: {
            debug: "debug",
            //Example of custom routing function
            next: "debug",
        },
    },
};
