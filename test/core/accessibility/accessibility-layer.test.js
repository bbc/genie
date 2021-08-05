/**
 * @copyright BBC 2018
 * @author BBC Children's D+E
 * @license Apache-2.0
 */
import { domElement } from "../../mock/dom-element.js";

import * as a11y from "../../../src/core/accessibility/accessibility-layer.js";

describe("Accessibility Layer", () => {
	let gameParentElement;
	let element;

	beforeEach(() => {
		gameParentElement = domElement();
		jest.spyOn(global.document, "createElement").mockImplementation(() => element);
		jest.spyOn(global.document, "getElementById").mockImplementation(() => gameParentElement);
		a11y.destroy();
	});
	afterEach(() => jest.clearAllMocks());

	describe("create Method", () => {
		beforeEach(() => {
			a11y.create();
		});

		test("Appends the root DOM element", () => {
			const rootDiv = gameParentElement.appendChild.mock.calls[0][0];
			expect(rootDiv.tagName).toBe("DIV");
			expect(rootDiv.id).toBe("accessibility");
		});

		test("sets the role of the accessibility container div to 'application' (for NVDA/FF tabbing focus)", () => {
			const rootDiv = gameParentElement.appendChild.mock.calls[0][0];
			expect(rootDiv.getAttribute("role")).toBe("application");
		});
	});

	describe("addGroupAt Method", () => {
		beforeEach(() => {
			element = domElement();
			jest.spyOn(global.document, "createElement").mockImplementation(() => element);

			a11y.create();
		});

		test("Creates a new group element with correct id", () => {
			a11y.addGroupAt("test-group-id");
			expect(element.getAttribute("id")).toBe("accessible-group-test-group-id");
		});

		test("Adds the data-type 'group' to each element", () => {
			a11y.addGroupAt("test-group-id");
			expect(element.getAttribute("data-type")).toBe("group");
		});
	});

	describe("addButton Method", () => {
		beforeEach(() => {
			a11y.create();
		});

		test("Add items to the domButtons array", () => {
			expect(a11y.addButton("test-button")).toBe(1);
			expect(a11y.addButton("test-button")).toBe(2);
		});
	});

	describe("removeButton Method", () => {
		beforeEach(() => {
			a11y.create();
		});

		test("Removes items from the domButtons array", () => {
			a11y.addButton("test-button1");
			a11y.addButton("test-button2");
			a11y.addButton("test-button3");

			expect(a11y.removeButton("test-button3")).toStrictEqual(["test-button1", "test-button2"]);
		});
	});

	describe("reset Method", () => {
		beforeEach(() => {
			a11y.create();
			global.document.createElement.mockImplementation(() => domElement());
		});

		test("Calls removeFromParent on buttons", () => {
			const rootDiv = gameParentElement.appendChild.mock.calls[0][0];
			rootDiv.appendChild = jest.fn();

			const mockButton = {
				id: "mock-button-id",
				config: { group: "test-group-1" },
				accessibleElement: { el: { id: "mock-button-id" } },
				dataset: {},
				parentElement: { removeChild: jest.fn() },
			};

			Object.defineProperty(rootDiv, "childNodes", { get: jest.fn(() => [mockButton]), configurable: true });
			a11y.addButton(mockButton);
			a11y.reset();
			expect(mockButton.parentElement.removeChild).toHaveBeenCalled();
		});

		test("Calls removeFromParent on buttons in groups", () => {
			const mockButton = {
				id: "mock-button-id",
				config: { group: "test-group-1" },
				accessibleElement: { el: { id: "mock-button-id" } },
				dataset: {},
				parentElement: { removeChild: jest.fn() },
			};

			const rootDiv = gameParentElement.appendChild.mock.calls[0][0];
			rootDiv.appendChild = jest.fn();
			const group1 = { dataset: { type: "group" }, childNodes: [mockButton] };

			a11y.addGroupAt(group1);

			Object.defineProperty(rootDiv, "childNodes", { get: jest.fn(() => [group1]), configurable: true });

			a11y.addButton(mockButton);
			a11y.reset();
			expect(mockButton.parentElement.removeChild).toHaveBeenCalled();
		});

		test("attaches groups to the root element in the correct order", () => {
			const rootDiv = gameParentElement.appendChild.mock.calls[0][0];

			rootDiv.appendChild = jest.fn();

			a11y.addGroupAt("test-group-1");
			a11y.addGroupAt("test-group-2");
			a11y.addGroupAt("test-group-3", 1);
			a11y.reset();

			expect(rootDiv.appendChild.mock.calls[0][0].getAttribute("id")).toBe("accessible-group-test-group-1");
			expect(rootDiv.appendChild.mock.calls[1][0].getAttribute("id")).toBe("accessible-group-test-group-3");
			expect(rootDiv.appendChild.mock.calls[2][0].getAttribute("id")).toBe("accessible-group-test-group-2");
		});

		test("attaches button to assigned group", () => {
			const rootDiv = gameParentElement.appendChild.mock.calls[0][0];
			rootDiv.appendChild = jest.fn();

			a11y.addGroupAt("test-group-1");

			const mockButton = {
				config: { group: "test-group-1" },
				accessibleElement: { el: { id: "mock-button-id" } },
			};

			a11y.addButton(mockButton);
			a11y.reset();
			const testGroup1 = rootDiv.appendChild.mock.calls[0][0];
			expect(testGroup1.appendChild.mock.calls[0][0].id).toBe("mock-button-id");
		});
	});
});
