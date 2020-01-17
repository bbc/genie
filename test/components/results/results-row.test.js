/**
 * @copyright BBC 2020
 * @author BBC Children's D+E
 * @license Apache-2.0
 */
import { ResultsRow } from "../../../src/components/results/results-row.js";

describe("ResultsRow", () => {
    let mockScene;
    let mockRowConfig;
    let mockGetDrawArea;
    let mockDrawArea;

    beforeEach(() => {
        mockScene = {
            sys: {
                game: {
                    config: {
                        resolution: {},
                    },
                    events: { on: () => {} },
                    renderer: {},
                },
                queueDepthSort: () => {},
                textures: {
                    addCanvas: () => ({
                        get: () => ({ source: {}, resolution: {}, setSize: () => {} }),
                    }),
                },
            },
        };
        mockRowConfig = {};
        mockDrawArea = {
            centerX: 47,
            centerY: 23,
        };
        mockGetDrawArea = () => mockDrawArea;
        ResultsRow.prototype.addAt = jest.fn();
        ResultsRow.prototype.removeAll = jest.fn();
    });

    afterEach(() => jest.clearAllMocks());

    test("getBoundingRect returns getDrawArea function", () => {
        const resultsRow = new ResultsRow(mockScene, mockRowConfig, mockGetDrawArea);
        expect(resultsRow.getBoundingRect()).toEqual(mockDrawArea);
    });

    test("reset removes all gameobjects and adds new ones", () => {
        const resultsRow = new ResultsRow(mockScene, mockRowConfig, mockGetDrawArea);
        jest.clearAllMocks();
        resultsRow.reset();
        expect(resultsRow.removeAll).toHaveBeenCalledTimes(1);
        expect(resultsRow.addAt).toHaveBeenCalledTimes(1);
    });

    test("the makeAccessible function has been implemented", () => {
        const resultsRow = new ResultsRow(mockScene, mockRowConfig, mockGetDrawArea);
        expect(resultsRow.makeAccessible).not.toThrow();
    });
});
