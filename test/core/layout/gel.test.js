/**
 * @copyright BBC 2021
 * @author BBC Children's D+E
 * @license Apache-2.0
 */
import * as gelModule from "../../../src/core/layout/gel.js";
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
            gelModule.initGel();
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

            gelModule.initGel(mockGame);

            const resize = scaler.onScaleChange.add.mock.calls[0][0];

            resize({ scale: 5 });

            const root = mockDiv.appendChild.mock.calls[0][0];

            expect(root.style.top).toEqual("100px");
            expect(root.style.left).toEqual("200px");
            expect(root.style.transform).toEqual("scale(5)");
        });
    });

    describe("Gel methods", () => {
        describe("Start", () => {
            test("Adds scene div", () => {
                const gel = gelModule.initGel();
                const root = mockDiv.appendChild.mock.calls[0][0];
                root.appendChild = jest.fn();
                gel.start();

                expect(root.appendChild).toHaveBeenCalledTimes(1);
            });
        });

        describe("Hide", () => {
            test("Sets top level scene div display to none", () => {
                const gel = gelModule.initGel();
                const root = mockDiv.appendChild.mock.calls[0][0];
                root.appendChild = jest.fn();
                gel.start();
                gel.start();
                const layer1 = root.appendChild.mock.calls[0][0];
                const layer2 = root.appendChild.mock.calls[1][0];

                gel.hide();

                expect(layer1.style.display).toBe("");
                expect(layer2.style.display).toBe("none");
            });
        });

        describe("Current", () => {
            test("Returns the top level scene div", () => {
                const gel = gelModule.initGel();
                const root = mockDiv.appendChild.mock.calls[0][0];
                root.appendChild = jest.fn();
                gel.start();
                gel.start();
                const layer2 = root.appendChild.mock.calls[1][0];
                expect(gel.current()).toBe(layer2);
            });
        });

        describe("Clear", () => {
            test("Removes the top level scene", () => {
                const gel = gelModule.initGel();
                const root = mockDiv.appendChild.mock.calls[0][0];
                gel.start();
                gel.start();

                gel.clear();
                expect(root.children.length).toBe(1);
            });

            test("sets underlying scene div's display style to default", () => {
                const gel = gelModule.initGel();
                const root = mockDiv.appendChild.mock.calls[0][0];
                root.appendChild = jest.fn();
                gel.start();
                gel.hide();
                gel.start();
                gel.clear();

                const layer1 = root.appendChild.mock.calls[0][0];

                expect(layer1.style.display).toBe("");
            });
        });
    });
});
