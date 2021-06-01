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

    describe("addGelContainer", () => {
        test("Adds a Gel container", () => {
            gelContainerModule.addGelContainer();
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

            gelContainerModule.addGelContainer(mockGame);

            const resize = scaler.onScaleChange.add.mock.calls[0][0];

            resize({ scale: 5 });

            expect(gelContainerModule.gel.style.top).toEqual("100px");
            expect(gelContainerModule.gel.style.left).toEqual("200px");
            expect(gelContainerModule.gel.style.transform).toEqual("scale(5)");
        });
    });
});
