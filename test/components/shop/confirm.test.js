/**
 * @module components/shop
 * @copyright BBC 2020
 * @author BBC Children's D+E
 * @license Apache-2.0
 */

import { createConfirm } from "../../../src/components/shop/confirm.js";
import * as layout from "../../../src/components/shop/shop-layout.js";
import * as buttons from "../../../src/components/shop/menu-buttons.js";
import * as transact from "../../../src/components/shop/transact.js";

describe("createConfirm()", () => {
    let confirmPane;
    const mockContainer = { add: jest.fn(), setY: jest.fn(), removeAll: jest.fn() };
    const mockImage = { setScale: jest.fn(), setVisible: jest.fn() };
    const mockRect = { foo: "bar" };
    const mockButton = { baz: "qux" };
    const mockText = { setText: jest.fn() };
    const mockScene = {
        add: {
            container: jest.fn().mockReturnValue(mockContainer),
            image: jest.fn().mockReturnValue(mockImage),
            text: jest.fn().mockReturnValue({ setOrigin: jest.fn().mockReturnValue(mockText) }),
        },
        stack: jest.fn(),
        back: jest.fn(),
    };
    let mockConfig = {
        menu: { buttonsRight: true },
        confirm: {
            prompts: {
                shop: "buyPrompt",
                manage: "equipPrompt",
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
    transact.doTransaction = jest.fn();

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

    describe("prepTransaction() for buying", () => {
        const mockItem = { price: 37 };
        const mockTitle = "shop";
        beforeEach(() => confirmPane.prepTransaction(mockItem, mockTitle));

        describe("updates the container", () => {
            test("calls removeAll() on the container", () => {
                expect(mockContainer.removeAll).toHaveBeenCalled();
            });
            test("sets the prompt", () => {
                expect(mockText.setText.mock.calls[0][0]).toBe("buyPrompt");
            });
            test("sets the currency icon visible and sets price text to the item price", () => {
                expect(mockImage.setVisible).toHaveBeenCalledWith(true);
                expect(mockText.setText.mock.calls[1][0]).toBe(37);
            });
            test("sets transaction", () => {
                const expected = { item: mockItem, title: mockTitle };
                expect(mockContainer.transaction).toStrictEqual(expected);
            });
        });
        test("stacks the confirm pane", () => {
            expect(mockScene.stack).toHaveBeenCalledWith("confirm");
        });
    });

    describe("prepTransaction() for equipping", () => {
        const mockItem = { foo: "bar" };
        const mockTitle = "manage";
        beforeEach(() => confirmPane.prepTransaction(mockItem, mockTitle));
        test("sets the price to an empty string", () => {
            expect(mockText.setText.mock.calls[1][0]).toBe("");
        });
    });

    describe(".handleClick()", () => {
        beforeEach(() => (confirmPane.transaction = { foo: "bar" }));
        test("when called with 'Confirm', performs the transaction and calls back()", () => {
            confirmPane.handleClick("Confirm");
            expect(transact.doTransaction).toHaveBeenCalledWith(confirmPane.transaction);
            expect(mockScene.back).toHaveBeenCalled();
        });
        test("otherwise, just calls back()", () => {
            confirmPane.handleClick("whatevs");
            expect(mockScene.back).toHaveBeenCalled();
        });
    });
});
