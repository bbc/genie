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
import { collections } from "../../../src/core/collections.js";

describe("createConfirm()", () => {
    let confirmPane;
    const mockContainer = { add: jest.fn(), setY: jest.fn(), removeAll: jest.fn() };
    const mockImage = { setScale: jest.fn(), setVisible: jest.fn() };
    const mockRect = { foo: "bar" };
    const mockButton = { baz: "qux", setLegal: jest.fn() };
    const mockText = { setText: jest.fn() };
    let mockConfig = {
        menu: { buttonsRight: true },
        confirm: {
            prompts: {
                shop: { legal: "legalBuyPrompt", illegal: "illegalBuyPrompt" },
                manage: { legal: "legalEquipPrompt", illegal: "illegalEquipPrompt" },
            },
            detailView: false,
        },
        assetKeys: { background: { confirm: "background" } },
        balance: { icon: { key: "balanceIcon" } },
        styleDefaults: {},
        paneCollections: { shop: "armoury", manage: "inventory" },
    };

    const mockBounds = { height: 100, y: 5 };

    const mockBalance = { setText: jest.fn(), getValue: jest.fn() };

    const mockScene = {
        add: {
            container: jest.fn().mockReturnValue(mockContainer),
            image: jest.fn().mockReturnValue(mockImage),
            text: jest.fn().mockReturnValue({ setOrigin: jest.fn().mockReturnValue(mockText) }),
        },
        stack: jest.fn(),
        back: jest.fn(),
        layout: {
            getSafeArea: jest.fn(() => mockBounds),
        },
        config: mockConfig,
        balance: mockBalance,
    };

    buttons.createConfirmButtons = jest.fn().mockReturnValue([mockButton, mockButton]);
    const setVisibleFn = jest.fn();
    const resizeFn = jest.fn();
    layout.setVisible = jest.fn().mockReturnValue(setVisibleFn);
    layout.resize = jest.fn().mockReturnValue(resizeFn);
    layout.createRect = jest.fn().mockReturnValue(mockRect);
    layout.getInnerRectBounds = jest.fn().mockReturnValue({ x: 0, y: 0, width: 100, height: 100 });
    let mockDoTransactionFn = jest.fn().mockReturnValueOnce(37).mockReturnValue(undefined);
    transact.doTransaction = jest.fn().mockReturnValue(mockDoTransactionFn);
    const mockCollection = { get: jest.fn().mockReturnValue({ state: "foo" }) };
    collections.get = jest.fn().mockReturnValue(mockCollection);

    beforeEach(() => (confirmPane = createConfirm(mockScene)));

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
    test("with setBalance and getBalance functions", () => {
        confirmPane.getBalance();
        expect(mockBalance.getValue).toHaveBeenCalled();
        confirmPane.setBalance(37);
        expect(mockBalance.setText).toHaveBeenCalledWith(37);
    });
    test("with a rect derived from layout functions used to memoize button positions", () => {
        expect(layout.createRect).toHaveBeenCalledTimes(1);
        const containerContents = mockContainer.add.mock.calls[0][0];
        expect(containerContents.slice(0, 1)).toStrictEqual([mockRect]);
    });
    test("with gel buttons for confirm and cancel", () => {
        expect(buttons.createConfirmButtons).toHaveBeenCalled();
        expect(confirmPane.buttons).toStrictEqual([mockButton, mockButton]);
    });
    test("with a placeholder for the item view", () => {
        expect(mockScene.add.image.mock.calls[2][2]).toBe("shop.itemIcon");
        const containerContents = mockContainer.add.mock.calls[0][0];
        expect(containerContents.slice(-1)).toStrictEqual([mockImage]);
    });
    test("in a layout that can be flipped L-R in config", () => {
        expect(layout.getInnerRectBounds.mock.calls[0][0]).toBe(mockScene);
        jest.clearAllMocks();
        mockScene.config = { ...mockConfig, menu: { buttonsRight: false } };
        createConfirm(mockScene);
        expect(mockScene.add.text).toHaveBeenCalledWith(28, -25, "PH", {});
    });
    test("that is displayed with an appropriate Y offset", () => {
        expect(mockContainer.setY).toHaveBeenCalledWith(55);
    });
    describe("Item detail view", () => {
        beforeEach(() => {
            mockScene.config = {
                ...mockConfig,
                confirm: {
                    ...mockConfig.confirm,
                    detailView: true,
                },
            };
            jest.clearAllMocks();
            confirmPane = createConfirm(mockScene);
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
                expect(mockText.setText.mock.calls[1][0]).toBe("illegalBuyPrompt");
            });
            test("sets the currency icon visible and sets price text to the item price", () => {
                expect(mockImage.setVisible).toHaveBeenCalledWith(true);
                expect(mockText.setText.mock.calls[0][0]).toBe(37);
            });
            test("sets transaction", () => {
                const expected = { item: mockItem, title: mockTitle, isLegal: false };
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
            expect(mockText.setText.mock.calls[0][0]).toBe("");
        });
    });

    describe(".handleClick()", () => {
        beforeEach(() => (confirmPane.transaction = { isLegal: true }));
        test("when called with 'Confirm', performs the transaction, sets balance, and calls back()", () => {
            const handleClick = buttons.createConfirmButtons.mock.calls[0][1];
            handleClick("Confirm");
            expect(mockDoTransactionFn).toHaveBeenCalledWith(confirmPane.transaction);
            expect(mockBalance.setText).toHaveBeenCalled();
            expect(mockScene.back).toHaveBeenCalled();
        });
        test("does not set the balance if the tx fails", () => {
            const handleClick = buttons.createConfirmButtons.mock.calls[0][1];
            handleClick("Confirm");
            expect(mockDoTransactionFn).toHaveBeenCalledWith(confirmPane.transaction);
            expect(mockBalance.setText).not.toHaveBeenCalled();
            expect(mockScene.back).toHaveBeenCalled();
        });
        test("does nothing at all if the tx is not legal", () => {
            const handleClick = buttons.createConfirmButtons.mock.calls[0][1];
            confirmPane.transaction = { isLegal: false };
            handleClick("Confirm");
            expect(mockDoTransactionFn).not.toHaveBeenCalled();
            expect(mockBalance.setText).not.toHaveBeenCalled();
            expect(mockScene.back).not.toHaveBeenCalled();
        });
        test("just calls back() if not called with 'Confirm'", () => {
            const handleClick = buttons.createConfirmButtons.mock.calls[0][1];
            handleClick("whatevs");
            expect(mockDoTransactionFn).not.toHaveBeenCalled();
            expect(mockScene.back).toHaveBeenCalled();
        });
    });
});
