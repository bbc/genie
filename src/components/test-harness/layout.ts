import { GEL_SAFE_FRAME_RATIO, GEL_MIN_RATIO_RHS, GEL_MIN_RATIO_LHS } from "../../core/scaler";

export function testHarnessDisplay(game: Phaser.Game, context: Context) {
    let graphicsGroup: Phaser.Group;
    let graphics: Phaser.Graphics;

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
        const [gameAreaWidth, gameAreaHeight] = gameAreaDimensions();

        graphics = game.add.graphics();
        graphics.beginFill(0x32cd32, 0.5);
        graphics.drawRect(0, 0, gameAreaWidth, gameAreaHeight);
        graphicsGroup.add(graphics);
        center(graphicsGroup);
        context.layout.addToBackground(graphicsGroup);
        context.qaMode.testHarnessLayoutDisplayed = true;
    }

    function hide() {
        graphicsGroup.destroy(true, true);
        context.qaMode.testHarnessLayoutDisplayed = false;
    }

    function center(group: Phaser.Group) {
        group.forEach((graphic: Phaser.Graphics) => {
            graphic.x = graphic.x - graphic.width * 0.5;
            graphic.y = graphic.y - graphic.height * 0.5;
        }, game);
    }

    function gameAreaDimensions() {
        let areaWidth;
        let areaHeight;
        const size = context.layout.getSize();

        if (game.width / game.height >= GEL_SAFE_FRAME_RATIO) {
            areaHeight = game.height / size.scale;
            areaWidth = areaHeight / GEL_MIN_RATIO_RHS * GEL_MIN_RATIO_LHS;
        } else {
            areaWidth = game.width / size.scale;
            areaHeight = areaWidth / GEL_MIN_RATIO_LHS * GEL_MIN_RATIO_RHS;
        }

        return [areaWidth, areaHeight];
    }
}
