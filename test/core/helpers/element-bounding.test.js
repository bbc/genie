/**
 * @copyright BBC 2019
 * @author BBC Children's D+E
 * @license Apache-2.0
 */

import { positionElement, enforceTextSize } from "../../../src/core/helpers/element-bounding.js";

describe("element-bounding", () => {
	let mockElement;
	let mockElementPosition;
	let safeArea;
	let metrics;
	let mockElementBounds;

	beforeEach(() => {
		mockElementBounds = {
			x: 0,
			y: -100,
			height: 50,
			width: 50,
		};
		mockElement = {
			setScale: jest.fn(),
			setFontSize: jest.fn(),
			setPosition: jest.fn(),
			setOrigin: jest.fn(),
			getBounds: jest.fn(() => ({
				x: 0,
				y: 0,
				height: 50,
				width: 50,
			})),
			defaultStyle: { fontSize: "1px" },
			x: 0,
			y: 0,
			height: 50,
			width: 50,
		};
		mockElementPosition = {
			x: 0,
			y: 0,
		};
		safeArea = {
			top: -100,
			bottom: -50,
			left: -50,
			right: 50,
		};
		metrics = {
			isMobile: false,
			buttonPad: 15,
			scale: 1,
		};
	});

	afterEach(() => {
		jest.clearAllMocks();
	});

	describe("position elements", () => {
		test("positions element with provided coordinates", () => {
			mockElementPosition.x = 10;
			mockElementPosition.y = 30;

			positionElement(mockElement, mockElementPosition, safeArea, metrics);
			expect(mockElement.setPosition).toHaveBeenCalledWith(10, 30);
		});

		test("set origin of element", () => {
			positionElement(mockElement, mockElementPosition, safeArea, metrics);
			expect(mockElement.setOrigin).toHaveBeenCalledWith(0.5);
		});

		test("restricts element to the safe area, when the title is too low on the page", () => {
			mockElementBounds.y = -250;
			mockElement.y = -250;

			mockElement.getBounds = jest.fn(() => mockElementBounds);

			positionElement(mockElement, mockElementPosition, safeArea, metrics);
			expect(mockElement.setPosition).toHaveBeenCalledWith(0, -100);
		});

		test("is restricted to the safe area, when the title is too high on the page", () => {
			mockElementBounds.y = -200;
			mockElement.y = -200;

			mockElement.getBounds = jest.fn(() => mockElementBounds);

			positionElement(mockElement, mockElementPosition, safeArea, metrics);

			expect(mockElement.setPosition).toHaveBeenCalledWith(0, -100);
		});

		test("is restricted to the safe area, when the title is too far left on the page", () => {
			mockElementBounds.x = -150;
			mockElement.x = -150;

			mockElement.getBounds = jest.fn(() => mockElementBounds);

			positionElement(mockElement, mockElementPosition, safeArea, metrics);

			expect(mockElement.setPosition).toHaveBeenCalledWith(-50, 0);
		});

		test("is restricted to the safe area, when the title is too far right on the page", () => {
			mockElementBounds.x = 150;
			mockElement.x = 150;

			mockElement.getBounds = jest.fn(() => mockElementBounds);

			positionElement(mockElement, mockElementPosition, safeArea, metrics);

			expect(mockElement.setPosition).toHaveBeenCalledWith(0, 0);
		});

		test("scales down text if it is larger (vertically) than the allowed area", () => {
			mockElement.height = 100;

			positionElement(mockElement, mockElementPosition, safeArea, metrics);

			expect(mockElement.setScale).toHaveBeenCalledTimes(1);
			expect(mockElement.setScale).toHaveBeenCalledWith(0.5);
		});

		test("scales down text if it is larger (horizontally) than the allowed area", () => {
			mockElement.width = 200;

			positionElement(mockElement, mockElementPosition, safeArea, metrics);

			expect(mockElement.setScale).toHaveBeenCalledTimes(1);
			expect(mockElement.setScale).toHaveBeenCalledWith(0.5);
		});

		test("does not scale down text if it is smaller than the allowed area", () => {
			positionElement(mockElement, mockElementPosition, safeArea, metrics);

			expect(mockElement.setScale).not.toHaveBeenCalledWith(0.5);
		});

		test("calls enforceTextSize and resized text", () => {
			mockElement.defaultStyle.fontSize = "5px";

			mockElement.type = "Text";

			positionElement(mockElement, mockElementPosition, safeArea, metrics);

			expect(mockElement.setFontSize).toHaveBeenCalledWith("13px");
		});
	});

	describe("enforceTextSize", () => {
		test("Scales up text if it is bellow the 13px threshold", () => {
			mockElement.defaultStyle.fontSize = "10px";

			enforceTextSize(mockElement, { scale: 1 });

			expect(mockElement.setFontSize).toHaveBeenCalledWith("13px");
		});

		test("Scales up text if it is bellow the 13px threshold at any when scale is < 1", () => {
			mockElement.defaultStyle.fontSize = "10px";

			enforceTextSize(mockElement, { scale: 0.5 });

			expect(mockElement.setFontSize).toHaveBeenCalledWith("26px");
		});

		test("Scales up text if it is bellow the 13px threshold at any when scale is > 1", () => {
			mockElement.defaultStyle.fontSize = "5px";

			enforceTextSize(mockElement, { scale: 2 });

			expect(mockElement.setFontSize).toHaveBeenCalledWith("6.5px");
		});

		test("resets text to default size when above the 13px threshold", () => {
			mockElement.defaultStyle.fontSize = "15px";

			enforceTextSize(mockElement, { scale: 1 });

			expect(mockElement.setFontSize).toHaveBeenCalledTimes(1);
			expect(mockElement.setFontSize).toHaveBeenCalledWith("15px");
		});
	});
});
