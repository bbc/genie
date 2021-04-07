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
import { playShopSound } from "../../../src/components/shop/shop-sound.js";

jest.mock("../../../src/core/collections.js");
jest.mock("../../../src/core/gmi/gmi.js");
jest.mock("../../../src/core/event-bus.js");
jest.mock("../../../src/components/shop/shop-sound.js");

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
            config: {},
            transientData: {
                shop: {
                    config: {
                        balance: "currency",
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
            title: "amazing helmet",
            qty: 1,
        };
        mockShopItem = {
            qty: 1,
        };
        mockInventoryItem = {
            id: "inventoryItem",
            qty: 5,
            title: "amazing helmet",
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
            const expectedItem = { id: mockItem.id, qty: mockShopItem.qty - 1 };
            expect(mockShopCollection.set).toHaveBeenCalledWith(expectedItem);
        });

        test("item quantity is increased by 1 and given purchased state in the inventory collection", () => {
            const expectedItem = { id: mockItem.id, qty: mockInventoryItem.qty + 1, state: "purchased" };
            expect(mockManageCollection.set).toHaveBeenCalledWith(expectedItem);
        });

        test("balance item has its quantity reduced by the price of the item", () => {
            const expectedBalanceItem = { ...mockCurrencyItem, qty: mockCurrencyItem.qty - mockItem.price };
            expect(mockManageCollection.set).toHaveBeenCalledWith(expectedBalanceItem);
        });

        test("fires a stats event", () => {
            expect(gmi.sendStatsEvent).toHaveBeenCalledWith("buy", "click", {
                metadata: "KEY=item~STATE=purchased~QTY=0",
                source: "amazing helmet",
            });
        });

        test("item is added to the inventory collection with qty set to 1 when the item does not exist in the inventory yet", () => {
            jest.clearAllMocks();
            mockInventoryItem = undefined;
            const expectedItem = { id: mockItem.id, qty: 1, state: "purchased" };
            transact.buy(mockScene, mockItem);
            expect(mockManageCollection.set).toHaveBeenCalledWith(expectedItem);
        });

        test("plays shop buy sound", () => {
            expect(playShopSound).toHaveBeenCalledWith(mockScene, mockItem, "buy");
        });
    });

    describe("Equipping an item", () => {
        beforeEach(() => transact.equip(mockScene, mockItem));

        test("items state is set to equipped in the inventory collection", () => {
            const expectedItem = { id: mockItem.id, state: "equipped" };
            expect(mockManageCollection.set).toHaveBeenCalledWith(expectedItem);
        });

        test("fires a stats event", () => {
            expect(gmi.sendStatsEvent).toHaveBeenCalledWith("equip", "click", {
                metadata: "KEY=item~STATE=equipped~QTY=1",
                source: "amazing helmet",
            });
        });

        test("currently equipped item is unequipped when destination slot is full", () => {
            jest.clearAllMocks();
            mockInventoryItemList = [
                { id: "alreadyEquippedItem", slot: "helmet", state: "equipped" },
                { id: "itemBeingEquipped", slot: "helmet", state: "purchased" },
            ];
            const expectedItem = { id: "alreadyEquippedItem", state: "purchased" };
            transact.equip(mockScene, mockItem);
            expect(mockManageCollection.set).toHaveBeenCalledWith(expectedItem);
        });

        test("plays shop equip sound", () => {
            expect(playShopSound).toHaveBeenCalledWith(mockScene, mockItem, "equip");
        });
    });

    describe("Unequipping an item", () => {
        beforeEach(() => {
            mockItem.state = "equipped";
            transact.unequip(mockScene, mockItem);
        });

        test("items state is set to purchased in the inventory collection", () => {
            const expectedItem = { id: mockItem.id, state: "purchased" };
            expect(mockManageCollection.set).toHaveBeenCalledWith(expectedItem);
        });
        test("fires a stats event", () => {
            expect(gmi.sendStatsEvent).toHaveBeenCalledWith("unequip", "click", {
                metadata: "KEY=item~STATE=unequipped~QTY=1",
                source: "amazing helmet",
            });
        });

        test("plays shop unequip sound", () => {
            expect(playShopSound).toHaveBeenCalledWith(mockScene, mockItem, "unequip");
        });
    });

    describe("using an item", () => {
        beforeEach(() => transact.use(mockScene, mockItem));

        test("item's quantity is reduced by one in the inventory collection", () => {
            const expectedItem = { id: "item", qty: mockInventoryItem.qty - 1 };
            expect(mockManageCollection.set).toHaveBeenCalledWith(expectedItem);
        });

        test("publishes events for transaction", () => {
            const eventCalls = eventBus.publish.mock.calls[0][0];
            expect(eventCalls.channel).toBe("shop");
            expect(eventCalls.name).toBe("used");
            expect(eventCalls.data).toBe(mockInventoryItem);
        });

        test("fires a stats event", () => {
            expect(gmi.sendStatsEvent).toHaveBeenCalledWith("use", "click", {
                metadata: "KEY=item~STATE=used~QTY=4",
                source: "amazing helmet",
            });
        });

        test("plays shop use sound", () => {
            expect(playShopSound).toHaveBeenCalledWith(mockScene, mockItem, "use");
        });
    });

    describe("getBalanceItem", () => {
        test("returns the currency item", () => {
            expect(transact.getBalanceItem(mockScene.transientData.shop.config)).toBe(mockCurrencyItem);
        });
    });
});
