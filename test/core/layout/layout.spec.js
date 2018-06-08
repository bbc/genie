import { assert } from "chai";
import * as sinon from "sinon";

import * as Layout from "../../../src/core/layout/layout";
import * as Scaler from "../../../src/core/scaler.js";
import { Group } from "../../../src/core/layout/group";
import { GameAssets } from "../../../src/core/game-assets";

describe("Layout", () => {
    const sandbox = sinon.sandbox.create();
    const randomKey = "1d67c228681df6ad7f0b05f069cd087c442934ab5e4e86337d70c832e110c61b";
    let mockGame;
    let mockScaler;
    let mockSubscribe;
    let mockUnsubscribe;

    beforeEach(() => {
        sandbox.stub(Group.prototype, "addButton").returns({ onInputUp: { add: sandbox.spy() } });
        return initialiseGame().then(game => {
            mockGame = game;
            mockGame.world = {
                addChild: sandbox.spy(),
                children: [],
                shutdown: () => {},
            };
            mockGame.add = {
                sprite: sandbox.spy(() => new Phaser.Sprite(mockGame, 0, 0)),
                group: sandbox.spy(),
            };
            mockGame.renderer = { resolution: 1, destroy: () => {} };
            mockGame.input = {
                interactiveItems: { add: sandbox.spy() },
                reset: () => {},
                destroy: () => {},
            };

            mockScaler = {
                calculateMetrics: sandbox.stub().returns({
                    horizontals: {},
                    verticals: {},
                }),
                getSize: sandbox.spy(() => ({ width: 200, height: 200 })),
                onScaleChange: { add: sandbox.spy() },
            };

            mockUnsubscribe = sandbox.spy();
            mockSubscribe = sandbox.stub(Scaler.onScaleChange, "add").returns({ unsubscribe: mockUnsubscribe });

            GameAssets.sounds = {
                buttonClick: {
                    play: () => {},
                },
            };
        });
    });

    afterEach(() => {
        sandbox.restore();
        mockGame.destroy();
        GameAssets.sounds = {};
    });

    it("should add the correct number of GEL buttons for a given config", () => {
        const layout1 = Layout.create(mockGame, mockScaler, ["achievements"]);
        assert(Object.keys(layout1.buttons).length === 1);

        const layout2 = Layout.create(mockGame, mockScaler, ["play", "audioOff", "settings"]);
        assert(Object.keys(layout2.buttons).length === 3);

        const layout3 = Layout.create(mockGame, mockScaler, [
            "achievements",
            "exit",
            "howToPlay",
            "play",
            "audioOff",
            "settings",
        ]);
        assert(Object.keys(layout3.buttons).length === 6);
    });

    it("Should create 11 Gel Groups", () => {
        const layout = Layout.create(mockGame, mockScaler, []);
        assert(layout.root.children.length === 11);
    });

    it("Should add items to the correct group", () => {
        const layout = Layout.create(mockGame, mockScaler, []);
        const testElement = new Phaser.Sprite(mockGame, 0, 0);

        layout.addToGroup("middleRight", testElement);

        const groupsWithChildren = layout.root.children.filter(element => element.length);

        assert(groupsWithChildren.length === 1);
        assert(groupsWithChildren[0].name === "middleRight");
    });

    it("Should correctly insert an item using the index position property", () => {
        const layout = Layout.create(mockGame, mockScaler, []);
        const testElement = new Phaser.Sprite(mockGame, 0, 0);
        testElement.randomKey = randomKey;

        layout.addToGroup("topLeft", new Phaser.Sprite(mockGame, 0, 0));
        layout.addToGroup("topLeft", new Phaser.Sprite(mockGame, 0, 0));
        layout.addToGroup("topLeft", new Phaser.Sprite(mockGame, 0, 0));

        layout.addToGroup("topLeft", testElement, 2);

        const leftTopGroup = layout.root.children.find(element => element.name === "topLeft");
        assert(leftTopGroup.children[2].randomKey === randomKey);
    });

    it("Should set button callbacks using the 'setAction' method", () => {
        const layout = Layout.create(mockGame, mockScaler, ["achievements", "exit", "settings"]);

        layout.setAction("exit", "testAction");
        assert(layout.buttons.exit.onInputUp.add.calledWith("testAction"));
    });

    it("Should add buttons using the correct tab order", () => {
        const rndOrder = [
            "exit",
            "home",
            "achievements",
            "howToPlay",
            "play",
            "settings",
            "audioOff",
            "audioOn",
            "previous",
            "next",
            "continue",
            "restart",
            "back",
            "pause",
        ];
        const tabOrder = [
            "exit",
            "home",
            "back",
            "audioOff",
            "audioOn",
            "settings",
            "pause",
            "previous",
            "play",
            "next",
            "achievements",
            "restart",
            "continue",
            "howToPlay",
        ];

        const layout = Layout.create(mockGame, mockScaler, rndOrder);
        assert.deepEqual(Object.keys(layout.buttons), tabOrder);
    });

    it("subscribes to the scaler sizeChange signal", () => {
        Layout.create(mockGame, mockScaler, ["play"]);
        sinon.assert.calledOnce(mockSubscribe);
    });

    it("removeSignals method removes all signals on this Layout instance", () => {
        const layout = Layout.create(mockGame, mockScaler, ["play"]);
        layout.removeSignals();
        sinon.assert.calledOnce(mockUnsubscribe);
    });
});

function initialiseGame() {
    window.PhaserGlobal = window.PhaserGlobal || {};
    window.PhaserGlobal.hideBanner = true;
    return new Promise(resolve => {
        new Phaser.Game({
            state: new class extends Phaser.State {
                create() {
                    resolve(this.game);
                }
            }(),
        });
    });
}
