/**
 * @copyright BBC 2018
 * @author BBC Children's D+E
 * @license Apache-2.0
 */
import fp from "../../../lib/lodash/fp/fp.js";
import * as debugLayout from "./layout-debug-draw.js";
import * as safeAreaLayout from "./safe-area-draw.js";
import { createMeasure } from "./measure/measure.js";

const makeToggle = (val, fn, scene) => () =>
    (scene.debug.draw[val] = scene.debug.draw[val] === fp.identity ? fn : fp.identity);

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

const getUrlForKey = key =>
    key === "debug"
        ? "debug/config.json5"
        : key.startsWith("debug-")
        ? `debug/examples/${key.substr(6)}.json5`
        : `THEME/${key}/config.json5`;

function create() {
    this.debug = {
        graphics: this.add.graphics(),
        container: this.add.container(),
        draw: {
            groups: fp.identity,
            buttons: fp.identity,
        },
    };

    this.debug.container.setDepth(1000);

    this.debug.draw.layout = debugLayout.create(this.debug.container);
    this.debug.draw.measure = createMeasure(this.debug.container);
    this.debug.draw.safeArea = safeAreaLayout.create(this.debug.container);

    const fileLabel = {
        x: -400,
        y: -300,
        text: `config: ${getUrlForKey(this.scene.key)}`,
    };

    const labels = this.config.debugLabels || [];

    fp.map(label => this.add.text(label.x || 0, label.y || 0, label.text, debugStyle), labels.concat(fileLabel));

    this.input.keyboard.addKey("q").on("up", this.debug.draw.layout);
    this.layout && this.input.keyboard.addKey("w").on("up", makeToggle("groups", this.layout.debug.groups, this));
    this.layout && this.input.keyboard.addKey("e").on("up", makeToggle("buttons", this.layout.debug.buttons, this));
    this.input.keyboard.addKey("r").on("up", toggleCSS);
    this.input.keyboard.addKey("t").on("up", this.debug.draw.measure);
    this.navigation.debug && this.input.keyboard.addKey("y").on("up", this.navigation.debug.bind(this));
    this.input.keyboard.addKey("u").on("up", this.debug.draw.safeArea);
    window.__debug.screen = this;
}

const shutdown = scene =>
    ["q", "w", "e", "r", "t", "y", "u"].forEach(scene.input.keyboard.removeKey, scene.input.keyboard);

export function update() {
    if (!this.debug) return;
    this.debug.graphics.clear();
    this.debug.draw.groups(this.debug.graphics);
    this.debug.draw.buttons(this.debug.graphics);
}

export const addEvents = scene => {
    scene.events.on("create", create, scene);
    scene.events.on("update", update, scene);

    scene.events.once("shutdown", () => {
        scene.events.off("create", create, scene);
        scene.events.off("update", update, scene);
        shutdown(scene);
    });
};
