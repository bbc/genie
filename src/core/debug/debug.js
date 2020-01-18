/**
 * @copyright BBC 2018
 * @author BBC Children's D+E
 * @license Apache-2.0
 */
import fp from "../../../lib/lodash/fp/fp.js";
import { debugLayout } from "./layout-debug-draw.js";

let debugDraw;

export function draw() {
    this.debugGraphics.clear();
    debugDraw.layout(this);
    debugDraw.groups(this.debugGraphics);
    debugDraw.buttons(this.debugGraphics);
}

const makeToggle = (val, fn) => () => (debugDraw[val] = debugDraw[val] === fp.identity ? fn : fp.identity);

export function create() {
    this.debugGraphics = this.add.graphics();

    debugDraw = {
        layout: fp.identity,
        groups: fp.identity,
        buttons: fp.identity,
    };

    this.input.keyboard.addKey("q").on("up", makeToggle("layout", debugLayout));
    this.input.keyboard.addKey("w").on("up", makeToggle("groups", this.layout.debug.groups));
    this.input.keyboard.addKey("e").on("up", makeToggle("buttons", this.layout.debug.buttons));
}

export function destroy() {
    this.input.keyboard.removeKey("q");
    this.input.keyboard.removeKey("w");
    this.input.keyboard.removeKey("e");
}
