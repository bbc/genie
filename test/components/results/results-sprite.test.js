/**
 * @copyright BBC 2020
 * @author BBC Children's D+E
 * @license Apache-2.0
 */
import { ResultsSprite } from "../../../src/components/results/results-sprite.js";
import { mockBaseScene } from "../../mock/mock-scene.js";

describe("ResultsSprite", () => {
    let mockScene;
    let mockConfig;

    beforeEach(() => {
        mockScene = mockBaseScene();
        mockScene.scene = { key: "results" };
        mockScene.add = { existing: jest.fn() };
        mockScene.anims = { create: jest.fn(), generateFrameNumbers: jest.fn() };
        mockConfig = {
            key: "image",
            frame: 5,
        };
        ResultsSprite.prototype.play = jest.fn();
        ResultsSprite.prototype.setOrigin = jest.fn();
        ResultsSprite.prototype.setTexture = jest.fn();
        ResultsSprite.prototype.setSizeToFrame = () => {};
    });

    afterEach(() => jest.clearAllMocks());

    test("sets origin of ResultsSprite to 0,0", () => {
        const resultsSprite = new ResultsSprite(mockScene, mockConfig);
        expect(resultsSprite.setOrigin).toHaveBeenCalledWith(0, 0);
    });

    test("sets key to spriteConfig.key and frame to spriteConfig.frame", () => {
        const resultsSprite = new ResultsSprite(mockScene, mockConfig);
        expect(resultsSprite.setTexture).toHaveBeenCalledWith(mockConfig.key, mockConfig.frame);
    });

    test("adds itself to the update and displaylists when animation is defined", () => {
        mockConfig.anim = {};
        const resultsSprite = new ResultsSprite(mockScene, mockConfig);
        expect(resultsSprite.scene.add.existing).toHaveBeenCalledWith(resultsSprite);
    });

    test("does not add itself to the update and displaylists when animation is not defined", () => {
        const resultsSprite = new ResultsSprite(mockScene, mockConfig);
        expect(resultsSprite.scene.add.existing).not.toHaveBeenCalled();
    });

    test("creates an animation when animation is defined", () => {
        mockConfig.anim = {};
        new ResultsSprite(mockScene, mockConfig);
        expect(mockScene.anims.create).toHaveBeenCalledWith({ key: mockConfig.key });
    });

    test("plays the animation when animation is defined", () => {
        mockConfig.anim = {};
        const resultsSprite = new ResultsSprite(mockScene, mockConfig);
        expect(resultsSprite.play).toHaveBeenCalledWith(mockConfig.key);
    });

    test("generates the correct frames when animation frames are defined", () => {
        mockConfig.anim = {
            frames: {
                start: 0,
                end: 10,
            },
        };
        new ResultsSprite(mockScene, mockConfig);
        expect(mockScene.anims.generateFrameNumbers).toHaveBeenCalledWith(mockConfig.key, mockConfig.anim.frames);
    });
});
