/**
 * @copyright BBC 2021
 * @author BBC Children's D+E
 * @license Apache-2.0
 */
import * as gelContainerModule from "../../../src/core/layout/gel.js";
import { getContainerDiv } from "../../../src/core/loader/container.js";
import * as scaler from "../../../src/core/scaler.js";

jest.mock("../../../src/core/loader/container.js");

describe("Gel Container", () => {
    let mockDiv;

    beforeEach(() => {
        mockDiv = { appendChild: jest.fn() };
        getContainerDiv.mockImplementation(() => mockDiv);
        scaler.onScaleChange.add = jest.fn();
    });

    afterEach(jest.clearAllMocks);

    describe("initGel", () => {
        test("Adds a Gel container", () => {
            gelContainerModule.initGel();
            expect(mockDiv.appendChild).toHaveBeenCalledTimes(1);
        });
    });

    describe("Resizing", () => {
        test("Resizes and positions correctly", () => {
            const mockGame = {
                canvas: {
                    style: {
                        marginTop: "100px",
                        marginLeft: "200px",
                    },
                },
            };

            gelContainerModule.initGel(mockGame);

            const resize = scaler.onScaleChange.add.mock.calls[0][0];

            resize({ scale: 5 });

            const root = mockDiv.appendChild.mock.calls[0][0];

            expect(root.style.top).toEqual("100px");
            expect(root.style.left).toEqual("200px");
            expect(root.style.transform).toEqual("scale(5)");
        });
    });
});
