/**
 * @copyright BBC 2020
 * @author BBC Children's D+E
 * @license Apache-2.0
 */
import { BORDER_PAD_RATIO, GEL_MAX_ASPECT_RATIO, GEL_MIN_ASPECT_RATIO } from "../layout/calculate-metrics.js";
import fp from "../../../lib/lodash/fp/fp.js";

const getPaddingWidth = canvas => Math.max(canvas.width, canvas.height) * BORDER_PAD_RATIO;

const draw43Area = screen => {
    const areaWidth = GEL_MIN_ASPECT_RATIO * screen.game.canvas.height;
    const areaHeight = screen.game.canvas.height;
    //screen.debugGraphics.fillStyle(0x32cd32, 0.5);

    //const tile = new Phaser.GameObjects.TileSprite(screen, 0, 0, 200, 200, "gelDebug.FF0030-hatch");

    //screen.debugGraphics.setTexture("gelDebug.FF0030-hatch", 0, 0);

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

export const debugLayout = fp.flow(
    draw43Area,
    drawOuterPadding,
);
