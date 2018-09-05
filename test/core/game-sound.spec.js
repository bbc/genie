/**
 * @copyright BBC 2018
 * @author BBC Children's D+E
 * @license Apache-2.0
 */
import * as sinon from "sinon";
import { assert, expect } from "chai";
import * as Game from "../fake/game.js";
import * as PhaserSignal from "../fake/phaser-signal.js";

describe("Game Sound", () => {
    const sandbox = sinon.createSandbox();
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

        describe("when the new music is the same as the currently playing music", () => {
            let game;
            let existingAudioFadeOutSpy;
            let addAudioSpy;

            beforeEach(() => {
                game = Game.Stub;
                existingAudioFadeOutSpy = sandbox.spy();
                GameSound.Assets.backgroundMusic = {
                    isPlaying: true,
                    loopFull: () => {},
                    fadeOut: existingAudioFadeOutSpy,
                    onFadeComplete: PhaserSignal.Stub,
                    name: "current-music",
                    onDecoded: {
                        add: sandbox.stub(),
                    },
                };
                addAudioSpy = sandbox.stub(game.add, "audio");
                const screenConfig = { music: "current-music" };
                GameSound.setupScreenMusic(game, screenConfig);
            });

            it("does not reload the same music asset", () => {
                sinon.assert.notCalled(addAudioSpy);
            });

            it("does not fade the current background music out", () => {
                sinon.assert.notCalled(existingAudioFadeOutSpy);
            });
        });

        describe("when the new music differs from the currently playing music", () => {
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
                    isPlaying: true,
                    loopFull: () => {},
                    fadeOut: existingAudioFadeOutSpy,
                    onFadeComplete: PhaserSignal.Stub,
                    onDecoded: {
                        add: sandbox.stub(),
                    },
                };
                newAudioLoopSpy = sandbox.spy();
                addAudioSpy = sandbox.stub(game.add, "audio").returns({
                    loopFull: newAudioLoopSpy,
                    fadeIn: newAudioFadeInSpy,
                    isDecoded: true,
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
                    isPlaying: true,
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
                    isPlaying: true,
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

        describe("if some previous music is still fading out and we need to fade out current music", () => {
            let game;
            let existingAudioFadeOutSpy;
            let previousAudioStopSpy;

            beforeEach(() => {
                game = Game.Stub;
                existingAudioFadeOutSpy = sandbox.spy();
                previousAudioStopSpy = sandbox.spy();
                GameSound.Assets.backgroundMusic = {
                    isPlaying: true,
                    stop: previousAudioStopSpy,
                    onFadeComplete: { addOnce: () => {} },
                    fadeOut: () => {},
                };
                sandbox.stub(game.add, "audio").returns({
                    isPlaying: true,
                    fadeIn: () => {},
                    fadeOut: existingAudioFadeOutSpy,
                    onFadeComplete: { addOnce: () => {} },
                    onDecoded: {
                        add: sandbox.stub(),
                    },
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

        describe("if some previous music is still fading out and we have no music to fade out", () => {
            let game;
            let previousAudioStopSpy;
            let tweenStartSpy;
            let fadeTweenSpy;

            beforeEach(() => {
                game = Game.Stub;
                previousAudioStopSpy = sandbox.spy();
                tweenStartSpy = sandbox.spy();
                fadeTweenSpy = {
                    pendingDelete: false,
                    start: tweenStartSpy,
                };
                GameSound.Assets.backgroundMusic = {
                    isPlaying: true,
                    stop: previousAudioStopSpy,
                    onFadeComplete: { addOnce: () => {} },
                    fadeOut: () => {},
                    fadeTween: fadeTweenSpy,
                    onDecoded: {
                        add: sandbox.stub(),
                    },
                };
                GameSound.setupScreenMusic(game, undefined);
                // Simulate phaser stopping all tweens between states
                fadeTweenSpy.pendingDelete = true;
                GameSound.setupScreenMusic(game, undefined);
            });

            it("will not stop the fading music", () => {
                sinon.assert.notCalled(previousAudioStopSpy);
            });

            it("will restart the fading music's tween", () => {
                assert.strictEqual(fadeTweenSpy.pendingDelete, false);
                sinon.assert.calledOnce(tweenStartSpy);
            });
        });

        describe("if user navigates to another screen and music has NOT started playing", () => {
            let game;
            let existingAudioFadeOutSpy;
            let previousAudioStopSpy;
            let newAudioFadeInSpy;

            beforeEach(() => {
                game = Game.Stub;
                sandbox.stub(game.sound, "remove");
                existingAudioFadeOutSpy = sandbox.spy();
                previousAudioStopSpy = sandbox.spy();
                newAudioFadeInSpy = sandbox.spy();
                GameSound.Assets.backgroundMusic = {
                    isPlaying: false,
                    stop: previousAudioStopSpy,
                    onFadeComplete: { addOnce: () => {} },
                    fadeOut: () => {},
                };
                sandbox.stub(game.add, "audio").returns({
                    loopFull: newAudioFadeInSpy,
                    fadeIn: sandbox.stub(),
                    fadeOut: existingAudioFadeOutSpy,
                    onDecoded: {
                        add: sandbox.stub(),
                    },
                });
                GameSound.setupScreenMusic(game, { music: "test/music" });
            });

            it("stops current music immediately", () => {
                sandbox.assert.calledOnce(previousAudioStopSpy);
            });

            it("does not fade out current music", () => {
                sandbox.assert.notCalled(existingAudioFadeOutSpy);
            });

            it("starts the new music playing immediately", () => {
                sandbox.assert.calledOnce(newAudioFadeInSpy);
            });

            it("removes fadingMusic", () => {
                sandbox.assert.calledOnce(game.sound.remove);
            });
        });
    });
});
