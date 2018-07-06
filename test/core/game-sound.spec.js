import * as sinon from "sinon";
import { expect } from "chai";
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

    describe("when the SoundManager and device are both using the Audio tag instead of Web Audio", () => {
        let game;

        beforeEach(() => {
            game = Game.Stub;
            game.sound.mute = true;
            GameSound.Assets.backgroundMusic = {
                loopFull: () => {},
                stop: () => {},
            };
            game.add.audio = () => {
                return {
                    loopFull: () => {},
                    mute: true,
                    usingAudioTag: true,
                };
            };
            GameSound.setBackgroundMusic(game, "test/music");
        });

        it("sets the mute value of the background music to match the mute value of the game sound", () => {
            expect(GameSound.Assets.backgroundMusic.mute).to.equal(true);
        });
    });

    describe("when the SoundManager and device are both using Web Audio", () => {
        let game;

        beforeEach(() => {
            game = Game.Stub;
            game.sound.mute = true;
            GameSound.Assets.backgroundMusic = {
                loopFull: () => {},
                stop: () => {},
            };
            game.add.audio = () => {
                return {
                    loopFull: () => {},
                    mute: false,
                    usingAudioTag: false,
                };
            };
            GameSound.setBackgroundMusic(game, "test/music");
        });

        it("sets the mute value of the background music to match the mute value of the game sound", () => {
            expect(GameSound.Assets.backgroundMusic.mute).to.equal(false);
        });
    });
});
