import { Loadscreen } from "src/components/loadscreen";
import { Title } from "src/components/title";
import { startup } from "./core/startup";

startup().then(game => {
    game.state.add("loadscreen", new Loadscreen());
    game.state.add("title", new Title());
    game.state.start("loadscreen");
});
