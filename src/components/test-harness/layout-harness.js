import { GEL_MIN_ASPECT_RATIO } from "../../core/layout/calculate-metrics.js";

export function createTestHarnessDisplay(game, context, scene) {
    let graphicsBackgroundGroup;
    let graphicsForegroundGroup;

    if (context.qaMode.active) {
        graphicsBackgroundGroup = game.add.group();
        graphicsForegroundGroup = game.add.group();
        const qaKey = game.input.keyboard.addKey(Phaser.Keyboard.Q);
        qaKey.onUp.add(toggle, game);
    }

    function toggle() {
        if (context.qaMode.testHarnessLayoutDisplayed) {
            hide();
            console.log("Layout Test Harness Hidden"); // eslint-disable-line no-console
        } else {
            show();
            console.log("Layout Test Harness Displayed"); // eslint-disable-line no-console
        }
    }

    function show() {
        drawGameArea();
        drawOuterPadding();
        scene.addToBackground(graphicsBackgroundGroup);
        scene.addToForeground(graphicsForegroundGroup);
        context.qaMode.testHarnessLayoutDisplayed = true;
    }

    function drawGameArea() {
        const [gameAreaWidth, gameAreaHeight] = gameAreaDimensions();

        const graphics = game.add.graphics();
        graphics.beginFill(0x32cd32, 0.5);
        graphics.drawRect(-gameAreaWidth * 0.5, -gameAreaHeight * 0.5, gameAreaWidth, gameAreaHeight);
        graphicsBackgroundGroup.add(graphics);
    }

    function drawOuterPadding() {
        const metrics = scene.calculateMetrics();
        const graphics = game.add.graphics();
        const paddingWidth = getPaddingWidth();
        const gameLeftEdge = 0 + paddingWidth * 0.5;
        const gameTopEdge = 0 + paddingWidth * 0.5;
        const gameRightEdge = metrics.width - paddingWidth * 0.5;
        const gameBottomEdge = metrics.height - paddingWidth * 0.5;

        console.log("paddingWidth: ", paddingWidth); // eslint-disable-line no-console
        console.log("screenWidth: ", window.innerWidth); // eslint-disable-line no-console
        console.log("screenHeight: ", window.innerHeight); // eslint-disable-line no-console

        graphics.lineStyle(paddingWidth, 0xffff00, 0.5);
        graphics.moveTo(gameLeftEdge, gameTopEdge);
        graphics.lineTo(gameRightEdge, gameTopEdge);
        graphics.lineTo(gameRightEdge, gameBottomEdge);
        graphics.lineTo(gameLeftEdge, gameBottomEdge);
        graphics.lineTo(gameLeftEdge, gameTopEdge);

        graphicsForegroundGroup.add(graphics);
    }

    function hide() {
        graphicsBackgroundGroup.destroy(true, true);
        graphicsForegroundGroup.destroy(true, true);
        context.qaMode.testHarnessLayoutDisplayed = false;
    }

    function gameAreaDimensions() {
        const metrics = scene.calculateMetrics();
        const areaWidth = GEL_MIN_ASPECT_RATIO * metrics.stageHeight;
        const areaHeight = metrics.stageHeight;

        return [areaWidth, areaHeight];
    }

    function getPaddingWidth() {
        const metrics = scene.calculateMetrics();
        const gelPaddingWidthPercentage = 0.02;

        return Math.max(metrics.width, metrics.height) * gelPaddingWidthPercentage;
    }
}
