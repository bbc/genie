//import "babel-polyfill";

import { Home } from "./components/home.js";
import { Loadscreen } from "./components/loadscreen.js";
import { GameTest } from "./components/test-harness/test-screens/game.js";
import { ResultsTest } from "./components/test-harness/test-screens/results.js";
import { startup } from "./core/startup.js";

const transitions = [
    {
        name: "loadscreen",
        state: new Loadscreen(),
        nextScreenName: () => "home",
    },
    {
        name: "home",
        state: new Home(),
        nextScreenName: () => "game",
    },
    {
        name: "game",
        state: new GameTest(),
        nextScreenName: () => "results",
    },
    {
        name: "results",
        state: new ResultsTest(),
        nextScreenName: () => "home",
    },
];

startup(transitions);
