// Phaser and its dependencies don't conform to the module conventions that
// Webpack requires. This file makes them behave properly.

import "pixi.js";
import "p2";
import "phaser-ce";

const Phaser = (window as any).Phaser;
const PIXIObj = (window as any).PIXI;
const p2Obj = (window as any).p2;
