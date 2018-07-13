import * as sinon from "sinon";
import { expect } from "chai";
import * as Game from "../fake/game.js";
import * as PhaserSignal from "../fake/phaser-signal.js";

describe("Game Sound", () => {
    const sandbox = sinon.sandbox.create();
    let GameSound;

    beforeEach(() => {
        GameSound = require("../../src/core/game-sound");
    });

    afterEach(() => {
        sandbox.restore();
        delete require.cache["./src/core/game-sound.js"];
    });

    describe("#setButtonClickSound", () => {
        it("sets the button click sound", () => {
            const game = Game.Stub;
            const addAudioSpy = sandbox.spy(game.add, "audio");
            GameSound.setButtonClickSound(game, "test/button-click");
            sinon.assert.calledWith(addAudioSpy, "test/button-click");
        });
    });

    describe("#setupScreenMusic", () => {
        describe("when no music is playing", () => {
            let game;
            let newAudioLoopSpy;
            let addAudioSpy;

            beforeEach(() => {
                game = Game.Stub;
                newAudioLoopSpy = sandbox.spy();
                addAudioSpy = sandbox.stub(game.add, "audio").returns({
                    loopFull: newAudioLoopSpy,
                });
                const screenConfig = { music: "test/music" };
                GameSound.setupScreenMusic(game, screenConfig);
            });

            it("sets the background music to the asset that matches the provided key", () => {
                sinon.assert.calledOnce(addAudioSpy);
                sinon.assert.calledWith(addAudioSpy, "test/music");
            });

            it("starts the background music playing in a loop", () => {
                sinon.assert.calledOnce(newAudioLoopSpy);
            });

            it("sets the new background music -> starts the new music", () => {
                sinon.assert.callOrder(addAudioSpy, newAudioLoopSpy);
            });
        });

        describe("when background music already exists", () => {
            let game;
            let existingAudioFadeOutSpy;
            let newAudioLoopSpy;
            let newAudioFadeInSpy;
            let addAudioSpy;

            beforeEach(() => {
                game = Game.Stub;
                existingAudioFadeOutSpy = sandbox.spy();
                newAudioFadeInSpy = sandbox.spy();
                GameSound.Assets.backgroundMusic = {
                    loopFull: () => {},
                    fadeOut: existingAudioFadeOutSpy,
                    onFadeComplete: PhaserSignal.Stub,
                };
                newAudioLoopSpy = sandbox.spy();
                addAudioSpy = sandbox.stub(game.add, "audio").returns({
                    loopFull: newAudioLoopSpy,
                    fadeIn: newAudioFadeInSpy,
                });
                const screenConfig = { music: "test/music" };
                GameSound.setupScreenMusic(game, screenConfig);
            });

            it("fades the current background music out", () => {
                sinon.assert.calledOnce(existingAudioFadeOutSpy);
                sinon.assert.calledWith(existingAudioFadeOutSpy, GameSound.SOUND_FADE_PERIOD / 2);
            });

            it("sets the background music to the asset that matches the provided key", () => {
                sinon.assert.calledOnce(addAudioSpy);
                sinon.assert.calledWith(addAudioSpy, "test/music");
            });

            it("fades in the new background music and starts it playing in a loop", () => {
                sinon.assert.calledOnce(newAudioFadeInSpy);
                sinon.assert.calledWith(newAudioFadeInSpy, GameSound.SOUND_FADE_PERIOD, true);
            });

            it("stops the current music -> sets the new background music -> fades the new music in", () => {
                sinon.assert.callOrder(existingAudioFadeOutSpy, addAudioSpy, newAudioFadeInSpy);
            });
        });

        describe("when the SoundManager and device are both using the Audio tag instead of Web Audio", () => {
            let game;

            beforeEach(() => {
                game = Game.Stub;
                game.sound.mute = true;
                game.add.audio = () => {
                    return {
                        loopFull: () => {},
                        mute: true,
                        usingAudioTag: true,
                    };
                };
                const screenConfig = { music: "test/music" };
                GameSound.setupScreenMusic(game, screenConfig);
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
                game.add.audio = () => {
                    return {
                        loopFull: () => {},
                        mute: false,
                        usingAudioTag: false,
                    };
                };
                const screenConfig = { music: "test/music" };
                GameSound.setupScreenMusic(game, screenConfig);
            });

            it("does not change the mute value of the background music", () => {
                expect(GameSound.Assets.backgroundMusic.mute).to.equal(false);
            });
        });

        describe("if there is no music config for the screen", () => {
            let game;
            let addAudioSpy;
            let existingAudioFadeOutSpy;

            beforeEach(() => {
                game = Game.Stub;
                existingAudioFadeOutSpy = sandbox.spy();
                GameSound.Assets.backgroundMusic = {
                    loopFull: () => {},
                    fadeOut: existingAudioFadeOutSpy,
                    onFadeComplete: PhaserSignal.Stub,
                };
                addAudioSpy = sandbox.spy(game.add, "audio");
                const screenConfig = {};
                GameSound.setupScreenMusic(game, screenConfig);
            });

            it("will fade out the current music", () => {
                sinon.assert.calledOnce(existingAudioFadeOutSpy);
                sinon.assert.calledWith(existingAudioFadeOutSpy, GameSound.SOUND_FADE_PERIOD / 2);
            });

            it("will not try to set new background music", () => {
                sinon.assert.notCalled(addAudioSpy);
            });
        });

        describe("if there is no config of any kind for the screen", () => {
            let game;
            let addAudioSpy;
            let existingAudioFadeOutSpy;

            beforeEach(() => {
                game = Game.Stub;
                existingAudioFadeOutSpy = sandbox.spy();
                GameSound.Assets.backgroundMusic = {
                    loopFull: () => {},
                    fadeOut: existingAudioFadeOutSpy,
                    onFadeComplete: PhaserSignal.Stub,
                };
                addAudioSpy = sandbox.spy(game.add, "audio");
                GameSound.setupScreenMusic(game, undefined);
            });

            it("will fade out the current music", () => {
                sinon.assert.calledOnce(existingAudioFadeOutSpy);
                sinon.assert.calledWith(existingAudioFadeOutSpy, GameSound.SOUND_FADE_PERIOD / 2);
            });

            it("will not try to set the background music", () => {
                sinon.assert.notCalled(addAudioSpy);
            });
        });

        describe("if some previous music is still fading out", () => {
            let game;
            let existingAudioFadeOutSpy;
            let previousAudioStopSpy;

            beforeEach(() => {
                game = Game.Stub;
                existingAudioFadeOutSpy = sandbox.spy();
                previousAudioStopSpy = sandbox.spy();
                GameSound.Assets.backgroundMusic = {
                    stop: previousAudioStopSpy,
                    onFadeComplete: { addOnce: () => {} },
                    fadeOut: () => {},
                };
                sandbox.stub(game.add, "audio").returns({
                    fadeIn: () => {},
                    fadeOut: existingAudioFadeOutSpy,
                    onFadeComplete: { addOnce: () => {} },
                });
                GameSound.setupScreenMusic(game, { music: "test/music" });
                GameSound.setupScreenMusic(game, { music: "test/music" });
            });

            it("will stop the previous music", () => {
                sinon.assert.calledOnce(previousAudioStopSpy);
            });

            it("will fade out the current music", () => {
                sinon.assert.calledOnce(existingAudioFadeOutSpy);
                sinon.assert.calledWith(existingAudioFadeOutSpy, GameSound.SOUND_FADE_PERIOD / 2);
            });
        });
    });
});
