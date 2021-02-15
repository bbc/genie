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

jest.mock("../../../src/components/shop/transact.js");

describe("Confirm pane", () => {
    let confirmPane;

    let mockBalanceItem;
    let mockContainer;
    let mockImage;
    let mockRect;
    let mockButton;
    let mockText;
    let mockConfig;
    let mockBounds;
    let mockBalance;
    let mockScene;
    let mockCollection;

    beforeEach(() => {
        mockContainer = { add: jest.fn(), setY: jest.fn(), removeAll: jest.fn(), destroy: jest.fn() };
        mockImage = { setScale: jest.fn(), setVisible: jest.fn(), setTexture: jest.fn(), type: "Image" };
        mockRect = { foo: "bar" };
        mockButton = {
            baz: "qux",
            setLegal: jest.fn(),
            setY: jest.fn(),
            setX: jest.fn(),
            setScale: jest.fn(),
            input: { enabled: true },
            accessibleElement: { update: jest.fn() },
        };
        mockText = { setText: jest.fn(), type: "Text" };
        mockConfig = {
            menu: { buttonsRight: true },
            confirm: {
                prompt: {
                    buy: { legal: "legalBuyPrompt", illegal: "illegalBuyPrompt", unavailable: "unavailableBuyPrompt" },
                    equip: { legal: "equipPrompt", illegal: "illegalEquipPrompt" },
                    unequip: "unequipPrompt",
                    use: "usePrompt",
                },
                detailView: false,
            },
            assetKeys: { background: { confirm: "background" } },
            balance: { icon: { key: "balanceIcon" } },
            styleDefaults: {},
            paneCollections: { shop: "armoury", manage: "inventory" },
        };
        mockBounds = { height: 200, width: 200, x: 0, y: 5 };
        mockBalance = { setText: jest.fn(), getValue: jest.fn() };
        mockScene = {
            add: {
                container: jest.fn().mockReturnValue(mockContainer),
                image: jest.fn().mockReturnValue(mockImage),
                rectangle: jest.fn(() => ({ setScale: jest.fn() })),
            },
            stack: jest.fn(),
            back: jest.fn(),
            layout: {
                getSafeArea: jest.fn(() => mockBounds),
            },
            config: mockConfig,
            balance: mockBalance,
            panes: {
                manage: { setVisible: jest.fn() },
                shop: { setVisible: jest.fn() },
            },
            paneStack: [],
            title: { setTitleText: jest.fn() },
        };
        mockCollection = { get: jest.fn().mockReturnValue({ state: "equipped", qty: 1, price: 99 }) };

        const setVisibleFn = jest.fn();
        const resizeFn = jest.fn();

        layout.setVisible = jest.fn().mockReturnValue(setVisibleFn);
        layout.resize = jest.fn().mockReturnValue(resizeFn);
        layout.createRect = jest.fn().mockReturnValue(mockRect);
        layout.getInnerRectBounds = jest.fn().mockReturnValue({ x: 50, y: 0, width: 100, height: 100 });
        layout.textStyle = jest.fn().mockReturnValue({ some: "textStyle" });

        buttons.createConfirmButtons = jest.fn().mockReturnValue([mockButton, mockButton]);

        text.addText = jest.fn().mockReturnValue({ setOrigin: jest.fn().mockReturnValue(mockText) });

        collections.get = jest.fn(() => mockCollection);

        mockBalanceItem = { qty: 500 };
        transact.getBalanceItem = jest.fn(() => mockBalanceItem);
    });
    afterEach(() => jest.clearAllMocks());

    describe("createConfirm()", () => {
        beforeEach(() => {
            confirmPane = createConfirm(mockScene, "shop", { mock: "item", id: "foo" });
            confirmPane.scene = mockScene;
        });

        test("returns a container", () => {
            expect(confirmPane).toBe(mockContainer);
        });
        test("with gel buttons for confirm and cancel", () => {
            expect(buttons.createConfirmButtons).toHaveBeenCalled();
        });
        test("in a layout that can be flipped L-R in config", () => {
            expect(layout.getInnerRectBounds.mock.calls[0][0]).toBe(mockScene);
            jest.clearAllMocks();
            mockScene.config = { ...mockConfig, menu: { buttonsRight: false } };
            createConfirm(mockScene, "shop", { id: "foo" });
            expect(text.addText.mock.calls[0][1]).toBe(-50);
            expect(text.addText.mock.calls[0][2]).toBe(-75);
        });
        test("that is displayed with an appropriate Y offset", () => {
            expect(mockContainer.setY).toHaveBeenCalledWith(105);
        });
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
            confirmPane = createConfirm(mockScene, "shop", {
                id: "someItem",
                qty: 1,
                price: 99,
                title: "itemTitle",
                description: "itemDescription",
                longDescription: "itemBlurb",
                icon: "itemIcon",
            });
        });
        test("adds text objects and an image for the item", () => {
            expect(text.addText.mock.calls[1][3]).toBe("itemTitle");
            expect(text.addText.mock.calls[2][3]).toBe("itemDescription");
            expect(text.addText.mock.calls[3][3]).toBe("itemBlurb");
            expect(mockScene.add.image).toHaveBeenCalledWith(50, -50, "itemIcon");
        });
        test("uses placeholders if item is undefined", () => {
            jest.clearAllMocks();
            confirmPane = createConfirm(mockScene, "shop", undefined);
            expect(text.addText.mock.calls[1][3]).toBe("PH");
            expect(text.addText.mock.calls[2][3]).toBe("PH");
            expect(text.addText.mock.calls[3][3]).toBe("PH");
            expect(mockScene.add.image).toHaveBeenCalledWith(50, -50, "shop.itemIcon");
        });
    });

    describe("prompt text", () => {
        beforeEach(
            () =>
                (mockScene.config = {
                    ...mockConfig,
                    confirm: {
                        ...mockConfig.confirm,
                        detailView: true,
                    },
                }),
        );

        describe("for the shop", () => {
            test("when item is out of stock, is the 'item unavailable' prompt", () => {
                mockCollection = { get: jest.fn().mockReturnValue({ qty: 0, price: 99 }) };
                confirmPane = createConfirm(mockScene, "shop", { mock: "item", qty: 0, price: 99 });
                expect(text.addText.mock.calls[0][3]).toBe("unavailableBuyPrompt");
            });

            test("when item is in stock and not affordable, is the 'can't afford' prompt", () => {
                confirmPane = createConfirm(mockScene, "shop", { mock: "item", qty: 1, price: 9999 });
                expect(text.addText.mock.calls[0][3]).toBe("illegalBuyPrompt");
            });

            test("when item is in stock and affordable, is the 'confirm transaction' prompt", () => {
                confirmPane = createConfirm(mockScene, "shop", { mock: "item", qty: 1, price: 99 });
                expect(text.addText.mock.calls[0][3]).toBe("legalBuyPrompt");
            });
        });

        describe("for the inventory", () => {
            test("when item is equipped, is the 'unequip' text", () => {
                mockCollection = { get: jest.fn().mockReturnValue({ state: "equipped", slot: "someSlot" }) };
                confirmPane = createConfirm(mockScene, "manage", { mock: "item", id: "foo" });
                expect(text.addText.mock.calls[0][3]).toBe("unequipPrompt");
            });

            test("when item is not equipped, is the 'equip' text", () => {
                mockCollection = { get: jest.fn().mockReturnValue({ state: "purchased", slot: "someSlot" }) };
                confirmPane = createConfirm(mockScene, "manage", { mock: "item", id: "foo", slot: "someSlot" });
                expect(text.addText.mock.calls[0][3]).toBe("equipPrompt");
            });
            test("when the item is consumable, is the 'use' text", () => {
                mockCollection = {
                    get: jest.fn().mockReturnValue({ foo: "bar", state: "purchased", qty: 1, price: 99 }),
                };
                confirmPane = createConfirm(mockScene, "manage", { mock: "item" });
                expect(text.addText.mock.calls[0][3]).toBe("usePrompt");
            });
        });
    });

    describe(".handleClick()", () => {
        beforeEach(() => {
            jest.clearAllMocks();
        });
        test("when action is 'buy', calls transact.buy correctly", () => {
            confirmPane = createConfirm(mockScene, "shop", { mock: "item" });
            const handleClick = buttons.createConfirmButtons.mock.calls[0][2];
            handleClick();
            expect(transact.buy).toHaveBeenCalledWith(mockScene, { mock: "item" });
        });

        test("when action is 'equip', calls transact.equip correctly", () => {
            mockCollection = { get: jest.fn().mockReturnValue({ state: "purchased", slot: "someSlot" }) };
            confirmPane = createConfirm(mockScene, "manage", { mock: "item" });
            const handleClick = buttons.createConfirmButtons.mock.calls[0][2];
            handleClick();
            expect(transact.equip).toHaveBeenCalledWith(mockScene, { mock: "item" });
        });

        test("when action is 'unequip', calls transact.unequip correctly", () => {
            mockCollection = { get: jest.fn().mockReturnValue({ state: "equipped", slot: "someSlot" }) };
            confirmPane = createConfirm(mockScene, "manage", { mock: "item" });
            const handleClick = buttons.createConfirmButtons.mock.calls[0][2];
            handleClick();
            expect(transact.unequip).toHaveBeenCalledWith(mockScene, { mock: "item" });
        });
        test("when action is 'use', calls transact.use correctly", () => {
            mockCollection = { get: jest.fn().mockReturnValue({ state: "purchased", qty: 1 }) };
            confirmPane = createConfirm(mockScene, "manage", { mock: "item" });
            const handleClick = buttons.createConfirmButtons.mock.calls[0][2];
            handleClick();
            expect(transact.use).toHaveBeenCalledWith(mockScene, { mock: "item" });
        });
    });
    describe("cancel button", () => {
        let cancelCallback;

        beforeEach(() => {
            confirmPane = createConfirm(mockScene, "shop", { mock: "item" });
            cancelCallback = buttons.createConfirmButtons.mock.calls[0][3];
        });
        test("closes the container", () => {
            cancelCallback();
            expect(mockContainer.removeAll).toHaveBeenCalled();
            expect(mockContainer.destroy).toHaveBeenCalled();
        });
        test("sets the previous pane visible", () => {
            confirmPane = createConfirm(mockScene, "shop", { mock: "item" });
            mockScene.paneStack = ["prevPane", "confirm"];
            cancelCallback();
            expect(mockScene.panes.shop.setVisible).toHaveBeenCalledWith(true);
            expect(mockScene.title.setTitleText).toHaveBeenCalledWith("prevPane");
        });
    });
});
