import "./lib/phaser";
import { GenieCore } from "./lib/examples/core";

console.log(GenieCore.Maths.doubleNumber(3));

const game = new Phaser.Game(640, 480, Phaser.AUTO, "local-game-holder");
game.state.add("Startup", new GenieCore.States.Startup(), true);
game.state.start("Startup");

const gmi: Gmi = (window as any).getGMI({});
console.log(gmi);
