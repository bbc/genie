/**
 * @copyright BBC 2019
 * @author BBC Children's D+E
 * @license Apache-2.0
 */

import "jest-canvas-mock";

const phaser = require("../node_modules/phaser/dist/phaser.js");
global.Phaser = phaser;

const jsdom = require("jsdom");
const { JSDOM } = jsdom;
const documentHTML = "<!doctype html><html><body><div id='root'></div></body></html>";
global.document = new JSDOM(documentHTML);
