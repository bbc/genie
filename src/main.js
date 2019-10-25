/**
 * @copyright BBC 2018
 * @author BBC Children's D+E
 * @license Apache-2.0
 */
import { Home } from "./components/home";
import { Results } from "./components/results";
import { Select } from "./components/select";
import { GameTest } from "./components/test-screens/game";
import { Pause } from "./components/overlays/pause";
import { settingsChannel } from "./core/settings";
import * as signal from "./core/signal-bus";
import { startup } from "./core/startup";

const settingsConfig = {
    pages: [
        {
            title: "Custom Settings",
            settings: [
                {
                    key: "custom1",
                    type: "toggle",
                    title: "Custom setting",
                    description: "Description of custom setting",
                },
            ],
        },
    ],
};

signal.bus.subscribe({
    channel: settingsChannel,
    name: "custom1",
    callback: value => {
        console.log("Custom 1 setting changed to " + value); // eslint-disable-line no-console
    },
});

//TODO P3
//if (parseUrlParams(window.location.search).sanityCheck === true) {
//    return phaserTestHarnessConfig(goToScreen);
//}

const screenConfig = {
    home: {
        scene: Home,
        routes: {
            next: "character-select",
        },
    },
    "character-select": {
        scene: Select,
        routes: {
            next: "level-select",
            home: "home",
            restart: "home",
        },
    },
    "level-select": {
        scene: Select,
        routes: {
            next: "game",
            home: "home",
            restart: "home",
        },
    },
    game: {
        scene: GameTest,
        routes: {
            next: "results",
            home: "home",
            restart: "game",
        },
    },
    results: {
        scene: Results,
        routes: {
            next: "home",
            game: "game",
            restart: "game",
            home: "home",
        },
    },
    // Overlays
    "how-to-play": {
        scene: Select,
        routes: {
            home: "home",
        },
    },
    pause: {
        scene: Pause,
        routes: {
            home: "home",
        },
    },
    "pause-noreplay": {
        scene: Pause,
        routes: {
            home: "home",
        },
    },
};

startup(screenConfig, settingsConfig);
