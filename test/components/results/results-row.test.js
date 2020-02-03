/**
 * @copyright BBC 2020
 * @author BBC Children's D+E
 * @license Apache-2.0
 */
import { ResultsRow } from "../../../src/components/results/results-row.js";
import { ResultsText } from "../../../src/components/results/results-text.js";
import { ResultsSprite } from "../../../src/components/results/results-sprite.js";
import { ResultsCountup } from "../../../src/components/results/results-countup.js";
import { mockBaseScene } from "../../mock/mock-scene.js";

jest.mock("../../../src/components/results/results-text.js");
jest.mock("../../../src/components/results/results-sprite.js");
jest.mock("../../../src/components/results/results-countup.js");

describe("Results Row", () => {
    let mockScene;
    let mockRowConfig;
    let mockGetDrawArea;
    let mockDrawArea;
    let mockGameObject;
    let mockImage;

    beforeEach(() => {
        mockImage = {};
        mockScene = mockBaseScene();
        mockScene.scene = { key: "results" };
        mockScene.add = { image: jest.fn(() => mockImage) };
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
        ResultsRow.prototype.sendToBack = jest.fn();
    });

    afterEach(() => jest.clearAllMocks());

    test("sets container alpha when specified in config", () => {
        mockRowConfig.alpha = 0.6;
        const resultsRow = new ResultsRow(mockScene, mockRowConfig, mockGetDrawArea);
        expect(resultsRow.alpha).toEqual(0.6);
    });

    test("sets container alpha to 1 when not specified in config", () => {
        const resultsRow = new ResultsRow(mockScene, mockRowConfig, mockGetDrawArea);
        expect(resultsRow.alpha).toEqual(1);
    });

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

    test("drawRow adds a ResultsCountup object to the container when defined in rowConfig", () => {
        mockRowConfig = {
            format: [{ type: "countup", content: "test" }],
        };
        const resultsRow = new ResultsRow(mockScene, mockRowConfig, mockGetDrawArea);
        expect(resultsRow.add).toHaveBeenCalledWith(expect.any(ResultsCountup));
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

    describe("Backdrop Image", () => {
        test("creates a backdrop image for the row at 0, 0 by default", () => {
            mockRowConfig.backdrop = { key: "results.row-backdrop-1", alpha: 0.5 };
            new ResultsRow(mockScene, mockRowConfig, mockGetDrawArea);
            expect(mockScene.add.image).toHaveBeenCalledWith(0, 0, mockRowConfig.backdrop.key);
        });

        test("creates a backdrop image with correct x and y offsets", () => {
            mockRowConfig.backdrop = { key: "results.row-backdrop-1", offsetX: 20, offsetY: 40 };
            new ResultsRow(mockScene, mockRowConfig, mockGetDrawArea);
            expect(mockScene.add.image).toHaveBeenCalledWith(20, 40, mockRowConfig.backdrop.key);
        });

        test("does not create a backdrop if not set in the config", () => {
            delete mockRowConfig.backdrop;
            new ResultsRow(mockScene, mockRowConfig, mockGetDrawArea);
            expect(mockScene.add.image).not.toHaveBeenCalled();
        });

        test("sets the correct alpha and height for the backdrop image", () => {
            mockRowConfig.backdrop = { key: "results.row-backdrop-1", alpha: 0.5 };
            new ResultsRow(mockScene, mockRowConfig, mockGetDrawArea);
            expect(mockImage.alpha).toBe(0.5);
            expect(mockImage.height).toBe(0);
        });

        test("sets the backdrop alpha to 1 when none is provided in the config", () => {
            mockRowConfig.backdrop = { key: "results.row-backdrop-1" };
            new ResultsRow(mockScene, mockRowConfig, mockGetDrawArea);
            expect(mockImage.alpha).toBe(1);
        });

        test("adds the backdrop to the row container", () => {
            mockRowConfig.backdrop = { key: "results.row-backdrop-1" };
            new ResultsRow(mockScene, mockRowConfig, mockGetDrawArea);
            expect(ResultsRow.prototype.add).toHaveBeenCalledWith(mockImage);
        });

        test("moves the backdrop image to the back", () => {
            mockRowConfig.backdrop = { key: "results.row-backdrop-1" };
            new ResultsRow(mockScene, mockRowConfig, mockGetDrawArea);
            expect(ResultsRow.prototype.sendToBack).toHaveBeenCalledWith(mockImage);
        });
    });

    test("reset updates container position", () => {
        const resultsRow = new ResultsRow(mockScene, mockRowConfig, mockGetDrawArea);
        mockDrawArea.centerX = 43;
        mockDrawArea.centerY = 23;
        resultsRow.reset();
        expect(resultsRow.x).toBe(mockDrawArea.centerX);
        expect(resultsRow.y).toBe(mockDrawArea.centerY);
    });
});
