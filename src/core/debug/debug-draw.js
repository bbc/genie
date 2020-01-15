/**
 * @copyright BBC 2018
 * @author BBC Children's D+E
 * @license Apache-2.0
 */
import fp from "../../../lib/lodash/fp/fp.js";
import { debugLayout } from "./layout-debug-draw.js";

let draw;

export const debugDraw = () => {
    draw.layout();
    draw.groups();
    draw.buttons();
};

const makeToggle = (val, fn) => () => (draw[val] = draw[val] === fp.identity ? fn : fp.identity);

export const setupDebugKeys = screen => {
    draw = {
        layout: fp.identity,
        groups: fp.identity,
        buttons: fp.identity,
    };

    screen.input.keyboard.addKey("q").on(
        "up",
        makeToggle("layout", () => {
            debugLayout(screen);
        }),
    );

    screen.input.keyboard.addKey("w").on(
        "up",
        makeToggle("groups", () => {
            screen.layout.debug.groups(screen.debugGraphics);
        }),
    );

    screen.input.keyboard.addKey("e").on(
        "up",
        makeToggle("buttons", () => {
            screen.layout.debug.buttons(screen.debugGraphics);
        }),
    );
};
