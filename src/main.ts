import "babel-polyfill";
import "src/lib/phaser";

import { startup } from "./core/startup";
import { Loadscreen } from "src/components/loadscreen";
import { Screen } from "./core/screen";

const transitions = [
    {
        name: "load",
        state: new Loadscreen(),
        nextScreenName: () => "",
    },
];

startup(transitions);
