export interface StubbedGlobalContextState {
    qaMode: {
        active: boolean,
        testHarnessLayoutDisplayed: boolean
    }
}

export function testHarnessDisplay(game: Phaser.Game, globalContext: StubbedGlobalContextState) {
    let graphicsGroup: Phaser.Group;
    let graphics: Phaser.Graphics;

    return {
        create
    };

    function create() {
        if (globalContext.qaMode) {
            graphicsGroup = game.add.group();
            const qaKey = game.input.keyboard.addKey(Phaser.Keyboard.Q);
            qaKey.onUp.add(toggle, game);
        }
    }

    function toggle() {
        if (globalContext.qaMode.testHarnessLayoutDisplayed) {
            hide();
        } else {
            show();
        }
    }

    function show() {
        graphics = game.add.graphics();
        graphics.lineStyle(2, 0xFFFFFF, 1);
        graphics.drawRect(200, 200, 250, 250);
        graphicsGroup.add(graphics);
        globalContext.qaMode.testHarnessLayoutDisplayed = true;
    }

    function hide() {
        graphicsGroup.destroy(true, true);
        globalContext.qaMode.testHarnessLayoutDisplayed = false;
    }
}
