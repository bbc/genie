import { assert } from "chai";
import * as sinon from "sinon";
import { GameAssets, initGameAssets } from "../../src/core/game-assets";

describe("Game Assets", () => {
    const sandbox = sinon.createSandbox();

    let addAudioStub;
    let mockGame;

    beforeEach(() => {
        addAudioStub = sandbox.stub().returns("Click Sound");
        mockGame = {
            add: {
                audio: addAudioStub,
            },
        };
    });

    afterEach(() => {
        GameAssets.sounds = {};
        sandbox.restore();
    });

    describe("initGameAssets()", () => {
        it("Adds the game assets to the Phaser game and Game Assets object", () => {
            initGameAssets(mockGame);
            sinon.assert.calledWith(addAudioStub, "loadscreen.buttonClick");
            assert.equal(
                GameAssets.sounds.buttonClick,
                "Click Sound",
                "Expected button click asset to be added to GameAssets",
            );
        });
    });

    describe("#GameAssets", () => {
        it("returns object containing sounds", () => {
            assert.isObject(GameAssets.sounds);
        });
    });
});
