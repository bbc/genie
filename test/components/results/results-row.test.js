/**
 * @copyright BBC 2020
 * @author BBC Children's D+E
 * @license Apache-2.0
 */
import { ResultsRow } from "../../../src/components/results/results-row.js";
import { ResultsText } from "../../../src/components/results/results-text.js";
import { mockBaseScene } from "../../mock/mock-scene.js";

jest.mock("../../../src/components/results/results-text.js");
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
            format: [{ type: "text", content: "" }, { type: "image", key: "mock" }],
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

    test("align does not move the gameobject when alignment set to right", () => {
        mockRowConfig.align = "right";
        const resultsRow = new ResultsRow(mockScene, mockRowConfig, mockGetDrawArea);
        resultsRow.list = [mockGameObject];
        resultsRow.align();
        expect(mockGameObject.x).toBe(50);
    });

    test("align moves the gameobject left by the width of the row when alignment set to left", () => {
        mockRowConfig.align = "left";
        const resultsRow = new ResultsRow(mockScene, mockRowConfig, mockGetDrawArea);
        resultsRow.list = [mockGameObject];
        resultsRow.align();
        expect(mockGameObject.x).toBe(-100);
    });

    test("align sets gameobject.x left by drawArea.x when alignment set to marginLeft", () => {
        mockRowConfig.align = "marginLeft";
        const resultsRow = new ResultsRow(mockScene, mockRowConfig, mockGetDrawArea);
        resultsRow.list = [mockGameObject];
        resultsRow.align();
        expect(mockGameObject.x).toBe(mockDrawArea.x + 50);
    });

    test("align sets gameobject.x right by drawArea.x and the width of the row when alignment set to marginRight", () => {
        mockRowConfig.align = "marginRight";
        const resultsRow = new ResultsRow(mockScene, mockRowConfig, mockGetDrawArea);
        resultsRow.list = [mockGameObject];
        resultsRow.align();
        expect(mockGameObject.x).toBe(50 - mockDrawArea.x - 150);
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

    test("updateMarginAlignment does not update gameObjects positions when align is not marginLeft or marginRight", () => {
        const resultsRow = new ResultsRow(mockScene, mockRowConfig, mockGetDrawArea);
        mockRowConfig.align = "center";
        resultsRow.list = [mockGameObject];
        resultsRow.updateMarginAlignment();
        expect(mockGameObject.x).toBe(50);
    });

    test("updateMarginAlignment updates gameObjects x positions correctly when align is marginLeft", () => {
        const resultsRow = new ResultsRow(mockScene, mockRowConfig, mockGetDrawArea);
        mockRowConfig.align = "marginLeft";
        resultsRow.list = [mockGameObject];
        resultsRow.updateMarginAlignment();
        expect(mockGameObject.x).toBe(-12);
    });

    test("updateMarginAlignment updates gameObjects x positions correctly when align is marginRight", () => {
        const resultsRow = new ResultsRow(mockScene, mockRowConfig, mockGetDrawArea);
        mockRowConfig.align = "marginRight";
        resultsRow.list = [mockGameObject];
        resultsRow.updateMarginAlignment();
        expect(mockGameObject.x).toBe(-88);
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
