/**
 * @copyright BBC 2021
 * @author BBC Children's D+E
 * @license Apache-2.0
 */
import * as gelDomModule from "../../../src/core/layout/gel-dom.js";
import { getContainerDiv } from "../../../src/core/loader/container.js";
import * as scaler from "../../../src/core/scaler.js";

jest.mock("../../../src/core/loader/container.js");

describe("Gel Dom", () => {
	let mockDiv;

	beforeEach(() => {
		mockDiv = { appendChild: jest.fn() };
		getContainerDiv.mockImplementation(() => mockDiv);
		scaler.onScaleChange.add = jest.fn();
	});

	afterEach(jest.clearAllMocks);

	describe("initGelDom", () => {
		test("Adds a Gel container", () => {
			gelDomModule.initGelDom();
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

			gelDomModule.initGelDom(mockGame);

			const resize = scaler.onScaleChange.add.mock.calls[0][0];

			resize({ scale: 5 });

			const root = mockDiv.appendChild.mock.calls[0][0];

			expect(root.style.top).toEqual("100px");
			expect(root.style.left).toEqual("200px");
			expect(root.style.transform).toEqual("scale(5)");
		});
	});

	describe("Gel Dom methods", () => {
		describe("Start", () => {
			test("Adds scene div", () => {
				const gelDom = gelDomModule.initGelDom();
				const root = mockDiv.appendChild.mock.calls[0][0];
				root.appendChild = jest.fn();
				gelDom.start();

				expect(root.appendChild).toHaveBeenCalledTimes(1);
			});
		});

		describe("Hide", () => {
			test("Sets top level scene div display to none", () => {
				const gelDom = gelDomModule.initGelDom();
				const root = mockDiv.appendChild.mock.calls[0][0];
				root.appendChild = jest.fn();
				gelDom.start();
				gelDom.start();
				const layer1 = root.appendChild.mock.calls[0][0];
				const layer2 = root.appendChild.mock.calls[1][0];

				gelDom.hide();

				expect(layer1.style.display).toBe("");
				expect(layer2.style.display).toBe("none");
			});
		});

		describe("Current", () => {
			test("Returns the top level scene div", () => {
				const gelDom = gelDomModule.initGelDom();
				const root = mockDiv.appendChild.mock.calls[0][0];
				root.appendChild = jest.fn();
				gelDom.start();
				gelDom.start();
				const layer2 = root.appendChild.mock.calls[1][0];
				expect(gelDom.current()).toBe(layer2);
			});
		});

		describe("Clear", () => {
			test("Removes the top level scene", () => {
				const gelDom = gelDomModule.initGelDom();
				const root = mockDiv.appendChild.mock.calls[0][0];
				gelDom.start();
				gelDom.start();

				gelDom.clear();
				expect(root.children.length).toBe(1);
			});

			test("sets underlying scene div's display style to default", () => {
				const gelDom = gelDomModule.initGelDom();
				const root = mockDiv.appendChild.mock.calls[0][0];
				root.appendChild = jest.fn();
				gelDom.start();
				gelDom.hide();
				gelDom.start();
				gelDom.clear();

				const layer1 = root.appendChild.mock.calls[0][0];

				expect(layer1.style.display).toBe("");
			});
		});
	});
});
