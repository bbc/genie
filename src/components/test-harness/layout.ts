import { GEL_MIN_RATIO_LHS, GEL_MIN_RATIO_RHS, GEL_SAFE_FRAME_RATIO } from "../../core/scaler";

export function testHarnessDisplay(game: Phaser.Game, context: Context) {
    let graphicsGroup: Phaser.Group;

    return {
        create,
    };

    function create() {
        if (context.qaMode.active) {
            graphicsGroup = game.add.group();
            const qaKey = game.input.keyboard.addKey(Phaser.Keyboard.Q);
            qaKey.onUp.add(toggle, game);
        }
    }

    function toggle() {
        if (context.qaMode.testHarnessLayoutDisplayed) {
            hide();
        } else {
            show();
        }
    }

    function show() {
        drawGameArea();
        drawOuterPadding();
        context.qaMode.testHarnessLayoutDisplayed = true;
    }

    function drawGameArea() {
        const [gameAreaWidth, gameAreaHeight] = gameAreaDimensions();

        const graphics: Phaser.Graphics = game.add.graphics();
        graphics.beginFill(0x32cd32, 0.5);
        graphics.drawRect(-gameAreaWidth * 0.5, -gameAreaHeight * 0.5, gameAreaWidth, gameAreaHeight);
        graphicsGroup.add(graphics);
        context.layout.addToBackground(graphicsGroup);
    }

    function drawOuterPadding() {
        const size = context.layout.getSize();
        const graphics: Phaser.Graphics = game.add.graphics();
        const paddingWidth = getPaddingWidth();
        const gameLeftEdge = -size.width * 0.5 / size.scale + paddingWidth * 0.5;
        const gameTopEdge = -size.height * 0.5 / size.scale + paddingWidth * 0.5;
        const gameRightEdge = size.width * 0.5 / size.scale - paddingWidth * 0.5;
        const gameBottomEdge = size.height * 0.5 / size.scale - paddingWidth * 0.5;

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
        const areaWidth = size.stageHeightPx / GEL_MIN_RATIO_RHS * GEL_MIN_RATIO_LHS;
        const areaHeight = size.stageHeightPx;

        return [areaWidth, areaHeight];
    }

    function getPaddingWidth() {
        const size = context.layout.getSize();
        const landscape = size.width > size.height;
        const gelPaddingWidthPercentage = 0.02;
        let paddingWidth: number;

        if (landscape) {
            paddingWidth = size.width * gelPaddingWidthPercentage;
        } else {
            paddingWidth = size.height * gelPaddingWidthPercentage;
        }

        return paddingWidth;
    }
}
