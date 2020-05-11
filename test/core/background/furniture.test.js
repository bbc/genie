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
import { createMockGmi } from "../../mock/gmi.js";
import { furnish } from "../../../src/core/background/furniture.js";

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
    });
});
