/**
 * @copyright BBC 2020
 * @author BBC Children's D+E
 * @license Apache-2.0
 */
import { tweenRows } from "../../../src/components/results/results-row-tween.js";

describe("ResultsRow - Tween Rows", () => {
    let mockScene;
    let mockTweenConfig;
    let mockContainers;

    beforeEach(() => {
        mockScene = { add: { tween: jest.fn() } };
        mockTweenConfig = {
            duration: 1000,
            alpha: { from: 0, to: 1 },
        };
        mockContainers = [{ rowConfig: { transition: mockTweenConfig } }];
    });

    afterEach(() => jest.clearAllMocks());

    test("sets up tweens as specified in config", () => {
        tweenRows(mockScene, mockContainers);
        expect(mockScene.add.tween).toHaveBeenCalledWith(expect.objectContaining(mockTweenConfig));
    });

    test("adds a tween for every container which has a tween configured", () => {
        mockContainers = [
            { rowConfig: { transition: mockTweenConfig } },
            { rowConfig: {} },
            { rowConfig: { transition: mockTweenConfig } },
        ];
        tweenRows(mockScene, mockContainers);
        expect(mockScene.add.tween).toHaveBeenCalledWith(expect.objectContaining(mockTweenConfig));
        expect(mockScene.add.tween).toHaveBeenCalledTimes(2);
    });

    test("does not add any tweens when no tweens are configured", () => {
        mockContainers = [{ rowConfig: {} }];
        tweenRows(mockScene, mockContainers);
        expect(mockScene.add.tween).not.toHaveBeenCalled();
    });
});
