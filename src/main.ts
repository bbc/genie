import "babel-polyfill";
import "./lib/phaser";

import { Home } from "./components/home";
import { Loadscreen } from "./components/loadscreen";
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
        nextScreenName: () => "",
    },
];

startup(transitions);
