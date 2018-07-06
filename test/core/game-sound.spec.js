import * as sinon from "sinon";
import * as GameSound from "../../src/core/game-sound";
import * as Game from "../fake/game.js";

describe("Game Sound", () => {
    const sandbox = sinon.sandbox.create();

    afterEach(() => {
        sandbox.restore();
        GameSound.Assets.backgroundMusic = undefined;
        GameSound.Assets.buttonClick = undefined;
    });

    it("sets the button click sound", () => {
        const game = Game.Stub;
        const addAudioSpy = sandbox.spy(game.add, "audio");
        GameSound.setButtonClick(game, "test/button-click");
        sinon.assert.calledWith(addAudioSpy, "test/button-click");
    });

    describe("when no music is playing", () => {
        let game;
        let newAudioLoopSpy;
        let addAudioSpy;

        beforeEach(() => {
            game = Game.Stub;
            newAudioLoopSpy = sandbox.spy();
            game.add.audio = () => {
                return {
                    loopFull: newAudioLoopSpy,
                };
            };
            addAudioSpy = sandbox.spy(game.add, "audio");
            GameSound.setBackgroundMusic(game, "test/music");
        });

        it("sets the background music to the asset that matches the provided key", () => {
            sinon.assert.calledOnce(addAudioSpy);
            sinon.assert.calledWith(addAudioSpy, "test/music");
        });

        it("starts the background music playing in a loop", () => {
            sinon.assert.calledOnce(newAudioLoopSpy);
        });

        it("sets the new music before it starts playing in a loop", () => {
            sinon.assert.callOrder(addAudioSpy, newAudioLoopSpy);
        });
    });

    describe("when background music already exists", () => {
        let game;
        let existingAudioStopSpy;
        let newAudioLoopSpy;
        let addAudioSpy;

        beforeEach(() => {
            game = Game.Stub;
            existingAudioStopSpy = sandbox.spy();
            GameSound.Assets.backgroundMusic = {
                loopFull: () => {},
                stop: existingAudioStopSpy,
            };
            newAudioLoopSpy = sandbox.spy();
            game.add.audio = () => {
                return {
                    loopFull: newAudioLoopSpy,
                };
            };
            addAudioSpy = sandbox.spy(game.add, "audio");
            GameSound.setBackgroundMusic(game, "test/music");
        });

        it("stops the current background music", () => {
            sinon.assert.calledOnce(existingAudioStopSpy);
        });

        it("sets the background music to the asset that matches the provided key", () => {
            sinon.assert.calledOnce(addAudioSpy);
            sinon.assert.calledWith(addAudioSpy, "test/music");
        });

        it("starts the background music playing in a loop", () => {
            sinon.assert.calledOnce(newAudioLoopSpy);
        });

        it("stops the current music and then sets the new music before it starts playing in a loop", () => {
            sinon.assert.callOrder(existingAudioStopSpy, addAudioSpy, newAudioLoopSpy);
        });
    });
});
