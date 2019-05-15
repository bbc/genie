/**
 * @copyright BBC 2018
 * @author BBC Children's D+E
 * @license Apache-2.0
 */

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
        mockParentElement = {
            insertBefore: jest.fn(),
            contains: jest.fn(),
            removeChild: jest.fn(),
        };
        mockCarouselDomElement = {
            setAttribute: jest.fn().mockImplementation((attribute, value) => {
                mockCarouselDomElement.attributes[attribute] = value;
            }),
            style: {},
            attributes: {},
            appendChild: jest.fn(),
        };
        global.document.createElement = jest.fn().mockImplementation(() => mockCarouselDomElement);
        mockAccessibleElements = [
            {
                setAttribute: jest.fn().mockImplementation((attribute, value) => {
                    mockAccessibleElements[0].attributes[attribute] = value;
                }),
                style: {},
                attributes: {},
            },
            {
                setAttribute: jest.fn().mockImplementation((attribute, value) => {
                    mockAccessibleElements[1].attributes[attribute] = value;
                }),
                style: {},
                attributes: {},
            },
            {
                setAttribute: jest.fn().mockImplementation((attribute, value) => {
                    mockAccessibleElements[2].attributes[attribute] = value;
                }),
                style: {},
                attributes: {},
            },
        ];

        jest
            .spyOn(accessibleDomElement, "accessibleDomElement")
            .mockReturnValueOnce({ el: mockAccessibleElements[0] })
            .mockReturnValueOnce({ el: mockAccessibleElements[1] })
            .mockReturnValueOnce({ el: mockAccessibleElements[2] });

        firstMockSprite = { events: { onDestroy: { add: jest.fn() } } };
        mockSprite = { events: { onDestroy: { add: jest.fn() } } };
        mockSprites = [firstMockSprite, mockSprite, mockSprite];
    });

    afterEach(() => jest.clearAllMocks());

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
            expect(domElement.ariaHidden).toBe(expectedHidden);
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

    test("removes the carousel when the first carousel item sprite is destroyed", () => {
        mockParentElement.contains.mockImplementation(() => true);
        accessibleCarouselElements.create("select-screen", mockSprites, mockParentElement);
        const destroyCallback = firstMockSprite.events.onDestroy.add.mock.calls[0][0];
        destroyCallback();
        expect(mockParentElement.contains).toHaveBeenCalledWith(mockCarouselDomElement);
        expect(mockParentElement.removeChild).toHaveBeenCalledWith(mockCarouselDomElement);
    });
});
