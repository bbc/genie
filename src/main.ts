import "babel-polyfill";
import "src/lib/phaser";

import { Home } from "src/components/home";
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
        nextScreenName: () => "",
    },
];

startup(transitions);
