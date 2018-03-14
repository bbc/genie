// Phaser and its dependencies don't conform to the module conventions that
// Webpack requires. This file makes them behave properly.
// Import order matters.

import "pixi.js";

import "p2";
import "phaser-ce";

window.Phaser.Component.Core.skipTypeChecks = true;
export const Phaser = window.Phaser;
export const PIXI = window.PIXI;
export const p2Obj = window.p2;
