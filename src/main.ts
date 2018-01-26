import { Home } from "src/components/home";
import { Loadscreen } from "src/components/loadscreen";
import "src/lib/phaser";
import { startup } from "./core/startup";

startup().then(game => {
    game.state.add("loadscreen", new Loadscreen());
    game.state.add("title", new Home());
    game.state.start("loadscreen");
});
