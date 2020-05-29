/**
 * @copyright BBC 2018
 * @author BBC Children's D+E
 * @license Apache-2.0
 */

import * as GameSound from "../../src/core/game-sound.js";

describe("Game Sound", () => {
    let mockScene;
    let mockMusic;

    beforeEach(() => {
        mockScene = {
            sound: {
                add: jest.fn(() => mockMusic),
                remove: jest.fn(),
            },
            tweens: {
                add: jest.fn(tween => {
                    tween.onComplete ? tween.onComplete() : undefined;
                }),
            },
            config: {},
        };
        mockMusic = {
            play: jest.fn(),
            destroy: jest.fn(),
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
        GameSound.Assets.backgroundMusic = undefined;
        GameSound.Assets.buttonClick = undefined;
        jest.clearAllMocks();
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
                mockScene.config.music = "test/music";
                GameSound.setupScreenMusic(mockScene);
                expect(mockScene.sound.add).toHaveBeenCalledWith("test/music");
            });

            test("starts the background music playing in a loop", () => {
                mockScene.config.music = "test/music";
                GameSound.setupScreenMusic(mockScene);
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
                mockScene.config.music = "test/music";
                GameSound.setupScreenMusic(mockScene);
                expect(callOrder).toEqual(["add-audio", "music-play"]);
            });
        });

        describe("when the new music is the same as the currently playing music", () => {
            let mockCurrentMusic;
            beforeEach(() => {
                mockCurrentMusic = {
                    destroy: jest.fn(),
                    isPlaying: true,
                    key: "current-music",
                };
                GameSound.Assets.backgroundMusic = mockCurrentMusic;
                mockScene.config.music = "current-music";
                GameSound.setupScreenMusic(mockScene);
            });

            test("does not play new music", () => {
                expect(mockScene.sound.add).not.toHaveBeenCalled();
            });

            test("does not fade the current background music out", () => {
                expect(mockScene.tweens.add).not.toHaveBeenCalled();
            });

            test("does not stop current music playing", () => {
                expect(mockCurrentMusic.destroy).not.toHaveBeenCalled();
            });

            test("does not stop current music playing if screen is an overlay", () => {
                mockScene.config = { music: "", isOverlay: true };
                GameSound.setupScreenMusic(mockScene);
                expect(mockCurrentMusic.destroy).not.toHaveBeenCalled();
            });
        });

        describe("when the new music differs from the currently playing music", () => {
            let mockCurrentMusic;
            beforeEach(() => {
                mockCurrentMusic = {
                    destroy: jest.fn(),
                    isPlaying: true,
                    key: "something-else",
                };
                GameSound.Assets.backgroundMusic = mockCurrentMusic;
            });

            test("sets the background music to the asset that matches the provided key", () => {
                mockScene.config.music = "test/music";
                GameSound.setupScreenMusic(mockScene);
                expect(mockScene.sound.add).toHaveBeenCalled();
                expect(mockScene.sound.add).toHaveBeenCalledWith("test/music");
            });

            test("fades and stops current music playing", () => {
                mockScene.config.music = "test/music";
                GameSound.setupScreenMusic(mockScene);
                expect(mockScene.tweens.add).toHaveBeenCalled();
                expect(mockCurrentMusic.destroy).toHaveBeenCalled();
            });

            test("starts and fades in the next music track", () => {
                mockScene.config.music = "test/music";
                GameSound.setupScreenMusic(mockScene);
                expect(mockScene.tweens.add).toHaveBeenCalledTimes(2);
                expect(mockScene.tweens.add).toHaveBeenCalledWith({
                    targets: mockMusic,
                    volume: 1,
                    duration: 1000,
                });
            });

            describe("if there is no music config for the screen", () => {
                beforeEach(() => {
                    delete mockScene.config.music;
                    GameSound.setupScreenMusic(mockScene);
                });

                test("will not try to set new background music", () => {
                    expect(mockScene.sound.add).not.toHaveBeenCalled();
                });
            });

            describe("if user navigates to another screen and music has NOT started playing", () => {
                beforeEach(() => {
                    GameSound.Assets.backgroundMusic = {
                        destroy: jest.fn(),
                        isPlaying: false,
                    };
                    mockScene.config.music = "test/music";
                    GameSound.setupScreenMusic(mockScene);
                });

                test("starts the new mockMusic playing immediately", () => {
                    expect(mockMusic.play).toHaveBeenCalled();
                });
            });
        });
    });
});
