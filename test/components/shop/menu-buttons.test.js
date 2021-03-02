/**
 * @module components/shop
 * @copyright BBC 2020
 * @author BBC Children's D+E
 * @license Apache-2.0 Apache-2.0
 */

import {
    createMenuButtons,
    createConfirmButtons,
    resizeGelButtons,
} from "../../../src/components/shop/menu-buttons.js";

describe("resizeGelButtons()", () => {
    const mockButton = {
        setY: jest.fn(),
        setX: jest.fn(),
        setScale: jest.fn(),
        width: 200,
    };
    let pane;
    let mockScene;
    let mockOuterBounds;

    beforeEach(() => {
        mockOuterBounds = { x: 0, y: 0, height: 300, width: 800 };
        mockScene = {
            config: {
                menu: {
                    buttonsRight: true,
                },
            },
        };
        pane = {
            buttons: [mockButton],
            config: {
                menu: {
                    buttonsRight: true,
                },
            },
            container: {
                scene: mockScene,
                list: [{ getBounds: () => mockOuterBounds }],
            },
        };
        jest.clearAllMocks();
        resizeGelButtons(pane);
    });

    test("sets the position of each button", () => {
        expect(mockButton.setX.mock.calls[0][0]).toBe(1100);
        expect(mockButton.setY.mock.calls[0][0]).toBe(375);
    });
    test("sets the scale of each button", () => {
        expect(mockButton.setScale).toHaveBeenCalledTimes(1);
        expect(mockButton.setScale).toHaveBeenCalledWith(4);
    });
    describe("when buttonsRight is false", () => {
        test("the x position is mirrored", () => {
            jest.clearAllMocks();
            mockScene.config.menu.buttonsRight = false;
            resizeGelButtons(pane);
            expect(mockButton.setX.mock.calls[0][0]).toBe(300);
        });
    });
});
