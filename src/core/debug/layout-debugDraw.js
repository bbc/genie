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

export const debugDrawLayout = screen => {
    if (!qaOn) {
        return;
    }
    draw43Area(screen);
    drawOuterPadding(screen);
};

let qaOn = false;

export const setupQaKey = screen => {
    const qaKey = screen.input.keyboard.addKey("q");
    const toggleQaMode = () => (qaOn = !qaOn);
    qaKey.on("up", toggleQaMode);
};
