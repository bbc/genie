/**
 * @copyright BBC 2018
 * @author BBC Children's D+E
 * @license Apache-2.0
 */

import { setMusic } from "../../src/core/music.js";

describe("Game Sound", () => {
    let mockScene;
    let mockMusic;

    beforeEach(() => {
        mockScene = {
            _data: {},
            scene: { key: "select" },
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
            play: jest.fn(() => mockMusic),
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
        jest.clearAllMocks();
    });

    describe("setupScreenMusic method", () => {
        describe("when no music is playing", () => {
            test("sets the background music to the asset that matches the provided key", () => {
                mockScene.config.music = "test/music";
                setMusic(mockScene);
                expect(mockScene.sound.add).toHaveBeenCalledWith("test/music", { loop: true, volume: 0 });
            });

            test("starts the background music playing", () => {
                mockScene.config.music = "test/music";
                setMusic(mockScene);
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
                setMusic(mockScene);
                expect(callOrder).toEqual(["add-audio", "music-play"]);
            });
        });

        describe("when the new music is the same as the currently playing music", () => {
            beforeEach(() => {
                mockScene.config.music = "current-music";
                mockMusic.key = "current-music";
                setMusic(mockScene);
                jest.clearAllMocks();
                setMusic(mockScene);
            });

            test("does not play new music", () => {
                expect(mockScene.sound.add).not.toHaveBeenCalled();
            });

            test("does not fade the current background music out", () => {
                expect(mockScene.tweens.add).not.toHaveBeenCalled();
            });

            test("does not stop current music playing", () => {
                expect(mockScene.sound.remove).not.toHaveBeenCalled();
            });

            test("does not stop current music playing if screen is an overlay", () => {
                mockScene._data.addedBy = "screen";
                setMusic(mockScene);
                expect(mockScene.sound.remove).not.toHaveBeenCalled();
            });
        });

        describe("when the new music differs from the currently playing music", () => {
            const addTween = { volume: 1, duration: 1000 };
            const fadeTween = { volume: 0, duration: 1000 / 2 };

            beforeEach(() => {
                mockScene.config.music = "test-music";
                mockMusic.key = "current-music";
                setMusic(mockScene);
                jest.clearAllMocks();
            });

            test("sets the background music to the asset that matches the provided key", () => {
                setMusic(mockScene);
                expect(mockScene.sound.add).toHaveBeenCalled();
                expect(mockScene.sound.add).toHaveBeenCalledWith("test-music", { loop: true, volume: 0 });
            });

            test("fades and stops current music playing if not going to the Home screen", () => {
                setMusic(mockScene);
                expect(mockScene.tweens.add).toHaveBeenCalledWith(expect.objectContaining(fadeTween));
                expect(mockScene.sound.remove).toHaveBeenCalled();
            });

            test("stops but doesn't fade current music playing if going to the Home screen", () => {
                // This logic means that when we pause in-game then return to the home screen,
                // the game music does not fade out before playing the Home screen music.
                mockScene.scene.key = "home";
                setMusic(mockScene);
                expect(mockScene.sound.remove).toHaveBeenCalled();
                expect(mockScene.tweens.add).not.toHaveBeenCalledWith(expect.objectContaining(fadeTween));
            });

            test("starts and fades in the next music track", () => {
                setMusic(mockScene);
                expect(mockScene.tweens.add).toHaveBeenCalledTimes(2);
                expect(mockScene.tweens.add).toHaveBeenCalledWith(expect.objectContaining(fadeTween));
                expect(mockScene.tweens.add).toHaveBeenCalledWith(expect.objectContaining(addTween));
            });

            describe("if there is no music config for the screen", () => {
                beforeEach(() => {
                    delete mockScene.config.music;
                    setMusic(mockScene);
                });

                test("will not try to set new background music", () => {
                    expect(mockScene.sound.add).not.toHaveBeenCalled();
                });
            });

            describe("if user navigates to another screen and music has NOT started playing", () => {
                beforeEach(() => {
                    mockMusic.isPlaying = false;
                    setMusic(mockScene);
                });

                test("starts the new mockMusic playing immediately", () => {
                    expect(mockMusic.play).toHaveBeenCalled();
                });
            });
        });
    });
});
