import "./lib/phaser";
import { doubleNumber } from "./lib/math";
import Startup from "./startup";

console.log(doubleNumber(6));
const game = new Phaser.Game(1920, 1080, Phaser.AUTO, "local-game-holder");
game.state.add("Startup", new Startup(), true);
game.state.start("Startup");
