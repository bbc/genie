/**
 * @copyright BBC 2018
 * @author BBC Children's D+E
 * @license Apache-2.0
 */
import { GEL_MIN_ASPECT_RATIO, GEL_MAX_ASPECT_RATIO, BORDER_PAD_RATIO } from "../../core/layout/calculate-metrics.js";

const getPaddingWidth = canvas => Math.max(canvas.width, canvas.height) * BORDER_PAD_RATIO;

const draw43Area = screen => {
    const areaWidth = GEL_MIN_ASPECT_RATIO * screen.game.canvas.height;
    const areaHeight = screen.game.canvas.height;
    screen.debugGraphics.fillStyle(0x32cd32, 0.5);

    const rectangle = new Phaser.Geom.Rectangle(-areaWidth * 0.5, -areaHeight * 0.5, areaWidth, areaHeight);
    screen.debugGraphics.fillRectShape(rectangle);
};

const drawOuterPadding = screen => {
    const viewAspectRatio = screen.game.scale.parent.offsetWidth / screen.game.scale.parent.offsetHeight;
    const aspectRatio = Math.min(GEL_MAX_ASPECT_RATIO, viewAspectRatio);
    const size = aspectRatio <= 4 / 3 ? { width: 800, height: 600 } : { width: aspectRatio * 600, height: 600 };
    const paddingWidth = getPaddingWidth(size);

    screen.debugGraphics.lineStyle(paddingWidth, 0xffff00, 0.5);

    screen.debugGraphics.strokeRect(
        (paddingWidth - size.width) / 2,
        (paddingWidth - size.height) / 2,
        size.width - paddingWidth,
        size.height - paddingWidth,
    );
};

const debugDrawLayout = screen => {
    draw43Area(screen);
    drawOuterPadding(screen);
};

const noop = () => {};

let draw = {
    layout: noop,
    groups: noop,
    buttons: noop,
};

export const debugDraw = () => {
    draw.layout();
    draw.groups();
    draw.buttons();
}

const makeToggle = (val, fn) => () => draw[val] = draw[val] === noop ? fn : noop;

export const setupDebugKeys = screen => {
    const qKey = screen.input.keyboard.addKey("q");
    qKey.on("up", makeToggle("layout", () => {debugDrawLayout(screen)}));

    const wKey = screen.input.keyboard.addKey("w");
    wKey.on("up", makeToggle("groups", () => {screen.layout.debug.groups(screen.debugGraphics)}));

    const eKey = screen.input.keyboard.addKey("e");
    eKey.on("up", makeToggle("buttons", () => {screen.layout.debug.buttons(screen.debugGraphics)}));
};
