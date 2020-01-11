/**
 * @copyright BBC 2018
 * @author BBC Children's D+E
 * @license Apache-2.0
 */
import { GEL_MIN_ASPECT_RATIO, GEL_MAX_ASPECT_RATIO, BORDER_PAD_RATIO } from "../../core/layout/calculate-metrics.js";
import fp from "../../../lib/lodash/fp/fp.js";

const getPaddingWidth = canvas => Math.max(canvas.width, canvas.height) * BORDER_PAD_RATIO;

const draw43Area = screen => {
    const areaWidth = GEL_MIN_ASPECT_RATIO * screen.game.canvas.height;
    const areaHeight = screen.game.canvas.height;
    screen.debugGraphics.fillStyle(0x32cd32, 0.5);

    const rectangle = new Phaser.Geom.Rectangle(-areaWidth * 0.5, -areaHeight * 0.5, areaWidth, areaHeight);
    screen.debugGraphics.fillRectShape(rectangle);

    return screen;
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

    return screen;
};

const debugLayout = fp.flow(
    draw43Area,
    drawOuterPadding,
);

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
