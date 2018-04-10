import { Loadscreen } from "./components/loadscreen.js";
import { Home } from "./components/home.js";
import { Select } from "./components/select.js";
import { GameTest } from "./components/test-harness/test-screens/game.js";
import { Results } from "./components/results.js";
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
        nextScreenName: () => "characterSelect",
    },
    {
        name: "characterSelect",
        state: new Select(),
        nextScreenName: state => {
            if (state.transient.home) {
                state.transient.home = false;
                return "home";
            }
            return "game";
        },
    },
    {
        name: "game",
        state: new GameTest(),
        nextScreenName: state => {
            if (state.transient.home) {
                state.transient.home = false;
                return "home";
            }
            if (state.transient.restart) {
                state.transient.restart = false;
                return "game";
            }
            return "results";
        },
    },
    {
        name: "results",
        state: new Results(),
        nextScreenName: state => {
            if (state.transient.game) {
                state.transient.game = false;
                return "game";
            }
            return "home";
        },
    },
];

startup(transitions);
