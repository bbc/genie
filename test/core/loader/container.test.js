import { createMockGmi } from "../../mock/gmi.js";
import { domElement } from "../../mock/dom-element.js";
import { getContainerDiv } from "../../../src/core/loader/container.js";
import { gmi } from "../../../src/core/gmi/gmi.js";

/**
 * @copyright BBC 2020
 * @author BBC Children's D+E
 * @license Apache-2.0
 */
describe("getParentContainer Method", () => {
    let mockGmi;
    let containerDiv;

    beforeEach(() => {
        mockGmi = { setGmi: jest.fn() };
        createMockGmi(mockGmi);

        containerDiv = domElement();

        jest.spyOn(global.document, "getElementById").mockImplementation(argument => {
            if (argument === mockGmi.gameContainerId) {
                return containerDiv;
            }
        });
    });

    test("returns the gameContainer for gmi.gameContainerId", () => {
        gmi.gameContainerId = "some-id";
        expect(getContainerDiv()).toBe(containerDiv);
    });

    test("throws an error if the game container element cannot be found", () => {
        document.getElementById.mockImplementation(() => false);
        expect(getContainerDiv).toThrowError(`Container element "#some-id" not found`); // eslint-disable-line quotes
    });
});
