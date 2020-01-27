/**
 * @copyright BBC 2020
 * @author BBC Children's D+E
 * @license Apache-2.0
 */
import { ResultsRow } from "../../../src/components/results/results-row.js";
import { ResultsText } from "../../../src/components/results/results-text.js";
import { ResultsSprite } from "../../../src/components/results/results-sprite.js";
import { mockBaseScene } from "../../mock/mock-scene.js";

jest.mock("../../../src/components/results/results-text.js");
jest.mock("../../../src/components/results/results-sprite.js");

describe("ResultsRow", () => {
    let mockScene;
    let mockRowConfig;
    let mockGetDrawArea;
    let mockDrawArea;
    let mockGameObject;

    beforeEach(() => {
        mockScene = mockBaseScene();
        mockScene.scene = { key: "results" };
        mockRowConfig = {
            format: [{ type: "text", content: "" }],
        };
        mockDrawArea = {
            x: -12,
            y: -11,
            centerX: 47,
            centerY: 23,
        };
        mockGetDrawArea = () => mockDrawArea;
        mockGameObject = {
            x: 50,
            y: 0,
            width: 100,
            height: 100,
        };
        ResultsRow.prototype.add = jest.fn();
        ResultsRow.prototype.removeAll = jest.fn();
    });

    afterEach(() => jest.clearAllMocks());

    test("align moves the gameobject half the rows width by default", () => {
        const resultsRow = new ResultsRow(mockScene, mockRowConfig, mockGetDrawArea);
        resultsRow.list = [mockGameObject];
        resultsRow.align();
        expect(mockGameObject.x).toBe(-25);
    });

    test("addSection adds the gameobject to the container", () => {
        const resultsRow = new ResultsRow(mockScene, mockRowConfig, mockGetDrawArea);
        resultsRow.addSection(mockGameObject);
        expect(resultsRow.add).toHaveBeenCalledWith(mockGameObject);
    });

    test("addSection sets the gameobjects x to 0 when it is the only gameobject in the container", () => {
        const resultsRow = new ResultsRow(mockScene, mockRowConfig, mockGetDrawArea);
        resultsRow.addSection(mockGameObject);
        expect(mockGameObject.x).toBe(0);
    });

    test("addSection applies the x offset", () => {
        const resultsRow = new ResultsRow(mockScene, mockRowConfig, mockGetDrawArea);
        resultsRow.addSection(mockGameObject, 50, 0);
        expect(mockGameObject.x).toBe(50);
    });

    test("addSection applies the y offset", () => {
        const resultsRow = new ResultsRow(mockScene, mockRowConfig, mockGetDrawArea);
        resultsRow.addSection(mockGameObject, 0, 50);
        expect(mockGameObject.y).toBe(0);
    });

    test("addSection sets the gameobjects x to the end of the last added object when it is the only object in the container", () => {
        const resultsRow = new ResultsRow(mockScene, mockRowConfig, mockGetDrawArea);
        const mockObject = {};
        resultsRow.list = [mockGameObject];
        resultsRow.addSection(mockObject);
        expect(mockObject.x).toBe(150);
    });

    test("addSection subtracts half of the gameobjects height from its y position", () => {
        const resultsRow = new ResultsRow(mockScene, mockRowConfig, mockGetDrawArea);
        resultsRow.addSection(mockGameObject);
        expect(mockGameObject.y).toBe(-50);
    });

    test("drawRow adds a ResultsText object to the container when defined in rowConfig", () => {
        const resultsRow = new ResultsRow(mockScene, mockRowConfig, mockGetDrawArea);
        expect(resultsRow.add).toHaveBeenCalledWith(expect.any(ResultsText));
    });

    test("drawRow adds a ResultsSprite object to the container when defined in rowConfig", () => {
        mockRowConfig = {
            format: [{ type: "sprite", key: "image", frame: 0 }],
        };
        const resultsRow = new ResultsRow(mockScene, mockRowConfig, mockGetDrawArea);
        expect(resultsRow.add).toHaveBeenCalledWith(expect.any(ResultsSprite));
    });

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
