/**
 * @copyright BBC 2019
 * @author BBC Children's D+E
 * @license Apache-2.0
 */

import "jest-canvas-mock";
import "regenerator-runtime/runtime";

const phaser = require("../node_modules/phaser/dist/phaser.js");
global.Phaser = phaser;
global.document.body.innerHTML = "<div id='root'></div>";
