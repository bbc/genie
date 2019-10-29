/**
 * @copyright BBC 2018
 * @author BBC Children's D+E
 * @license Apache-2.0
 */
describe("Game Sound", () => {
    let GameSound;
    let mockScene;
    let mockMusic;

    beforeEach(() => {
        GameSound = require("../../src/core/game-sound");
        mockScene = {
            sound: {
                add: jest.fn(() => mockMusic),
                remove: jest.fn(),
            },
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
            GameSound.setButtonClickSound(mockScene, "test/button-click");
            expect(mockScene.sound.add).toHaveBeenCalledWith("test/button-click");
        });
    });

    describe("setupScreenMusic method", () => {
        describe("when no music is playing", () => {
            test("sets the background music to the asset that matches the provided key", () => {
                GameSound.setupScreenMusic(mockScene, { music: "test/music" });
                expect(mockScene.sound.add).toHaveBeenCalledWith("test/music");
            });

            test("starts the background music playing in a loop", () => {
                GameSound.setupScreenMusic(mockScene, { music: "test/music" });
                expect(mockMusic.play).toHaveBeenCalled();
            });

            test("sets the new background music and then starts the new music", () => {
                const callOrder = [];
                mockScene.sound.add.mockImplementation(() => {
                    callOrder.push("add-audio");
                    return mockMusic;
                });
                mockMusic.play.mockImplementation(() => {
                    callOrder.push("music-play");
                });
                GameSound.setupScreenMusic(mockScene, { music: "test/music" });
                expect(callOrder).toEqual(["add-audio", "music-play"]);
            });
        });

        describe("when the new music is the same as the currently playing music", () => {
            let existingAudioFadeOutSpy;

            beforeEach(() => {
                existingAudioFadeOutSpy = jest.fn();
                GameSound.Assets.backgroundMusic = {
                    isPlaying: true,
                    stop: jest.fn(),
                    loopFull: () => {},
                    fadeOut: existingAudioFadeOutSpy,
                    onFadeComplete: { add: () => {}, addOnce: () => {} },
                    name: "current-music",
                    onDecoded: {
                        add: jest.fn(),
                    },
                };
                const screenConfig = { music: "current-music" };
                GameSound.setupScreenMusic(mockScene, screenConfig);
            });

            test("does not reload the same music asset", () => {
                expect(mockScene.sound.add).not.toHaveBeenCalled();
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

            test("sets the background music to the asset that matches the provided key", () => {
                GameSound.setupScreenMusic(mockScene, { music: "test/music" });
                expect(mockScene.sound.add).toHaveBeenCalled();
                expect(mockScene.sound.add).toHaveBeenCalledWith("test/music");
            });

            describe("when the SoundManager and device are both using the Audio tag instead of Web Audio", () => {
                beforeEach(() => {
                    mockScene.sound.mute = true;
                    mockMusic.mute = true;
                    mockMusic.usingAudioTag = true;
                    GameSound.setupScreenMusic(mockScene, { music: "test/music" });
                });

                test("sets the mute value of the background music to match the mute value of the game sound", () => {
                    expect(GameSound.Assets.backgroundMusic.mute).toBe(true);
                });
            });

            describe("when the SoundManager and device are both using Web Audio", () => {
                beforeEach(() => {
                    mockScene.sound.mute = true;
                    mockMusic.mute = false;
                    mockMusic.usingAudioTag = false;
                    GameSound.setupScreenMusic(mockScene, { music: "test/music" });
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
                    GameSound.setupScreenMusic(mockScene, screenConfig);
                });

                test("will not try to set new background music", () => {
                    expect(mockScene.sound.add).not.toHaveBeenCalled();
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
                    GameSound.setupScreenMusic(mockScene, undefined);
                });

                test("will not try to set the background music", () => {
                    expect(mockScene.sound.add).not.toHaveBeenCalled();
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
                    GameSound.setupScreenMusic(mockScene, { music: "test/music" });
                    GameSound.setupScreenMusic(mockScene, { music: "test/music" });
                });

                test("will stop the previous music", () => {
                    expect(mockMusicRemoveAll).toHaveBeenCalled();
                    expect(previousAudioStopSpy).toHaveBeenCalled();
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
                    GameSound.setupScreenMusic(mockScene, { music: "test/music" });
                });

                test("stops current mockMusic immediately", () => {
                    expect(mockMusicRemoveAll).toHaveBeenCalled();
                    expect(previousAudioStopSpy).toHaveBeenCalled();
                });

                test("starts the new mockMusic playing immediately", () => {
                    expect(mockMusic.play).toHaveBeenCalled();
                });
            });
        });
    });
});
