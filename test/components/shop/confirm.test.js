/**
 * @module components/shop
 * @copyright BBC 2020
 * @author BBC Children's D+E
 * @license Apache-2.0
 */

import { createConfirm } from "../../../src/components/shop/confirm.js";
import * as layout from "../../../src/components/shop/shop-layout.js";
import * as buttons from "../../../src/components/shop/menu-buttons.js";

describe("createConfirm()", () => {
    let confirmPane;
    const mockContainer = { add: jest.fn(), setY: jest.fn() };
    const mockText = { setOrigin: jest.fn() };
    const mockImage = { setOrigin: jest.fn(), setScale: jest.fn() };
    const mockScene = {
        add: {
            container: jest.fn().mockReturnValue(mockContainer),
            image: jest.fn().mockReturnValue(mockImage),
            text: jest.fn().mockReturnValue(mockText),
            rectangle: jest.fn(),
        },
    };
    const mockConfig = {
        menu: { buttonsRight: true },
        confirm: { 
            prompts: {
                buy: "buyPrompt",
            }
        }, 
    };
    const mockBounds = {};
    buttons.createConfirmButtons = jest.fn();


    beforeEach(() => confirmPane = createConfirm(mockScene, mockConfig, mockBounds));

    afterEach(() => jest.clearAllMocks());

    test("creates a container", () => {
        expect(confirmPane).not.toBeUndefined();
    });
});