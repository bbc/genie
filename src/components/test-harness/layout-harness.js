import { GEL_MIN_RATIO_HEIGHT, GEL_MIN_RATIO_WIDTH } from "../../core/scaler.js";

export function createTestHarnessDisplay(game, context, layoutFactory) {
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
            console.log("Layout Test Harness Hidden");
        } else {
            show();
            console.log("Layout Test Harness Displayed");
        }
    }

    function show() {
        drawGameArea();
        drawOuterPadding();
        layoutFactory.addToBackground(graphicsBackgroundGroup);
        layoutFactory.addToForeground(graphicsForegroundGroup);
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
        const size = layoutFactory.getSize();
        const graphics = game.add.graphics();
        const paddingWidth = getPaddingWidth();
        const gameLeftEdge = 0 + paddingWidth * 0.5;
        const gameTopEdge = 0 + paddingWidth * 0.5;
        const gameRightEdge = size.width - paddingWidth * 0.5;
        const gameBottomEdge = size.height - paddingWidth * 0.5;

        console.log("paddingWidth: ", paddingWidth);
        console.log("screenWidth: ", window.innerWidth);
        console.log("screenHeight: ", window.innerHeight);

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
        const size = layoutFactory.getSize();
        const areaWidth = size.stageHeightPx / GEL_MIN_RATIO_HEIGHT * GEL_MIN_RATIO_WIDTH;
        const areaHeight = size.stageHeightPx;

        return [areaWidth, areaHeight];
    }

    function getPaddingWidth() {
        const size = layoutFactory.getSize();
        const gelPaddingWidthPercentage = 0.02;

        return Math.max(size.width, size.height) * gelPaddingWidthPercentage;
    }
}
