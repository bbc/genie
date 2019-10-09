/**
 * @copyright BBC 2018
 * @author BBC Children's D+E
 * @license Apache-2.0
 */
import { onScaleChange } from "../scaler.js";
import { GEL_MIN_ASPECT_RATIO, GEL_MAX_ASPECT_RATIO } from "../../core/layout/calculate-metrics.js";

export function createTestHarnessDisplay(scene) {
    let gameAreaGraphics;
    let outerPaddingGraphics;
    let signal;

    if (window.__qaMode) {
        const qaKey = scene.input.keyboard.addKey("q");
        const toggleQaMode = () => toggle(scene);
        qaKey.on("up", toggleQaMode);
        scene.events.on("destroy", () => {
            scene.input.keyboard.removeKey("q");
        });
    }

    function toggle(scene) {
        if (window.__qaMode.testHarnessLayoutDisplayed) {
            hide(scene);
            console.log("Layout Test Harness Hidden"); // eslint-disable-line no-console
        } else {
            show(scene);
            console.log("Layout Test Harness Displayed"); // eslint-disable-line no-console
        }
    }

    function show(scene) {
        drawGameArea(scene);
        drawOuterPadding(scene);
        window.__qaMode.testHarnessLayoutDisplayed = true;
        signal = onScaleChange.add(onResize.bind(this, scene));
    }

    function drawGameArea(scene) {
        const areaWidth = GEL_MIN_ASPECT_RATIO * scene.game.canvas.height;
        const areaHeight = scene.game.canvas.height;
        gameAreaGraphics = scene.add.graphics({
            fillStyle: { color: 0x32cd32, alpha: 0.5 },
            add: true,
        });

        const rectangle = new Phaser.Geom.Rectangle(-areaWidth * 0.5, -areaHeight * 0.5, areaWidth, areaHeight);
        gameAreaGraphics.fillRectShape(rectangle);
    }

    function drawOuterPadding(scene) {
        const aspectRatio = Math.min(
            GEL_MAX_ASPECT_RATIO,
            scene.game.scale.parent.offsetWidth / scene.game.scale.parent.offsetHeight,
        );
        const size = aspectRatio <= 4 / 3 ? { width: 800, height: 600 } : { width: aspectRatio * 600, height: 600 };
        const paddingWidth = getPaddingWidth(size);

        outerPaddingGraphics = scene.add.graphics({
            lineStyle: {
                width: paddingWidth,
                color: 0xffff00,
                alpha: 0.5,
            },
        });

        outerPaddingGraphics.strokeRect(
            (paddingWidth - size.width) / 2,
            (paddingWidth - size.height) / 2,
            size.width - paddingWidth,
            size.height - paddingWidth,
        );
    }

    function onResize(scene) {
        hide();
        show(scene);
    }

    function hide() {
        gameAreaGraphics.destroy();
        outerPaddingGraphics.destroy();
        window.__qaMode.testHarnessLayoutDisplayed = false;
        signal.unsubscribe();
    }

    function getPaddingWidth(canvas) {
        const gelPaddingWidthPercentage = 0.02;
        return Math.max(canvas.width, canvas.height) * gelPaddingWidthPercentage;
    }
}
