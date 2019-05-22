/**
 * @copyright BBC 2018
 * @author BBC Children's D+E
 * @license Apache-2.0
 */
describe("Game Sound", () => {
    let GameSound;
    let mockGame;
    let mockMusic;

    beforeEach(() => {
        GameSound = require("../../src/core/game-sound");
        mockGame = {
            add: { audio: jest.fn(() => mockMusic) },
            sound: { remove: jest.fn() },
        };
        mockMusic = {
            play: jest.fn(),
            stop: jest.fn(),
            fadeIn: jest.fn(),
            fadeOut: jest.fn(),
            isDecoded: true,
            onStop: {
                addOnce: jest.fn(),
                removeAll: jest.fn(),
            },
        };
    });

    afterEach(() => {
        jest.clearAllMocks();
        delete require.cache["./src/core/game-sound.js"];
    });

    describe("setButtonClickSound method", () => {
        test("sets the button click sound", () => {
            GameSound.setButtonClickSound(mockGame, "test/button-click");
            expect(mockGame.add.audio).toHaveBeenCalledWith("test/button-click");
        });
    });

    describe("setupScreenMusic method", () => {
        describe("when no music is playing", () => {
            test("sets the background music to the asset that matches the provided key", () => {
                GameSound.setupScreenMusic(mockGame, { music: "test/music" });
                expect(mockGame.add.audio).toHaveBeenCalledWith("test/music");
            });

            test("starts the background music playing in a loop", () => {
                GameSound.setupScreenMusic(mockGame, { music: "test/music" });
                expect(mockMusic.play).toHaveBeenCalled();
                expect(mockMusic.onStop.addOnce).toHaveBeenCalledTimes(1);
            });

            test("sets the new background music and then starts the new music", () => {
                const callOrder = [];
                mockGame.add.audio.mockImplementation(() => {
                    callOrder.push("add-audio");
                    return mockMusic;
                });
                mockMusic.play.mockImplementation(() => {
                    callOrder.push("music-play");
                });
                GameSound.setupScreenMusic(mockGame, { music: "test/music" });
                expect(callOrder).toEqual(["add-audio", "music-play"]);
            });
        });

        describe("when the new music is the same as the currently playing music", () => {
            let existingAudioFadeOutSpy;

            beforeEach(() => {
                existingAudioFadeOutSpy = jest.fn();
                GameSound.Assets.backgroundMusic = {
                    isPlaying: true,
                    loopFull: () => {},
                    fadeOut: existingAudioFadeOutSpy,
                    onFadeComplete: { add: () => {}, addOnce: () => {} },
                    name: "current-music",
                    onDecoded: {
                        add: jest.fn(),
                    },
                };
                const screenConfig = { music: "current-music" };
                GameSound.setupScreenMusic(mockGame, screenConfig);
            });

            test("does not reload the same music asset", () => {
                expect(mockGame.add.audio).not.toHaveBeenCalled();
            });

            test("does not fade the current background music out", () => {
                expect(existingAudioFadeOutSpy).not.toHaveBeenCalled();
            });
        });

        describe("when the new music differs from the currently playing music", () => {
            let musicFadeOutSpy;

            beforeEach(() => {
                musicFadeOutSpy = jest.fn();
                GameSound.Assets.backgroundMusic = {
                    isPlaying: true,
                    fadeOut: musicFadeOutSpy,
                    onFadeComplete: { add: () => {}, addOnce: () => {} },
                    onDecoded: { add: jest.fn() },
                    stop: jest.fn(),
                    onStop: { removeAll: jest.fn() },
                };
            });

            test("fades the current background music out", () => {
                GameSound.setupScreenMusic(mockGame, { music: "test/music" });
                expect(musicFadeOutSpy).toHaveBeenCalled();
                expect(musicFadeOutSpy).toHaveBeenCalledWith(GameSound.SOUND_FADE_PERIOD / 2);
            });

            test("sets the background music to the asset that matches the provided key", () => {
                GameSound.setupScreenMusic(mockGame, { music: "test/music" });
                expect(mockGame.add.audio).toHaveBeenCalled();
                expect(mockGame.add.audio).toHaveBeenCalledWith("test/music");
            });

            test("fades in the new background music and starts it playing in a loop", () => {
                GameSound.setupScreenMusic(mockGame, { music: "test/music" });
                expect(mockMusic.fadeIn).toHaveBeenCalled();
                expect(mockMusic.fadeIn).toHaveBeenCalledWith(GameSound.SOUND_FADE_PERIOD);
            });

            test("stops the current music -> sets the new background music -> fades the new music in", () => {
                const callOrder = [];
                musicFadeOutSpy.mockImplementation(() => {
                    callOrder.push("stop-current-music");
                });
                mockGame.add.audio.mockImplementation(() => {
                    callOrder.push("add-new-music");
                    return mockMusic;
                });
                mockMusic.fadeIn.mockImplementation(() => {
                    callOrder.push("fade-in");
                });
                GameSound.setupScreenMusic(mockGame, { music: "test/music" });
                expect(callOrder).toEqual(["stop-current-music", "add-new-music", "fade-in"]);
            });
        });

        describe("when the SoundManager and device are both using the Audio tag instead of Web Audio", () => {
            beforeEach(() => {
                mockGame.sound.mute = true;
                mockMusic.mute = true;
                mockMusic.usingAudioTag = true;
                GameSound.setupScreenMusic(mockGame, { music: "test/music" });
            });

            test("sets the mute value of the background music to match the mute value of the game sound", () => {
                expect(GameSound.Assets.backgroundMusic.mute).toBe(true);
            });
        });

        describe("when the SoundManager and device are both using Web Audio", () => {
            beforeEach(() => {
                mockGame.sound.mute = true;
                mockMusic.mute = false;
                mockMusic.usingAudioTag = false;
                GameSound.setupScreenMusic(mockGame, { music: "test/music" });
            });

            test("does not change the mute value of the background music", () => {
                expect(GameSound.Assets.backgroundMusic.mute).toBe(false);
            });
        });

        describe("if there is no music config for the screen", () => {
            let existingAudioFadeOutSpy;

            beforeEach(() => {
                existingAudioFadeOutSpy = jest.fn();
                GameSound.Assets.backgroundMusic = {
                    isPlaying: true,
                    loopFull: () => {},
                    fadeOut: existingAudioFadeOutSpy,
                    onFadeComplete: { add: () => {}, addOnce: () => {} },
                    onStop: { removeAll: jest.fn() },
                    stop: jest.fn(),
                };
                const screenConfig = {};
                GameSound.setupScreenMusic(mockGame, screenConfig);
            });

            test("will fade out the current music", () => {
                expect(existingAudioFadeOutSpy).toHaveBeenCalled();
                expect(existingAudioFadeOutSpy).toHaveBeenCalledWith(GameSound.SOUND_FADE_PERIOD / 2);
            });

            test("will not try to set new background music", () => {
                expect(mockGame.add.audio).not.toHaveBeenCalled();
            });
        });

        describe("if there is no config of any kind for the screen", () => {
            let existingAudioFadeOutSpy;

            beforeEach(() => {
                existingAudioFadeOutSpy = jest.fn();
                GameSound.Assets.backgroundMusic = {
                    isPlaying: true,
                    loopFull: () => {},
                    fadeOut: existingAudioFadeOutSpy,
                    onFadeComplete: { add: () => {}, addOnce: () => {} },
                    onStop: { removeAll: jest.fn() },
                    stop: jest.fn(),
                };
                GameSound.setupScreenMusic(mockGame, undefined);
            });

            test("will fade out the current music", () => {
                expect(existingAudioFadeOutSpy).toHaveBeenCalledWith(GameSound.SOUND_FADE_PERIOD / 2);
            });

            test("will not try to set the background music", () => {
                expect(mockGame.add.audio).not.toHaveBeenCalled();
            });
        });

        describe("if some previous music is still fading out and we need to fade out current music", () => {
            let previousAudioStopSpy;
            let mockMusicRemoveAll;
            let fadeOutSpy;

            beforeEach(() => {
                previousAudioStopSpy = jest.fn();
                mockMusicRemoveAll = jest.fn();
                fadeOutSpy = jest.fn();
                GameSound.Assets.backgroundMusic = {
                    isPlaying: true,
                    stop: previousAudioStopSpy,
                    onFadeComplete: { addOnce: () => {} },
                    fadeOut: fadeOutSpy,
                    onStop: {
                        removeAll: mockMusicRemoveAll,
                    },
                };
                GameSound.setupScreenMusic(mockGame, { music: "test/music" });
                GameSound.setupScreenMusic(mockGame, { music: "test/music" });
            });

            test("will stop the previous music", () => {
                expect(mockMusicRemoveAll).toHaveBeenCalled();
                expect(previousAudioStopSpy).toHaveBeenCalled();
            });

            test("will fade out the current music", () => {
                expect(fadeOutSpy).toHaveBeenCalledWith(GameSound.SOUND_FADE_PERIOD / 2);
            });
        });

        describe("if some previous music is still fading out and we have no music to fade out", () => {
            let previousAudioStopSpy;
            let tweenStartSpy;
            let fadeTweenSpy;

            beforeEach(() => {
                previousAudioStopSpy = jest.fn();
                tweenStartSpy = jest.fn();
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
                        add: jest.fn(),
                    },
                    onStop: { removeAll: jest.fn() },
                };
                GameSound.setupScreenMusic(mockGame, undefined);
                // Simulate phaser stopping all tweens between states
                fadeTweenSpy.pendingDelete = true;
                GameSound.setupScreenMusic(mockGame, undefined);
            });

            test("will not stop the fading music", () => {
                expect(previousAudioStopSpy).not.toHaveBeenCalled();
            });

            test("will restart the fading music's tween", () => {
                expect(fadeTweenSpy.pendingDelete).toBe(false);
                expect(tweenStartSpy).toHaveBeenCalled();
            });
        });

        describe("if user navigates to another screen and music has NOT started playing", () => {
            let existingAudioFadeOutSpy;
            let previousAudioStopSpy;
            let mockMusicRemoveAll;

            beforeEach(() => {
                existingAudioFadeOutSpy = jest.fn();
                previousAudioStopSpy = jest.fn();
                mockMusicRemoveAll = jest.fn();
                GameSound.Assets.backgroundMusic = {
                    isPlaying: false,
                    stop: previousAudioStopSpy,
                    onFadeComplete: { addOnce: () => {} },
                    fadeOut: () => {},
                    onStop: {
                        removeAll: mockMusicRemoveAll,
                    },
                };
                mockMusic.fadeOut = existingAudioFadeOutSpy;
                GameSound.setupScreenMusic(mockGame, { music: "test/music" });
            });

            test("stops current mockMusic immediately", () => {
                expect(mockMusicRemoveAll).toHaveBeenCalled();
                expect(previousAudioStopSpy).toHaveBeenCalled();
            });

            test("does not fade out current mockMusic", () => {
                expect(existingAudioFadeOutSpy).not.toHaveBeenCalled();
            });

            test("starts the new mockMusic playing immediately", () => {
                expect(mockMusic.play).toHaveBeenCalled();
            });

            test("removes fadingMusic", () => {
                expect(mockGame.sound.remove).toHaveBeenCalled();
            });
        });
    });
});
