/**
 * @copyright BBC 2019
 * @author BBC Children's D+E
 * @license Apache-2.0
 */

/**
 * @copyright BBC 2018
 * @author BBC Children's D+E
 * @license Apache-2.0
 */
import { createMockGmi } from "../mock/gmi";
import { addAnimations } from "../../src/core/background-animations.js";

describe("Background Animations", () => {
    let mockTheme;
    let mockScene;
    let addAnimationsFn;
    let mockGmi;
    let mockSettings;
    let mockSprite;
    let mockSpine;

    beforeEach(() => {
        mockSprite = {
            play: jest.fn(),
        };
        mockSpine = {
            play: jest.fn(),
        };
        mockTheme = {};
        mockScene = {
            context: { theme: mockTheme },
            add: {
                sprite: jest.fn(() => mockSprite),
                spine: jest.fn(() => mockSpine),
            },
            cache: {
                custom: {
                    spine: {
                        exists: jest.fn(key => key === "example_spine"),
                    },
                },
            },
            textures: {
                exists: jest.fn(key => key === "example_sprite"),
            },
            anims: {
                create: jest.fn(),
                generateFrameNumbers: jest.fn(() => [0, 1, 2, 3]),
            },
        };
        addAnimationsFn = addAnimations(mockScene);

        mockSettings = { motion: true };
        mockGmi = {
            getAllSettings: jest.fn(() => mockSettings),
        };
        createMockGmi(mockGmi);
    });

    afterEach(() => jest.clearAllMocks());

    describe("addAnimations Function", () => {
        test("does not add any animations if theme.config.animations has not been set", () => {
            addAnimationsFn();
            expect(mockScene.add.spine).not.toHaveBeenCalled();
            expect(mockScene.add.sprite).not.toHaveBeenCalled();
        });

        test("Adds a sprite with default props if configured", () => {
            mockTheme.animations = [{ key: "example_sprite" }];

            addAnimationsFn();
            expect(mockScene.add.spine).not.toHaveBeenCalled();
            expect(mockScene.add.sprite).toHaveBeenCalledWith(0, 0, "example_sprite", 0);
        });

        test("Adds a sprite with custom props if configured", () => {
            const mockConfig = {
                key: "example_sprite",
                x: -100,
                y: 100,
                frames: { key: "example_sprite_animation", start: 0, end: 7, default: 5, repeat: -1, rate: 10 },
                props: {
                    propName: "propValue",
                },
            };

            mockTheme.animations = [mockConfig];
            addAnimationsFn();

            expect(mockScene.add.sprite).toHaveBeenCalledWith(
                mockConfig.x,
                mockConfig.y,
                mockConfig.key,
                mockConfig.frames.default,
            );

            expect(mockScene.anims.create).toHaveBeenCalledWith({
                frameRate: mockConfig.frames.rate,
                frames: [0, 1, 2, 3],
                key: mockConfig.frames.key,
                repeat: mockConfig.frames.repeat,
            });

            expect(mockSprite.propName).toEqual("propValue");
        });

        test("Adds a spine anim with default props if configured", () => {
            mockTheme.animations = [{ key: "example_spine" }];

            addAnimationsFn();
            expect(mockScene.add.sprite).not.toHaveBeenCalled();
            expect(mockScene.add.spine).toHaveBeenCalledWith(0, 0, "example_spine", "default", true);
        });

        test("Adds a spine anim with custom props if configured", () => {
            const mockConfig = {
                key: "example_spine",
                x: -100,
                y: 100,
                animationName: "idle",
                loop: false,
                props: {
                    propName: "propValue",
                },
            };

            mockTheme.animations = [mockConfig];
            addAnimationsFn();

            expect(mockScene.add.spine).toHaveBeenCalledWith(
                mockConfig.x,
                mockConfig.y,
                mockConfig.key,
                mockConfig.animationName,
                mockConfig.loop,
            );

            expect(mockSpine.propName).toEqual("propValue");
        });

        test("Does not play animations if motion is disabled", () => {
            mockSettings.motion = false;
            mockTheme.animations = [{ key: "example_spine" }, { key: "example_sprite" }];
            addAnimationsFn();

            expect(mockSpine.active).toEqual(false);
            expect(mockSprite.play).not.toHaveBeenCalled();
        });
    });
});
