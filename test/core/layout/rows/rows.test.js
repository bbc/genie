/**
 * @copyright BBC 2020
 * @author BBC Children's D+E
 * @license Apache-2.0
 */
import * as Rows from "../../../../src/core/layout/rows/rows.js";

jest.mock("../../../../src/core/layout/rows/results-row.js");

describe("Rows", () => {
    let mockScene;
    let mockRowsConfig;

    beforeEach(() => {
        mockScene = {
            layout: {
                addCustomGroup: jest.fn(),
            },
        };
        mockRowsConfig = [{}, {}, {}];
    });

    test("creates the correct number of containers", () => {
        const rows = Rows.create(mockScene, mockRowsConfig, Rows.RowType.Results);
        expect(rows.containers.length).toBe(mockRowsConfig.length);
    });
});
