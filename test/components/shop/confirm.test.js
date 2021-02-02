/**
 * @module components/shop
 * @copyright BBC 2020
 * @author BBC Children's D+E
 * @license Apache-2.0
 */

import { createConfirm } from "../../../src/components/shop/confirm.js";
import * as layout from "../../../src/components/shop/shop-layout.js";
import * as text from "../../../src/core/layout/text-elem.js";
import * as buttons from "../../../src/components/shop/menu-buttons.js";
import * as transact from "../../../src/components/shop/transact.js";
import { collections } from "../../../src/core/collections.js";

describe("createConfirm()", () => {
    let confirmPane;
    const mockContainer = { add: jest.fn(), setY: jest.fn(), removeAll: jest.fn() };
    const mockImage = { setScale: jest.fn(), setVisible: jest.fn(), setTexture: jest.fn(), type: "Image" };
    const mockRect = { foo: "bar" };
    const mockButton = { baz: "qux", setLegal: jest.fn() };
    const mockText = { setText: jest.fn(), type: "Text" };
    let mockConfig = {
        menu: { buttonsRight: true },
        confirm: {
            prompt: {
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
    layout.textStyle = jest.fn().mockReturnValue({ some: "textStyle" });

    text.addText = jest.fn().mockReturnValue({ setOrigin: jest.fn().mockReturnValue(mockText) });

    let mockDoTransactionFn = jest.fn().mockReturnValueOnce(37).mockReturnValue(undefined);
    transact.doTransaction = jest.fn().mockReturnValue(mockDoTransactionFn);
    const mockCollection = { get: jest.fn().mockReturnValue({ state: "foo" }) };
    collections.get = jest.fn().mockReturnValue(mockCollection);

    beforeEach(() => {
        confirmPane = createConfirm(mockScene);
        confirmPane.scene = mockScene;
    });

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
    test("with a getter for its image and text elements", () => {
        const elems = confirmPane.getElems();
        expect(elems).toStrictEqual([mockText, mockText, mockImage, mockImage]);
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
        expect(text.addText.mock.calls[1][1]).toBe(-28);
        expect(text.addText.mock.calls[1][2]).toBe(-22.5);
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
            expect(text.addText).toHaveBeenCalledTimes(5);
            const containerContents = mockContainer.add.mock.calls[0][0];
            expect(containerContents.slice(-4)).toStrictEqual([mockImage, mockText, mockText, mockText]);
        });
    });

    describe("prepTransaction() for buying", () => {
        const mockItem = {
            price: 37,
            icon: "some.icon",
            title: "someTitle",
            description: "someDetail",
            longDescription: "someBlurb",
        };
        const mockTitle = "shop";
        beforeEach(() => confirmPane.prepTransaction(mockItem, mockTitle));

        describe("updates the container", () => {
            test("sets the prompt", () => {
                expect(mockText.setText.mock.calls[4][0]).toBe("illegalBuyPrompt");
            });
            test("sets the currency icon visible and sets price text to the item price", () => {
                expect(mockImage.setVisible).toHaveBeenCalledWith(true);
                expect(mockText.setText.mock.calls[0][0]).toBe(37);
            });
            test("sets transaction", () => {
                const expected = { item: mockItem, title: mockTitle, isLegal: false };
                expect(mockContainer.transaction).toStrictEqual(expected);
            });
            test("sets texts and textures from the item", () => {
                expect(mockImage.setTexture).toHaveBeenCalledWith("some.icon");
                expect(mockText.setText).toHaveBeenCalledWith("someTitle");
                expect(mockText.setText).toHaveBeenCalledWith("someDetail");
                expect(mockText.setText).toHaveBeenCalledWith("someBlurb");
            });
            test("when not using detail view, just updates the image", () => {
                jest.clearAllMocks();
                confirmPane.config.confirm.detailView = false;
                confirmPane.prepTransaction(mockItem, mockTitle);
                expect(mockImage.setTexture).toHaveBeenCalledWith("some.icon");
                expect(mockText.setText).not.toHaveBeenCalledWith("someTitle");
                expect(mockText.setText).not.toHaveBeenCalledWith("someDetail");
                expect(mockText.setText).not.toHaveBeenCalledWith("someBlurb");
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
