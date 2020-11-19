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
    const mockImage = { setScale: jest.fn() };
    const mockRect = { foo: "bar" };
    const mockButton = { baz: "qux" };
    const mockText = { qin: "qaz" };
    const mockScene = {
        add: {
            container: jest.fn().mockReturnValue(mockContainer),
            image: jest.fn().mockReturnValue(mockImage),
            text: jest.fn().mockReturnValue({ setOrigin: jest.fn().mockReturnValue(mockText) }),
        },
    };
    let mockConfig = {
        menu: { buttonsRight: true },
        confirm: {
            prompts: {
                buy: "buyPrompt",
            },
            detailView: false,
        },
        balance: { icon: { key: "balanceIcon" } },
    };
    const mockBounds = { height: 100, y: 5 };
    buttons.createConfirmButtons = jest.fn().mockReturnValue([mockButton, mockButton]);
    const setVisibleFn = jest.fn();
    const resizeFn = jest.fn();
    layout.setVisible = jest.fn().mockReturnValue(setVisibleFn);
    layout.resize = jest.fn().mockReturnValue(resizeFn);
    layout.createRect = jest.fn().mockReturnValue(mockRect);
    layout.getInnerRectBounds = jest.fn().mockReturnValue({ x: 0, y: 0, width: 100, height: 100 });

    beforeEach(() => (confirmPane = createConfirm(mockScene, mockConfig, mockBounds)));

    afterEach(() => jest.clearAllMocks());

    test("returns a container", () => {
        expect(confirmPane).toBe(mockContainer);
    });
    test("with setVisible and resize functions", () => {
        confirmPane.setVisible();
        expect(setVisibleFn).toHaveBeenCalled();
        confirmPane.resize();
        expect(resizeFn).toHaveBeenCalled();
    });
    test("with background rects derived from layout functions", () => {
        expect(layout.createRect).toHaveBeenCalledTimes(3);
        const containerContents = mockContainer.add.mock.calls[0][0];
        expect(containerContents.slice(0, 3)).toStrictEqual([mockRect, mockRect, mockRect]);
    });
    test("with gel buttons for confirm and cancel", () => {
        expect(buttons.createConfirmButtons).toHaveBeenCalled();
        expect(confirmPane.buttons).toStrictEqual([mockButton, mockButton]);
    });
    test("with a placeholder for the item view", () => {
        expect(mockScene.add.image.mock.calls[1][2]).toBe("shop.itemIcon");
        const containerContents = mockContainer.add.mock.calls[0][0];
        expect(containerContents.slice(-1)).toStrictEqual([mockImage]);
    });
    test("in a layout that can be flipped L-R in config", () => {
        expect(layout.getInnerRectBounds.mock.calls[0][0]).toBe(mockBounds);
        expect(layout.getInnerRectBounds.mock.calls[0][1]).toBe(true);
        jest.clearAllMocks();
        const flippedConfig = { ...mockConfig, menu: { buttonsRight: false } };
        createConfirm(mockScene, flippedConfig, mockBounds);
        expect(layout.getInnerRectBounds.mock.calls[0][1]).toBe(false);
    });
    test("that is displayed with an appropriate Y offset", () => {
        expect(mockContainer.setY).toHaveBeenCalledWith(55);
    });
    describe("Item detail view", () => {
        beforeEach(() => {
            mockConfig = {
                ...mockConfig,
                confirm: {
                    ...mockConfig.confirm,
                    detailView: true,
                },
            };
            jest.clearAllMocks();
            confirmPane = createConfirm(mockScene, mockConfig, mockBounds);
        });
        test("adds extra placeholder text objects", () => {
            expect(mockScene.add.text).toHaveBeenCalledTimes(4);
            const containerContents = mockContainer.add.mock.calls[0][0];
            expect(containerContents.slice(-3)).toStrictEqual([mockImage, mockText, mockText]);
        });
    });
});
