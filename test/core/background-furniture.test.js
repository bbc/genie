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
import { furnish } from "../../src/core/background-furniture.js";

describe("Background Furniture", () => {
    let mockTheme;
    let mockScene;
    let furnishFn;
    let mockGmi;
    let mockSettings;
    let mockSprite;
    let mockSpine;
    let mockImage;
    let mockParticles;

    beforeEach(() => {
        mockSprite = {
            play: jest.fn(),
        };
        mockSpine = {
            play: jest.fn(),
        };
        mockParticles = {
            createEmitter: jest.fn(),
        };
        mockImage = {
            testTag: "testTag",
        };
        mockTheme = {};
        mockScene = {
            context: { theme: mockTheme },
            add: {
                sprite: jest.fn(() => mockSprite),
                image: jest.fn(() => mockImage),
                spine: jest.fn(() => mockSpine),
                particles: jest.fn(() => mockParticles),
            },
            cache: {
                custom: {
                    spine: {
                        exists: jest.fn(key => key === "example_spine"),
                    },
                },
                json: {
                    get: jest.fn(() => ({
                        key: "example_emitter",
                    })),
                    exists: jest.fn(key => key === "example_spray"),
                },
            },
            textures: {
                exists: jest.fn(key => key === "example_sprite" || key === "example_image"),
            },
            anims: {
                create: jest.fn(),
                generateFrameNumbers: jest.fn(() => [0, 1, 2, 3]),
            },
        };
        furnishFn = furnish(mockScene);

        mockSettings = { motion: true };
        mockGmi = {
            getAllSettings: jest.fn(() => mockSettings),
        };
        createMockGmi(mockGmi);
    });

    afterEach(() => jest.clearAllMocks());

    describe("Furnish", () => {
        test("does not add any items if theme.config.furniture has not been set", () => {
            furnishFn();
            expect(mockScene.add.spine).not.toHaveBeenCalled();
            expect(mockScene.add.sprite).not.toHaveBeenCalled();
            expect(mockScene.add.image).not.toHaveBeenCalled();
            expect(mockScene.add.particles).not.toHaveBeenCalled();
        });

        test("Adds an image with default props if configured", () => {
            mockTheme.furniture = [{ key: "example_image" }];

            furnishFn();
            expect(mockScene.add.image).toHaveBeenCalledWith(0, 0, "example_image");
        });

        test("Adds an image with custom props if configured", () => {
            const mockConfig = {
                key: "example_image",
                x: -10,
                y: 10,
                props: {
                    propName: "propValue",
                },
            };

            mockTheme.furniture = [mockConfig];
            furnishFn();

            expect(mockScene.add.image).toHaveBeenCalledWith(mockConfig.x, mockConfig.y, mockConfig.key);

            expect(mockImage.propName).toEqual("propValue");
        });

        test("Adds a sprite with default props if configured", () => {
            mockTheme.furniture = [{ key: "example_sprite", frames: {} }];

            furnishFn();
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

            mockTheme.furniture = [mockConfig];
            furnishFn();

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
            mockTheme.furniture = [{ key: "example_spine" }];

            furnishFn();
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

            mockTheme.furniture = [mockConfig];
            furnishFn();

            expect(mockScene.add.spine).toHaveBeenCalledWith(
                mockConfig.x,
                mockConfig.y,
                mockConfig.key,
                mockConfig.animationName,
                mockConfig.loop,
            );

            expect(mockSpine.propName).toEqual("propValue");
        });

        test("Adds a particle system if configured", () => {
            const mockConfig = {
                key: "example_spray",
                assetKey: "example_sprite",
            };

            mockTheme.furniture = [mockConfig];
            furnishFn();

            expect(mockScene.add.particles).toHaveBeenCalledWith("example_sprite");

            expect(mockParticles.createEmitter).toHaveBeenCalledWith({ key: "example_emitter" });
        });

        test("Adds a particle system with custom props if configured", () => {
            const mockConfig = {
                key: "example_spray",
                assetKey: "example_sprite",
                props: {
                    x: 250,
                },
            };

            mockTheme.furniture = [mockConfig];
            furnishFn();

            expect(mockParticles.createEmitter).toHaveBeenCalledWith({ key: "example_emitter", x: 250 });
        });

        test("Does not play animations if motion is disabled", () => {
            mockSettings.motion = false;
            mockTheme.furniture = [
                { key: "example_spine", frames: {} },
                { key: "example_sprite", frames: {} },
            ];
            furnishFn();

            expect(mockSpine.active).toEqual(false);
            expect(mockSprite.play).not.toHaveBeenCalled();
        });

        test("Does not add particles if motion is disabled", () => {
            mockSettings.motion = false;
            const mockConfig = {
                key: "example_spray",
                assetKey: "example_sprite",
            };

            mockTheme.furniture = [mockConfig];
            furnishFn();

            expect(mockScene.add.particles).not.toHaveBeenCalled();
        });
    });
});
