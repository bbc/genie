/**
 * @copyright BBC 2018
 * @author BBC Children's D+E
 * @license Apache-2.0
 */
import fp from "../../../lib/lodash/fp/fp.js";
import { debugLayout } from "./layout-debug-draw.js";

let debugDraw;

const makeToggle = (val, fn) => () => (debugDraw[val] = debugDraw[val] === fp.identity ? fn : fp.identity);

export function update() {
    this.debugGraphics.clear();
    debugDraw.layout(this);
    debugDraw.groups(this.debugGraphics);
    debugDraw.buttons(this.debugGraphics);
}

const toggleCSS = () => document.body.classList.toggle("debug")

function create() {
    this.debugGraphics = this.add.graphics();

    debugDraw = {
        layout: fp.identity,
        groups: fp.identity,
        buttons: fp.identity,
    };

    this.input.keyboard.addKey("q").on("up", makeToggle("layout", debugLayout));
    this.input.keyboard.addKey("w").on("up", makeToggle("groups", this.layout.debug.groups));
    this.input.keyboard.addKey("e").on("up", makeToggle("buttons", this.layout.debug.buttons));
    this.input.keyboard.addKey("r").on("up", toggleCSS);
}

function destroy() {
    this.input.keyboard.removeKey("q");
    this.input.keyboard.removeKey("w");
    this.input.keyboard.removeKey("e");
    this.input.keyboard.removeKey("r");
}

export function addEvents() {
    this.events.on("create", create, this);
    this.events.on("update", update, this);

    this.events.once("shutdown", () => {
        this.events.off("create", create, this);
        this.events.off("update", update, this);
        destroy.call(this);
    });
}
