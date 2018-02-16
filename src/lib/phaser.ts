// Phaser and its dependencies don't conform to the module conventions that
// Webpack requires. This file makes them behave properly.
// Import order matters.

import "pixi.js";

import "p2";
import "phaser-ce";

export const Phaser = (window as any).Phaser;
export const PIXI = (window as any).PIXI;
export const p2Obj = (window as any).p2;
