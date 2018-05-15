import { Loadscreen } from "./components/loadscreen.js";
import { Home } from "./components/home.js";
import { Select } from "./components/select.js";
import { GameTest } from "./components/test-harness/test-screens/game.js";
import { Results } from "./components/results.js";
import { startup } from "./core/startup.js";
import { settings } from "./core/settings.js";

settings.setCloseCallback(() => {
    //Called when settings screen has been closed
    console.log("Settings Closed");
});

const settingsConfig = {
    pages: [
        {
            title: "Global Settings",
            settings: [
                {
                    key: "audio",
                    type: "toggle",
                    title: "Audio",
                    description: "Turn off/on sound and music",
                },
                {
                    key: "custom1",
                    type: "toggle",
                    title: "Custom 1",
                    description: "Switch custom message",
                },
            ],
        },
    ],
};

settings.add("custom1", value => {
    //Example of custom setting callback
    console.log("custom 1 setting changed to: " + value);
});

const gotoScreen = (name, data) => {
    console.log("==============================");
    console.log(data);
    console.log("==============================");

    return data.game.state.start(name, true, false, data.context, data.screens, data.layoutFactory);
};

const screenData = (name, instance, data) => {
    console.log("main.js - screenData");
    const state = new instance();
    const go = () => gotoScreen(name, data);

    console.log("main.js - screenData - returning:", { name, state, go });

    return { name, state, go };
};

const loadscreen = data => screenData("loadscreen", Loadscreen, data);
console.log("main.js - about to initialize home");
const home = data => screenData("home", Home, data);
console.log("main.js - about to initialize select");
const select = data => screenData("character-select", Select, data);
console.log("main.js - about to initialize game");
const game = data => screenData("game", GameTest, data);
console.log("main.js - about to initialize results");
const results = data => screenData("results", Results, data);

// Sean Transitions
const newTransitions = {
    init: {
        next: loadscreen,
    },
    loadscreen: {
        next: home,
    },
    home: {
        next: select,
    },
    characterSelect: {
        next: game,
        home: home,
        restart: home,
    },
    game: {
        next: results,
        home: home,
        restart: game,
    },
    results: {
        next: home,
        game: game,
        restart: game,
        home: home,
    },
};

//const transitions = [
//    {
//        name: "loadscreen",
//        state: new Loadscreen(),
//        nextScreenName: () => "home",
//    },
//    {
//        name: "home",
//        state: new Home(),
//        nextScreenName: () => "character-select",
//    },
//    {
//        name: "character-select",
//        state: new Select(),
//        nextScreenName: state => {
//            if (state.transient.home) {
//                state.transient.home = false;
//                return "home";
//            }
//            if (state.transient.restart) {
//                state.transient.restart = false;
//                return "home";
//            }
//            return "game";
//        },
//    },
//    {
//        name: "game",
//        state: new GameTest(),
//        nextScreenName: state => {
//            if (state.transient.home) {
//                state.transient.home = false;
//                return "home";
//            }
//            if (state.transient.restart) {
//                state.transient.restart = false;
//                return "game";
//            }
//            return "results";
//        },
//    },
//    {
//        name: "results",
//        state: new Results(),
//        nextScreenName: state => {
//            if (state.transient.game || state.transient.restart) {
//                state.transient.game = false;
//                state.transient.restart = false;
//                return "game";
//            }
//            if (state.transient.home) {
//                state.transient.home = false;
//            }
//            return "home";
//        },
//    },
//];

startup(newTransitions, {}, settingsConfig);
