/**
 * @copyright BBC 2020
 * @author BBC Children's D+E
 * @license Apache-2.0
 */
import { Select } from "../../components/select/select-screen.js";
import { Results } from "../../components/results/results-screen.js";
import { Home } from "../../components/home.js";
import { Narrative } from "../../components/narrative.js";
import { Shop } from "../../components/shop/shop.js";
import { GelText } from "./gel-text.js";
import fp from "../../../lib/lodash/fp/fp.js";

const prependDebug = key => `debug-${key}`;

const exampleScreens = {
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
    "results-bitmaptext": {
        scene: Results,
        title: "Results: BitmapText",
        transientData: {
            stars: 5,
            gems: 50,
            keys: 1000000,
        },
        routes: {
            continue: "debug",
            restart: "debug",
            home: "debug",
        },
    },
    "results-bitmapcountup": {
        scene: Results,
        title: "Results: BitmapCountup",
        transientData: {
            stars: 5,
            gems: 50,
            keys: 1000000,
        },
        routes: {
            continue: "debug",
            restart: "debug",
            home: "debug",
        },
    },
    "results-1-sec": {
        scene: Results,
        title: "Results: 1s countup",
        transientData: {
            stars: 5,
            gems: 50,
            keys: 1000000,
        },
        routes: {
            continue: "debug",
            restart: "debug",
            home: "debug",
        },
    },
    "results-10-sec": {
        scene: Results,
        title: "Results: 10s countup",
        transientData: {
            stars: 5,
            gems: 50,
            keys: 1000000,
        },
        routes: {
            continue: "debug",
            restart: "debug",
            home: "debug",
        },
    },
    "results-spine": {
        scene: Results,
        title: "Results:\nSpine animations",
        transientData: {
            powerups: 10,
            gems: 50,
            keys: 5,
        },
        routes: {
            continue: "debug",
            restart: "debug",
            home: "debug",
        },
    },
    "results-row-particles": {
        scene: Results,
        title: "Results:\nRow Particles",
        transientData: {
            stars: 16,
            gems: 50,
            keys: 122,
        },
        routes: {
            continue: "debug",
            restart: "debug",
            home: "debug",
        },
    },
    "results-conditional-assets": {
        scene: Results,
        title: "Results:\nConditional Assets",
        prompt: {
            title:
                "Enter a valid JSON string as transientData (sprite picking: use 0 to 3 stars; audio picking: 0 or 1 keys.)",
            default: '{ "stars": 3, "keys": 1, "gems": 50 }',
        },
        transientData: {
            stars: 0,
            gems: 0,
            keys: 0,
        },
        routes: {
            continue: "debug",
            restart: "debug",
            home: "debug",
        },
    },
    "background-animations": {
        scene: Home,
        title: "Background Animations",
        routes: {
            debug: "debug",
            next: "debug",
        },
    },
    "background-particles": {
        scene: Home,
        title: "Background Particles",
        routes: {
            debug: "debug",
            next: "debug",
        },
    },
    ...Shop({ key: "shop-equippables", routes: { back: "debug" }, title: "Shop - Equippables" }),
    ...Shop({ key: "shop-consumables", routes: { back: "debug" }, title: "Shop - Consumables" }),
    narrative: {
        scene: Narrative,
        title: "Narrative",
        routes: {
            back: "debug",
            next: "debug",
        },
    },

    "gel-text": {
        scene: GelText,
        title: "Gel Text",
        routes: {
            back: "debug",
            next: "debug",
        },
    },
};

export const examples = fp.mapKeys(prependDebug, exampleScreens);
