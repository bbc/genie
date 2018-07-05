//import { assert } from "chai";
import * as sinon from "sinon";
import * as GameSound from "../../src/core/game-sound";
import * as Game from "../fake/game.js";

describe("Game Sound", () => {
    const sandbox = sinon.sandbox.create();
    const originalAssets = GameSound.Assets;

    beforeEach(() => {
        // set up stuff
    });

    afterEach(() => {
        sandbox.restore();
        GameSound.Assets = originalAssets;
    });

    it("can set the button click sound", () => {
        const game = Game.Stub;
        const addAudioSpy = sandbox.spy(game.add, "audio");
        GameSound.setButtonClick(game, "test/button-click");
        sinon.assert.calledWith(addAudioSpy, "test/button-click");
    });

    it("can set the background music", () => {
        const game = Game.Stub;
        const addAudioSpy = sandbox.spy(game.add, "audio");
        GameSound.setBackgroundMusic(game, "test/music");
        sinon.assert.calledWith(addAudioSpy, "test/music");
    });
});
