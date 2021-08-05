/**
 * @copyright BBC 2019
 * @author BBC Children's D+E
 * @license Apache-2.0
 */
import { hookErrors } from "../../../src/core/loader/hook-errors.js";

describe("Load Screen", () => {
	let mockContainerEl;
	let mockMessageEl;

	beforeEach(() => {
		mockMessageEl = {
			style: {},
		};

		mockContainerEl = {
			appendChild: jest.fn(() => mockMessageEl),
		};
		jest.spyOn(global.document, "getElementById").mockImplementation(id => (id ? mockContainerEl : false));
		global.window.addEventListener = jest.fn();
	});

	afterEach(() => jest.clearAllMocks());

	describe("hook errors", () => {
		test("add an error listener", () => {
			hookErrors("test-id");
			expect(global.window.addEventListener).toHaveBeenCalledWith("error", expect.any(Function));
		});

		test("appends pre element to div of passed in Id", () => {
			hookErrors("test-id");
			const mockErrorEvent = {
				error: {
					message: "test error message",
				},
			};
			const callback = global.window.addEventListener.mock.calls[0][1];
			callback(mockErrorEvent);

			expect(mockContainerEl.appendChild.mock.calls[0][0].tagName).toEqual("PRE");
		});

		test("appends pre element to document body if no id passed in", () => {
			jest.spyOn(global.document.body, "appendChild");
			hookErrors();
			const mockErrorEvent = {
				error: {
					message: "test error message",
				},
			};
			const callback = global.window.addEventListener.mock.calls[0][1];
			callback(mockErrorEvent);

			expect(global.document.body.appendChild.mock.calls[0][0].tagName).toEqual("PRE");
		});

		test("Styles message Element", () => {
			hookErrors("test-id");
			const mockErrorEvent = {
				error: {
					message: "test error message",
				},
			};
			const callback = global.window.addEventListener.mock.calls[0][1];
			callback(mockErrorEvent);

			const expected = {
				backgroundColor: "black",
				color: "white",
				height: "calc(100% - 2 * 2em)",
				left: "0",
				padding: "2em",
				position: "absolute",
				top: "0",
				width: "calc(100% - 2 * 2em)",
			};

			expect(mockMessageEl.style).toEqual(expected);
		});

		test("Only adds one pre element for all errors ", () => {
			hookErrors("test-id");
			const mockErrorEvent = {
				error: {
					message: "test error message",
				},
			};
			const callback = global.window.addEventListener.mock.calls[0][1];
			callback(mockErrorEvent);
			callback(mockErrorEvent);

			expect(mockContainerEl.appendChild).toHaveBeenCalledTimes(1);
		});

		test("Sets correct text ", () => {
			hookErrors("test-id");
			const mockErrorEvent = {
				error: {
					message: "test error message",
				},
			};
			const callback = global.window.addEventListener.mock.calls[0][1];
			callback(mockErrorEvent);

			const expected = `Something isn't working:\n\n${mockErrorEvent.error.message}\n\n`;

			expect(mockMessageEl.innerText).toEqual(expected);
		});

		test("Sets correct text if no error.message ", () => {
			hookErrors("test-id");
			const mockErrorEvent = {
				error: {
					//message: "test error message",
				},
			};
			const callback = global.window.addEventListener.mock.calls[0][1];
			callback(mockErrorEvent);

			const expected = `Something isn't working:\n\n${mockErrorEvent.error}\n\n`;

			expect(mockMessageEl.innerText).toEqual(expected);
		});
	});
});
