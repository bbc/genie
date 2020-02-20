/**
 * @copyright BBC 2018
 * @author BBC Children's D+E
 * @license Apache-2.0
 */
import fp from "../../../lib/lodash/fp/fp.js";
import { debugLayout } from "./layout-debug-draw.js";
import { BORDER_PAD_RATIO, GEL_MAX_ASPECT_RATIO, GEL_MIN_ASPECT_RATIO } from "../layout/calculate-metrics.js";
import { getMetrics } from "../scaler.js";

let debugDraw;

const makeToggle = (val, fn) => () => (debugDraw[val] = debugDraw[val] === fp.identity ? fn : fp.identity);

export function update() {
    this.debugGraphics.clear();
    debugDraw.layout(this);
    debugDraw.groups(this.debugGraphics);
    debugDraw.buttons(this.debugGraphics);
}

const getPaddingWidth = canvas => Math.max(canvas.width, canvas.height) * BORDER_PAD_RATIO;

//TODO delete - this is from other setup.
const createOuterPadding = screen => {
    const viewAspectRatio = screen.game.scale.parent.offsetWidth / screen.game.scale.parent.offsetHeight;
    const aspectRatio = Math.min(GEL_MAX_ASPECT_RATIO, viewAspectRatio);
    const size = aspectRatio <= 4 / 3 ? { width: 800, height: 600 } : { width: aspectRatio * 600, height: 600 };
    const pad = getPaddingWidth(size);

    return [
        screen.add.tileSprite(0, (pad - size.height) / 2, size.width, pad, "gelDebug.FF0030-hatch"),
        screen.add.tileSprite(0, (size.height - pad) / 2, size.width, pad, "gelDebug.FF0030-hatch"),
        screen.add.tileSprite((pad - size.width) / 2, 0, pad, size.height, "gelDebug.FF0030-hatch"),
        screen.add.tileSprite((size.width - pad) / 2, 0, pad, size.height, "gelDebug.FF0030-hatch"),
    ];
};

const create43Area = screen => {
    const areaWidth = GEL_MIN_ASPECT_RATIO * screen.game.canvas.height;
    const areaHeight = screen.game.canvas.height;

    return [screen.add.tileSprite(0, 0, areaWidth, areaHeight, "gelDebug.FFCC00-hatch")];
};

function create() {
    this.debugGraphics = this.add.graphics();
    const safeAreaDebugElements = [...create43Area(this), ...createOuterPadding(this)];

    setTileScale(safeAreaDebugElements);

    debugDraw = {
        layout: fp.identity,
        groups: fp.identity,
        buttons: fp.identity,
    };

    this.input.keyboard.addKey("q").on("up", makeToggle("layout", debugLayout));
    this.input.keyboard.addKey("w").on("up", makeToggle("groups", this.layout.debug.groups));
    this.input.keyboard.addKey("e").on("up", makeToggle("buttons", this.layout.debug.buttons));
}

const setTileScale = tiles => {
    const metrics = getMetrics();
    tiles.map(tile => tile.setTileScale(1 / metrics.scale));
};

function destroy() {
    this.input.keyboard.removeKey("q");
    this.input.keyboard.removeKey("w");
    this.input.keyboard.removeKey("e");
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
