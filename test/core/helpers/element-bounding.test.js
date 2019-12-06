/**
 * @copyright BBC 2019
 * @author BBC Children's D+E
 * @license Apache-2.0
 */

import { getItemBounds, positionElement, enforceTextSize } from "../../../src/core/helpers/element-bounding.js";

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
            setPosition: jest.fn(),
            setOrigin: jest.fn(),
            getBounds: jest.fn(() => ({
                x: 0,
                y: 0,
                height: 50,
                width: 50,
            })),
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
        };
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    describe("position elements", () => {
        test("does not throw errors when no element is provided", () => {
            positionElement(undefined, mockElementPosition, safeArea, metrics);
            expect(positionElement).not.toThrow();
        });
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

            expect(mockElement.setScale).not.toHaveBeenCalled();
        });
    });

    describe("getItemBounds", () => {
        test("returns bounds for an element", () => {
            expect(getItemBounds(mockElement, metrics)).toEqual({
                top: 0,
                bottom: 50,
                left: 0,
                right: 50,
            });
        });

        test("padding is respected by boundaries when isMobile equals true and element is a sprite", () => {
            metrics.isMobile = true;
            mockElement.type = "Sprite";
            expect(getItemBounds(mockElement, metrics)).toEqual({
                top: -15,
                bottom: 65,
                left: -15,
                right: 65,
            });
        });

        test("padding is not respected by boundaries when isMobile equals true and element is a text", () => {
            metrics.isMobile = true;
            mockElement.type = "Text";
            expect(getItemBounds(mockElement, metrics)).toEqual({
                top: 0,
                bottom: 50,
                left: 0,
                right: 50,
            });
        });
    });

    describe("enforceTextSize", () => {
        test("Scales up text if it is bellow the 13px threshold", () => {
            mockElement.height = 10;
            enforceTextSize(mockElement, { scale: 0.9 });

            expect(mockElement.setScale).toHaveBeenCalledWith(3.333);
        });
    });
});
