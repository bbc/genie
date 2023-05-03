/**
 * @copyright BBC 2020
 * @author BBC Children's D+E
 * @license Apache-2.0
 */
import { createMockGmi } from "../../mock/gmi.js";
import { domElement } from "../../mock/dom-element.js";
import { getContainerDiv } from "../../../src/core/loader/container.js";
import { gmi } from "../../../src/core/gmi/gmi.js";

describe("getParentContainer Method", () => {
	let mockGmi;
	let containerDiv;

	beforeEach(() => {
		mockGmi = { setGmi: jest.fn() };
		createMockGmi(mockGmi);

		containerDiv = domElement();

		jest.spyOn(global.document, "getElementById").mockImplementation(id => {
			if (id === "correct-id") {
				return containerDiv;
			}
		});
	});

	afterEach(jest.clearAllMocks);

	test("returns the gameContainer for gmi.gameContainerId", () => {
		gmi.gameContainerId = "correct-id";
		expect(getContainerDiv()).toBe(containerDiv);
	});

	test("throws an error if the game container element cannot be found", () => {
		gmi.gameContainerId = "wrong-id";
		expect(getContainerDiv).toThrowError(`Container element "#wrong-id" not found`); // eslint-disable-line quotes
	});
});
