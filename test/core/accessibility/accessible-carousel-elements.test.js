/**
 * @copyright BBC 2018
 * @author BBC Children's D+E
 * @license Apache-2.0
 */
import { domElement } from "../../mock/dom-element";

import * as accessibleDomElement from "../../../src/core/accessibility/accessible-dom-element.js";
import * as accessibleCarouselElements from "../../../src/core/accessibility/accessible-carousel-elements.js";

describe("Accessible Carousel Elements", () => {
	let mockSprite;
	let mockSprites;
	let firstMockSprite;
	let mockParentElement;
	let mockCarouselDomElement;
	let mockAccessibleElements;

	beforeEach(() => {
		mockParentElement = domElement();
		mockCarouselDomElement = domElement();
		global.document.createElement = jest.fn().mockImplementation(() => mockCarouselDomElement);
		mockAccessibleElements = [domElement(), domElement(), domElement()];
		jest.spyOn(accessibleDomElement, "accessibleDomElement")
			.mockReturnValueOnce({ el: mockAccessibleElements[0] })
			.mockReturnValueOnce({ el: mockAccessibleElements[1] })
			.mockReturnValueOnce({ el: mockAccessibleElements[2] });

		firstMockSprite = { once: jest.fn() };
		mockSprite = { once: jest.fn() };
		mockSprites = [firstMockSprite, mockSprite, mockSprite];
	});

	afterEach(jest.clearAllMocks);

	test("creates a carousel DOM element", () => {
		accessibleCarouselElements.create("select-screen", mockSprites, mockParentElement);
		expect(mockCarouselDomElement.id).toBe("carousel-select-screen");
		expect(mockCarouselDomElement.attributes["aria-live"]).toBe("polite");
	});

	test("adds correct CSS to the carousel DOM element", () => {
		const expectedStyles = { position: "absolute", overflow: "hidden", width: "0", height: "0" };
		accessibleCarouselElements.create("select-screen", mockSprites, mockParentElement);
		expect(mockCarouselDomElement.style).toEqual(expectedStyles);
	});

	test("prepends the carousel DOM element to the parent element to give the correct on-screen tabbing start position for iPhoneX", () => {
		accessibleCarouselElements.create("select-screen", mockSprites, mockParentElement);
		expect(mockParentElement.insertBefore).toHaveBeenCalledWith(
			mockCarouselDomElement,
			mockParentElement.firstChild,
		);
	});

	test("creates an accessible DOM element for each carousel item", () => {
		accessibleCarouselElements.create("select-screen", mockSprites, mockParentElement);

		expect(accessibleDomElement.accessibleDomElement).toHaveBeenCalledTimes(3);

		mockSprites.forEach((mockSprite, index) => {
			const domElement = accessibleDomElement.accessibleDomElement.mock.calls[index][0];
			const count = index + 1;
			const expectedHidden = index !== 0;

			expect(domElement.id).toEqual("carousel-select-screen__" + count);
			expect(domElement["aria-hidden"]).toBe(expectedHidden);
			expect(domElement.parent).toEqual(mockCarouselDomElement);
			expect(domElement.text).toEqual("Page " + count);
			expect(domElement.notClickable).toBe(true);
		});
	});

	test("creates accessible DOM elements with custom text, if set in the theme choices", () => {
		const mockChoices = [
			{ accessibilityText: "Custom Text 1" },
			{ accessibilityText: "Custom Text 2" },
			{ accessibilityText: "Custom Text 3" },
		];
		accessibleCarouselElements.create("select-screen", mockSprites, mockParentElement, mockChoices);

		mockSprites.forEach((mockSprite, index) => {
			const count = index + 1;
			const domElement = accessibleDomElement.accessibleDomElement.mock.calls[index][0];
			expect(domElement.text).toEqual("Custom Text " + count);
		});
	});

	test("Hides all but the first element to support Firefox with NVDA screen reader", () => {
		accessibleCarouselElements.create("select-screen", mockSprites, mockParentElement);
		mockAccessibleElements.forEach((accessibleElement, index) => {
			expect(accessibleElement.style.display).toEqual(index ? "none" : "block");
		});
	});

	test("focuses on the first carousel element on page load", () => {
		accessibleCarouselElements.create("select-screen", mockSprites, mockParentElement);
		expect(mockAccessibleElements[0].focus).toHaveBeenCalled();
		expect(mockAccessibleElements[1].focus).not.toHaveBeenCalled();
		expect(mockAccessibleElements[2].focus).not.toHaveBeenCalled();
	});

	test("removes the carousel when the first carousel item sprite is destroyed", () => {
		mockParentElement.contains.mockImplementation(() => true);
		accessibleCarouselElements.create("select-screen", mockSprites, mockParentElement);
		const destroyCallback = firstMockSprite.once.mock.calls[0][1];
		destroyCallback();
		expect(mockParentElement.contains).toHaveBeenCalledWith(mockCarouselDomElement);
		expect(mockParentElement.removeChild).toHaveBeenCalledWith(mockCarouselDomElement);
	});

	test("does not remove the carousel if the first item's parent is not a carousel", () => {
		mockParentElement.contains.mockImplementation(() => false);
		accessibleCarouselElements.create("select-screen", mockSprites, mockParentElement);
		const destroyCallback = firstMockSprite.once.mock.calls[0][1];
		destroyCallback();
		expect(mockParentElement.contains).toHaveBeenCalledWith(mockCarouselDomElement);
		expect(mockParentElement.removeChild).not.toHaveBeenCalled();
	});
});
