/**
 * @copyright BBC 2020
 * @author BBC Children's D+E
 * @license Apache-2.0
 */
import * as Rows from "../../../src/core/layout/rows.js";
import { ResultsRow } from "../../../src/components/results/results-row.js";

jest.mock("../../../src/components/results/results-row.js");

describe("Rows", () => {
    let mockScene;
    let mockRowsConfig;
    let mockSafeArea;

    beforeEach(() => {
        mockScene = {
            layout: {
                addCustomGroup: jest.fn(),
                getSafeArea: jest.fn(() => mockSafeArea),
            },
        };
        mockRowsConfig = [{}, {}, {}];
        mockSafeArea = {
            height: 6,
            width: 10,
            x: 20,
            y: 36,
        };
    });

    test("RowTypes.Results enum points to ResultsRow", () => {
        expect(Rows.RowType.Results).toBe(ResultsRow);
    });

    test("passing in RowTypes.Results returns a ResultsRow container", () => {
        const rows = Rows.create(mockScene, mockRowsConfig, Rows.RowType.Results);
        expect(rows.containers.length).toBe(mockRowsConfig.length);
        rows.containers.forEach(container => expect(container).toBeInstanceOf(ResultsRow));
    });

    test("creates the correct number of containers", () => {
        mockRowsConfig = [{}, {}];
        const rows = Rows.create(mockScene, mockRowsConfig, Rows.RowType.Results);
        expect(rows.containers.length).toBe(mockRowsConfig.length);
    });

    test("adds each container to the layout", () => {
        const rows = Rows.create(mockScene, mockRowsConfig, Rows.RowType.Results);
        expect(rows.containers.length).toBe(mockRowsConfig.length);
        rows.containers.forEach((container, index) =>
            expect(mockScene.layout.addCustomGroup).toHaveBeenCalledWith(`row-${index}`, container),
        );
    });

    test("getRectForRow(0) returns a function which returns the correct rectangle for the top row", () => {
        const rows = Rows.create(mockScene, mockRowsConfig, Rows.RowType.Results);
        expect(rows.getRectForRow(0)()).toEqual(
            new Phaser.Geom.Rectangle(
                mockSafeArea.x,
                mockSafeArea.y,
                mockSafeArea.width,
                mockSafeArea.height / mockRowsConfig.length,
            ),
        );
    });

    test("getRectForRow(rowsConfig.length) returns a function which returns the correct rectangle for the bottom row", () => {
        const rows = Rows.create(mockScene, mockRowsConfig, Rows.RowType.Results);
        expect(rows.getRectForRow(mockRowsConfig.length)()).toEqual(
            new Phaser.Geom.Rectangle(
                mockSafeArea.x,
                mockSafeArea.y + mockSafeArea.height,
                mockSafeArea.width,
                mockSafeArea.height / mockRowsConfig.length,
            ),
        );
    });
});
