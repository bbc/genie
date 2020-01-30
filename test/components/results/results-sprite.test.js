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
        mockConfig = {
            key: "image",
            frame: 5,
        };
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
});
