import "babel-polyfill";

import { Home } from "./components/home";
import { Loadscreen } from "./components/loadscreen";
import { GameTest } from "./components/test-harness/test-screens/game";
import { ResultsTest } from "./components/test-harness/test-screens/results";
import { startup } from "./core/startup";

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
