import "babel-polyfill";
import "src/lib/phaser";

import { startup } from "./core/startup";
import { Loadscreen } from "src/components/loadscreen";

const transitions = [
    {
        name: "loadscreen",
        state: new Loadscreen(),
        nextScreenName: () => "next",
    },
];

startup(transitions);
