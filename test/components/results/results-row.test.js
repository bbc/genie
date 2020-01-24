/**
 * @copyright BBC 2020
 * @author BBC Children's D+E
 * @license Apache-2.0
 */
import { ResultsRow } from "../../../src/components/results/results-row.js";
import { mockBaseScene } from "../../mock/mock-scene.js";

describe("ResultsRow", () => {
    let mockScene;
    let mockRowConfig;
    let mockGetDrawArea;
    let mockDrawArea;

    beforeEach(() => {
        mockScene = mockBaseScene();
        mockRowConfig = {};
        mockDrawArea = {
            centerX: 47,
            centerY: 23,
        };
        mockGetDrawArea = () => mockDrawArea;
        ResultsRow.prototype.add = jest.fn();
        ResultsRow.prototype.removeAll = jest.fn();
    });

    afterEach(() => jest.clearAllMocks());

    test("getBoundingRect returns getDrawArea function", () => {
        const resultsRow = new ResultsRow(mockScene, mockRowConfig, mockGetDrawArea);
        expect(resultsRow.getBoundingRect()).toEqual(mockDrawArea);
    });

    test("setContainerPosition sets the containers x and y position correctly", () => {
        const resultsRow = new ResultsRow(mockScene, mockRowConfig, mockGetDrawArea);
        resultsRow.setContainerPosition();
        expect(resultsRow.x).toBe(mockDrawArea.centerX);
        expect(resultsRow.y).toBe(mockDrawArea.centerY);
    });

    test("reset updates container position", () => {
        const resultsRow = new ResultsRow(mockScene, mockRowConfig, mockGetDrawArea);
        mockDrawArea.centerX = 43;
        mockDrawArea.centerY = 23;
        resultsRow.reset();
        expect(resultsRow.x).toBe(mockDrawArea.centerX);
        expect(resultsRow.y).toBe(mockDrawArea.centerY);
    });

    test("the makeAccessible function has been implemented", () => {
        const resultsRow = new ResultsRow(mockScene, mockRowConfig, mockGetDrawArea);
        expect(resultsRow.makeAccessible).not.toThrow();
    });
});
