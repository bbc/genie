/**
 * @copyright BBC 2018
 * @author BBC Children's D+E
 * @license Apache-2.0
 */
import { assert } from "chai";
import * as sinon from "sinon";

import * as Layout from "../../../src/core/layout/layout.js";
import * as Scaler from "../../../src/core/scaler.js";
import { Group } from "../../../src/core/layout/group.js";
import * as GameSound from "../../../src/core/game-sound.js";
import * as gmiModule from "../../../src/core/gmi/gmi.js";
import * as settingsIcons from "../../../src/core/layout/settings-icons.js";

describe("Layout", () => {
    const sandbox = sinon.createSandbox();
    const randomKey = "1d67c228681df6ad7f0b05f069cd087c442934ab5e4e86337d70c832e110c61b";
    let mockGame;
    let mockGmi;
    let mockSubscribe;
    let mockUnsubscribe;
    let settingsIconsUnsubscribeSpy;
    const mockMetrics = {
        horizontals: {},
        safeHorizontals: {},
        verticals: {},
    };

    beforeEach(() => {
        mockGmi = {
            getAllSettings: sandbox.stub().returns({ audio: true, motion: true }),
            shouldDisplayMuteButton: true,
            shouldShowExitButton: true,
        };

        settingsIconsUnsubscribeSpy = sandbox.spy();
        sandbox.replace(gmiModule, "gmi", mockGmi);
        sandbox.stub(settingsIcons, "create").returns({ unsubscribe: settingsIconsUnsubscribeSpy });
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

            mockUnsubscribe = sandbox.spy();
            mockSubscribe = sandbox.stub(Scaler.onScaleChange, "add").returns({ unsubscribe: mockUnsubscribe });

            GameSound.Assets.buttonClick = {
                play: () => {},
            };
        });
    });

    afterEach(() => {
        sandbox.restore();
        mockGame.destroy();
        GameSound.Assets.backgroundMusic = undefined;
        GameSound.Assets.buttonClick = undefined;
    });

    it("should add the correct number of GEL buttons for a given config", () => {
        const layout1 = Layout.create(mockGame, mockMetrics, ["achievements"]);
        assert(Object.keys(layout1.buttons).length === 1);

        const layout2 = Layout.create(mockGame, mockMetrics, ["play", "audio", "settings"]);
        assert(Object.keys(layout2.buttons).length === 3);

        const layout3 = Layout.create(mockGame, mockMetrics, [
            "achievements",
            "exit",
            "howToPlay",
            "play",
            "audio",
            "settings",
        ]);
        assert(Object.keys(layout3.buttons).length === 6);
    });

    it("should skip the creation of the mute button when gmi.shouldDisplayMuteButton is false", () => {
        mockGmi.shouldDisplayMuteButton = false;

        const layout = Layout.create(mockGame, mockMetrics, [
            "achievements",
            "exit",
            "howToPlay",
            "play",
            "audio",
            "settings",
        ]);

        assert.notExists(layout.buttons.audio);
    });

    it("should skip the creation of the exit button when gmi.shouldShowExitButton is false", () => {
        mockGmi.shouldShowExitButton = false;

        const layout = Layout.create(mockGame, mockMetrics, [
            "achievements",
            "exit",
            "howToPlay",
            "play",
            "audio",
            "settings",
        ]);

        assert.notExists(layout.buttons.exit);
    });

    it("Should create 11 Gel Groups", () => {
        const layout = Layout.create(mockGame, mockMetrics, []);
        assert(layout.root.children.length === 11);
    });

    it("Should add items to the correct group", () => {
        const layout = Layout.create(mockGame, mockMetrics, []);
        const testElement = new Phaser.Sprite(mockGame, 0, 0);

        layout.addToGroup("middleRight", testElement);

        const groupsWithChildren = layout.root.children.filter(element => element.length);

        assert(groupsWithChildren.length === 1);
        assert(groupsWithChildren[0].name === "middleRight");
    });

    it("Should correctly insert an item using the index position property", () => {
        const layout = Layout.create(mockGame, mockMetrics, []);
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
        const layout = Layout.create(mockGame, mockMetrics, ["achievements", "exit", "settings"]);

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
            "audio",
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
            "audio",
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

        const layout = Layout.create(mockGame, mockMetrics, rndOrder);
        assert.deepEqual(Object.keys(layout.buttons), tabOrder);
    });

    it("Should reset the groups after they have been added to the layout", () => {
        const groupResetStub = sandbox.stub(Group.prototype, "reset").withArgs(mockMetrics);
        Layout.create(mockGame, mockMetrics, []);
        sinon.assert.callCount(groupResetStub, 11);
    });

    it("subscribes to the scaler sizeChange signal", () => {
        Layout.create(mockGame, mockMetrics, ["play"]);
        sinon.assert.calledOnce(mockSubscribe);
    });

    it("removeSignals method removes all signals on this Layout instance", () => {
        const layout = Layout.create(mockGame, mockMetrics, ["play"]);
        layout.removeSignals();
        sinon.assert.calledOnce(mockUnsubscribe);
        sinon.assert.calledOnce(settingsIconsUnsubscribeSpy);
    });

    it("creates the settings icons", () => {
        Layout.create(mockGame, mockMetrics, ["play"]);
        sinon.assert.calledOnce(settingsIcons.create);
        assert.equal(typeof settingsIcons.create.getCall(0).args[0], "object");
        assert.deepEqual(settingsIcons.create.getCall(0).args[1], ["play"]);
    });
});

function initialiseGame() {
    window.PhaserGlobal = window.PhaserGlobal || {};
    window.PhaserGlobal.hideBanner = true;
    return new Promise(resolve => {
        new Phaser.Game({
            state: new (class extends Phaser.State {
                create() {
                    resolve(this.game);
                }
            })(),
        });
    });
}
