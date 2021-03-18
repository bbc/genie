/**
 * @copyright BBC 2021
 * @author BBC Children's D+E
 * @license Apache-2.0
 */
import { resizeFn } from "../../../../src/components/shop/confirm/confirm-resize.js";
import * as backgroundsModule from "../../../../src/components/shop/backgrounds.js";
import * as itemViewModule from "../../../../src/components/shop/confirm/item-view.js";
import * as text from "../../../../src/core/layout/text.js";

describe("Confirm Resize Function", () => {
    let mockSafeArea;
    let mockScene;
    let mockElements;
    let mockBuyElements;
    let mockText;
    let mockButton;

    beforeEach(() => {
        mockButton = {
            setY: jest.fn(),
            setX: jest.fn(),
            setScale: jest.fn(),
            width: 10,
        };

        backgroundsModule.resizeBackground = jest.fn(() => jest.fn());
        itemViewModule.scaleItemView = jest.fn();

        mockSafeArea = { width: 100, height: 200, x: 0, y: 0 };
        mockScene = {
            layout: { getSafeArea: jest.fn(() => mockSafeArea) },
            config: {
                confirm: { buttons: { buttonsRight: true } },
            },
        };

        mockElements = {
            background: {
                constructor: () => {},
            },
            prompt: {
                setPosition: jest.fn(),
            },
        };

        mockBuyElements = {
            text: {
                setPosition: jest.fn(),
            },
            currency: {
                setPosition: jest.fn(),
            },
        };

        mockText = {
            setText: jest.fn(),
            style: { some: "style" },
            setPosition: jest.fn(),
            setStyle: jest.fn(),
        };

        text.addText = jest.fn(() => ({
            setOrigin: jest.fn(() => mockText),
        }));
    });

    afterEach(jest.clearAllMocks);

    test("resizes confirm buttons", () => {
        const mockButton = {
            setY: jest.fn(),
            setX: jest.fn(),
            setScale: jest.fn(),
            width: 10,
        };

        const mockButtons = [mockButton];

        resizeFn(mockScene, mockBuyElements, mockButtons, mockElements)();
        expect(mockButton.setY).toHaveBeenCalledWith(400);
        expect(mockButton.setX).toHaveBeenCalledWith(725);
        expect(mockButton.setScale).toHaveBeenCalledWith(3.25);
    });

    test("positions correctly when buttons are on the left", () => {
        mockScene.config.confirm.buttons.buttonsRight = false;
        const mockButtons = [mockButton];
        resizeFn(mockScene, mockBuyElements, mockButtons, mockElements)();

        expect(mockButton.setX).toHaveBeenCalledWith(675);
    });
});
