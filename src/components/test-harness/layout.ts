import { GEL_MIN_RATIO_HEIGHT, GEL_MIN_RATIO_WIDTH } from "../../core/scaler";

export function createTestHarnessDisplay(game: Phaser.Game, context: Context) {
    let graphicsGroup: Phaser.Group;

    if (context.qaMode.active) {
        graphicsGroup = game.add.group();
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
        context.layout.addToBackground(graphicsGroup);
        context.qaMode.testHarnessLayoutDisplayed = true;
    }

    function drawGameArea() {
        const [gameAreaWidth, gameAreaHeight] = gameAreaDimensions();

        const graphics: Phaser.Graphics = game.add.graphics();
        graphics.beginFill(0x32cd32, 0.5);
        graphics.drawRect(-gameAreaWidth * 0.5, -gameAreaHeight * 0.5, gameAreaWidth, gameAreaHeight);
        graphicsGroup.add(graphics);
    }

    function drawOuterPadding() {
        const size = context.layout.getSize();
        const graphics: Phaser.Graphics = game.add.graphics();
        const paddingWidth = getPaddingWidth();
        const gameLeftEdge = -size.width * 0.5 / size.scale + paddingWidth * 0.5;
        const gameTopEdge = -size.height * 0.5 / size.scale + paddingWidth * 0.5;
        const gameRightEdge = size.width * 0.5 / size.scale - paddingWidth * 0.5;
        const gameBottomEdge = size.height * 0.5 / size.scale - paddingWidth * 0.5;

        console.log("paddingWidth: ", paddingWidth);
        console.log("screenWidth: ", window.innerWidth);
        console.log("screenHeight: ", window.innerHeight);

        graphics.lineStyle(paddingWidth, 0xffff00, 0.5);
        graphics.moveTo(gameLeftEdge, gameTopEdge);
        graphics.lineTo(gameRightEdge, gameTopEdge);
        graphics.lineTo(gameRightEdge, gameBottomEdge);
        graphics.lineTo(gameLeftEdge, gameBottomEdge);
        graphics.lineTo(gameLeftEdge, gameTopEdge);

        graphicsGroup.add(graphics);
    }

    function hide() {
        graphicsGroup.destroy(true, true);
        context.qaMode.testHarnessLayoutDisplayed = false;
    }

    function gameAreaDimensions() {
        const size = context.layout.getSize();
        const areaWidth = size.stageHeightPx / GEL_MIN_RATIO_HEIGHT * GEL_MIN_RATIO_WIDTH;
        const areaHeight = size.stageHeightPx;

        return [areaWidth, areaHeight];
    }

    function getPaddingWidth() {
        const size = context.layout.getSize();
        const gelPaddingWidthPercentage = 0.02;

        return Math.max(size.width, size.height) * gelPaddingWidthPercentage;
    }
}
