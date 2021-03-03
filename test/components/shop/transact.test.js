/**
 * @module components/shop
 * @copyright BBC 2020
 * @author BBC Children's D+E
 * @license Apache-2.0 Apache-2.0
 */

import * as transact from "../../../src/components/shop/transact.js";
import { collections } from "../../../src/core/collections.js";
import { gmi } from "../../../src/core/gmi/gmi.js";
import { eventBus } from "../../../src/core/event-bus.js";

jest.mock("../../../src/core/collections.js");
jest.mock("../../../src/core/gmi/gmi.js");

describe("Shop Transactions", () => {
    let mockScene;
    let mockCurrencyItem;
    let mockItem;
    let mockShopItem;
    let mockInventoryItem;
    let mockInventoryItemList;
    let mockShopCollection;
    let mockManageCollection;
    let unsubscribeSpy;

    beforeEach(() => {
        mockScene = {
            transientData: {
                shop: {
                    config: {
                        balance: {
                            value: {
                                key: "currency",
                            },
                        },
                        shopCollections: {
                            shop: "shop",
                            manage: "manage",
                        },
                        slots: {
                            helmet: { max: 1 },
                        },
                    },
                },
            },
        };
        mockCurrencyItem = {
            qty: 500,
        };
        mockItem = {
            id: "item",
            price: 50,
            slot: "helmet",
        };
        mockShopItem = {
            qty: 1,
        };
        mockInventoryItem = {
            id: "inventoryItem",
            qty: 5,
        };
        mockInventoryItemList = [];
        collections.get = jest.fn(collectionName =>
            collectionName === "shop" ? mockShopCollection : mockManageCollection,
        );
        mockShopCollection = {
            get: jest.fn(() => mockShopItem),
            set: jest.fn(),
        };
        mockManageCollection = {
            getAll: jest.fn(() => mockInventoryItemList),
            get: jest.fn(itemId => (itemId === "currency" ? mockCurrencyItem : mockInventoryItem)),
            set: jest.fn(),
        };
        gmi.sendStatsEvent = jest.fn();
    });
    unsubscribeSpy = jest.fn();
    jest.spyOn(eventBus, "publish").mockImplementation(() => {});
    jest.spyOn(eventBus, "subscribe").mockImplementation(() => ({ unsubscribe: unsubscribeSpy }));
    afterEach(() => jest.clearAllMocks());

    describe("Buying an item", () => {
        beforeEach(() => transact.buy(mockScene, mockItem));

        test("item quantity is reduced by 1 in the shop collection", () => {
            const expectedItem = { ...mockItem, qty: mockShopItem.qty - 1 };
            expect(mockShopCollection.set).toHaveBeenCalledWith(expectedItem);
        });

        test("item quantity is increased by 1 and given purchased state in the inventory collection", () => {
            const expectedItem = { ...mockItem, qty: mockInventoryItem.qty + 1, state: "purchased" };
            expect(mockManageCollection.set).toHaveBeenCalledWith(expectedItem);
        });

        test("balance item has its quantity reduced by the price of the item", () => {
            const expectedBalanceItem = { ...mockCurrencyItem, qty: mockCurrencyItem.qty - mockItem.price };
            expect(mockManageCollection.set).toHaveBeenCalledWith(expectedBalanceItem);
        });

        test("fires a stats event", () => {
            expect(gmi.sendStatsEvent).toHaveBeenCalledWith("buy", "click", { id: "item", qty: 0 });
        });

        test("item is added to the inventory collection with qty set to 1 when the item does not exist in the inventory yet", () => {
            jest.clearAllMocks();
            mockInventoryItem = undefined;
            const expectedItem = { ...mockItem, qty: 1, state: "purchased" };
            transact.buy(mockScene, mockItem);
            expect(mockManageCollection.set).toHaveBeenCalledWith(expectedItem);
        });
    });

    describe("Equipping an item", () => {
        beforeEach(() => transact.equip(mockScene, mockItem));

        test("items state is set to equipped in the inventory collection", () => {
            const expectedItem = { ...mockItem, state: "equipped" };
            expect(mockManageCollection.set).toHaveBeenCalledWith(expectedItem);
        });

        test("fires a stats event", () => {
            expect(gmi.sendStatsEvent).toHaveBeenCalledWith("equip", "click", { id: "item", qty: 1 });
        });

        test("currently equipped item is unequipped when destination slot is full", () => {
            jest.clearAllMocks();
            mockInventoryItemList = [
                { id: "alreadyEquippedItem", slot: "helmet", state: "equipped" },
                { id: "itemBeingEquipped", slot: "helmet", state: "purchased" },
            ];
            const expectedItem = { id: "alreadyEquippedItem", slot: "helmet", state: "purchased" };
            transact.equip(mockScene, mockItem);
            expect(mockManageCollection.set).toHaveBeenCalledWith(expectedItem);
        });
    });

    describe("Unequipping an item", () => {
        beforeEach(() => {
            mockItem.state = "equipped";
            transact.unequip(mockScene, mockItem);
        });

        test("items state is set to purchased in the inventory collection", () => {
            const expectedItem = { ...mockItem, state: "purchased" };
            expect(mockManageCollection.set).toHaveBeenCalledWith(expectedItem);
        });
        test("fires a stats event", () => {
            expect(gmi.sendStatsEvent).toHaveBeenCalledWith("unequip", "click", { id: "item", qty: 1 });
        });
    });

    describe("using an item", () => {
        beforeEach(() => transact.use(mockScene, mockInventoryItem));

        test("item's quantity is reduced by one in the inventory collection", () => {
            const expectedItem = { ...mockInventoryItem, qty: mockInventoryItem.qty - 1 };
            expect(mockManageCollection.set).toHaveBeenCalledWith(expectedItem);
        });

        test("publishes events for transaction", () => {
            const eventCalls = eventBus.publish.mock.calls[0][0];
            expect(eventCalls.channel).toBe("shop");
            expect(eventCalls.name).toBe("used");
            expect(eventCalls.data).toBe(mockInventoryItem);
        });

        test("fires a stats event", () => {
            expect(gmi.sendStatsEvent).toHaveBeenCalledWith("use", "click", { id: "inventoryItem", qty: 4 });
        });
    });

    describe("getBalanceItem", () => {
        test("returns the currency item", () => {
            expect(transact.getBalanceItem(mockScene.transientData.shop.config)).toBe(mockCurrencyItem);
        });
    });
});
