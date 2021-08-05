/**
 * @copyright BBC 2018
 * @author BBC Children's D+E
 * @license Apache-2.0
 */

import * as gmiModule from "../../src/core/gmi/gmi.js";

jest.mock("../../src/core/gmi/gmi.js");

const createMockGmi = mockGmi => {
	Object.defineProperty(gmiModule, "gmi", {
		get: jest.fn(() => mockGmi),
		set: jest.fn(),
	});
	global.window.getGMI = jest.fn(() => mockGmi);
};

export { createMockGmi };
