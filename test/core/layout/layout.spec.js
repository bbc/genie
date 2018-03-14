import { expect } from "chai";
import * as sinon from "sinon";

import * as ButtonFactory from "../../../src/core/layout/button-factory";
import { Layout } from "../../../src/core/layout/layout";

describe("Layout", () => {
    const randomKey = "1d67c228681df6ad7f0b05f069cd087c442934ab5e4e86337d70c832e110c61b";
    let mockGame;
    let mockScaler;

    beforeEach(() => {
        return initialiseGame().then(game => {
            mockGame = game;
            mockGame.world = {
                addChild: sinon.spy(),
                children: [],
                shutdown: () => {},
            };
            mockGame.add = {
                sprite: sinon.spy(() => new Phaser.Sprite(mockGame, 0, 0)),
                group: sinon.spy(),
            };
            mockGame.renderer = { resolution: 1, destroy: () => {} };
            mockGame.input = {
                interactiveItems: { add: sinon.spy() },
                reset: () => {},
                destroy: () => {},
            };

            mockScaler = {
                getSize: sinon.spy(() => ({ width: 200, height: 200 })),
                onScaleChange: { add: sinon.spy() },
            };
        });
    });

    afterEach(() => mockGame.destroy());

    //Currently suffers from a "game instanceof Phaser.Game" typecheck issue
    it("should add the correct number of GEL buttons for a given config", () => {
        const layout1 = new Layout(mockGame, mockScaler, ["achievements"]);
        expect(Object.keys(layout1.buttons).length).to.eql(1);

        const layout2 = new Layout(mockGame, mockScaler, ["play", "audioOff", "settings"]);
        expect(Object.keys(layout2.buttons).length).to.eql(3);

        const layout3 = new Layout(mockGame, mockScaler, [
            "achievements",
            "exit",
            "howToPlay",
            "play",
            "audioOff",
            "settings",
        ]);
        expect(Object.keys(layout3.buttons).length).to.eql(6);
    });

    it("Should create 9 Gel Groups", () => {
        const layout = new Layout(mockGame, mockScaler, []);
        expect(layout.root.children.length).to.eql(9);
    });

    it("Should add items to the correct group", () => {
        const layout = new Layout(mockGame, mockScaler, []);
        const testElement = new Phaser.Sprite(mockGame, 0, 0);

        layout.addToGroup("middleRight", testElement);

        const groupsWithChildren = layout.root.children.filter((element) => element.length);

        expect(groupsWithChildren.length).to.eql(1);
        expect(groupsWithChildren[0].name).to.eql("middleRight");
    });

    it("Should correctly insert an item using the index position property", () => {
        const layout = new Layout(mockGame, mockScaler, []);
        const testElement = new Phaser.Sprite(mockGame, 0, 0);
        testElement.randomKey = randomKey;

        layout.addToGroup("topLeft", new Phaser.Sprite(mockGame, 0, 0));
        layout.addToGroup("topLeft", new Phaser.Sprite(mockGame, 0, 0));
        layout.addToGroup("topLeft", new Phaser.Sprite(mockGame, 0, 0));

        layout.addToGroup("topLeft", testElement, 2);

        const leftTopGroup = layout.root.children.find((element) => element.name === "topLeft");
        expect(leftTopGroup.children[2].randomKey).to.eql(randomKey);
    });

    //Currently suffers from a "game instanceof Phaser.Game" typecheck issue
    it("Should set button callbacks using the 'setAction' method", () => {
        const layout = new Layout(mockGame, mockScaler, ["achievements", "exit", "settings"]);

        const testAction = sinon.spy();

        layout.setAction("exit", testAction);

        layout.buttons.exit.events.onInputUp.dispatch({}, {});
        layout.buttons.exit.events.onInputUp.dispatch({}, {});
        layout.buttons.exit.events.onInputUp.dispatch({}, {});

        expect(testAction.callCount).to.eql(3);
    });
});

function initialiseGame() {
    return new Promise(resolve => {
        // tslint:disable-next-line:no-unused-expression
        new Phaser.Game({
            state: new class extends Phaser.State {
                create() {
                    resolve(this.game);
                }
            }(),
        });
    });
}
