import "./lib/phaser";
import * as _ from "lodash";
import { GenieCore } from "./lib/examples/core";

// library function test
console.log(GenieCore.Maths.doubleNumber(3));

//Phaser + library class test
const game = new Phaser.Game(640, 480, Phaser.AUTO, "local-game-holder");
game.state.add("Startup", new GenieCore.States.Startup(), true);
game.state.start("Startup");

//GMI test
const gmi: Gmi = (window as any).getGMI({});
console.log(gmi);


//lodash test
const array = [1, 2, 3];
_.fill(array, 6);
console.log(array);
