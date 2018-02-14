import "babel-polyfill";
import "src/lib/phaser";

import { Home } from "src/components/home";
import { GameTest } from "src/components/test-harness/test-screens/game";
import { ResultsTest } from "src/components/test-harness/test-screens/results";
import { Loadscreen } from "src/components/loadscreen";
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
