/**
 * @copyright BBC 2021
 * @author BBC Children's D+E
 * @license Apache-2.0
 */
import { DomText } from "../../../src/core/debug/dom-text.js";

import { getContainerDiv } from "../../../src/core/loader/container.js";
jest.mock("../../../src/core/loader/container.js");

describe("Dom Text Debug Screen", () => {
	let domTextScreen;
	let mockDomText;
	beforeEach(() => {
		domTextScreen = new DomText();
		domTextScreen.events = {
			once: jest.fn(),
		};

		mockDomText = {
			remove: jest.fn(),
			setPosition: jest.fn(0),
		};

		const mockData = { config: { "debug-dom-text": {} } };

		domTextScreen.setData(mockData);
		domTextScreen.scene = { key: "debug-dom-text" };
		domTextScreen.setLayout = jest.fn();
		domTextScreen.add = {
			domText: jest.fn(() => mockDomText),
		};
		domTextScreen.navigation = { next: jest.fn() };

		const mockDiv = { appendChild: jest.fn() };
		getContainerDiv.mockImplementation(() => mockDiv);
	});

	afterEach(jest.clearAllMocks);

	describe("Dom Text Debug Screen Create Method", () => {
		test("Adds some DomText to demo", () => {
			domTextScreen.create();

			expect(domTextScreen.add.domText).toHaveBeenCalled();
		});
	});
});
