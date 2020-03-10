/**
 * @copyright BBC 2018
 * @author BBC Children's D+E
 * @license Apache-2.0
 */
import fp from "../../../lib/lodash/fp/fp.js";
import * as debugLayout from "./layout-debug-draw.js";

const makeToggle = (val, fn, scene) => () =>
    (scene.debug.draw[val] = scene.debug.draw[val] === fp.identity ? fn : fp.identity);

export function update() {
    this.debug.graphics.clear();
    this.debug.draw.groups(this.debug.graphics);
    this.debug.draw.buttons(this.debug.graphics);
}

const toggleCSS = () => document.body.classList.toggle("debug");

const debugStyle = {
    fontFamily: '"Droid Sans Mono Dotted"',
    fontSize: 12,
    resolution: 2,
    backgroundColor: "rgba(0,0,0,0.5)",
    padding: {
        left: 6,
        right: 6,
        top: 4,
        bottom: 4,
    },
};

function create() {
    this.debug = {
        graphics: this.add.graphics(),
        container: this.add.container(),
        draw: {
            groups: fp.identity,
            buttons: fp.identity,
        },
    };

    this.debug.draw.layout = debugLayout.create(this.debug.container);
    this.debug.container.visible = false;

    fp.map(label => this.add.text(label.x || 0, label.y || 0, label.text, debugStyle), this.context.theme.debugLabels);

    this.input.keyboard.addKey("q").on("up", () => (this.debug.container.visible = !this.debug.container.visible));
    this.input.keyboard.addKey("w").on("up", makeToggle("groups", this.layout.debug.groups, this));
    this.input.keyboard.addKey("e").on("up", makeToggle("buttons", this.layout.debug.buttons, this));
    this.input.keyboard.addKey("r").on("up", toggleCSS);
    this.navigation.debug && this.input.keyboard.addKey("t").on("up", this.navigation.debug.bind(this));
}

const shutdown = scene => {
    scene.input.keyboard.removeKey("q");
    scene.input.keyboard.removeKey("w");
    scene.input.keyboard.removeKey("e");
    scene.input.keyboard.removeKey("r");
    scene.input.keyboard.removeKey("t");

    scene.debug.draw.layout.shutdown();
};

export const addEvents = scene => {
    scene.events.on("create", create, scene);
    scene.events.on("update", update, scene);

    scene.events.once("shutdown", () => {
        scene.events.off("create", create, scene);
        scene.events.off("update", update, scene);
        shutdown(scene);
    });
};
