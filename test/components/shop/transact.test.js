/**
 * @module components/shop
 * @copyright BBC 2020
 * @author BBC Children's D+E
 * @license Apache-2.0 Apache-2.0
 */

import * as transact from "../../../src/components/shop/transact.js";
import { collections } from "../../../src/core/collections.js";

jest.mock("../../../src/core/collections.js");

describe("Shop Transactions", () => {
    let mockScene;
    let mockCurrencyItem;
    let mockItem;
    let mockShopItem;
    let mockInventoryItem;
    let mockShopCollection;
    let mockManageCollection;

    beforeEach(() => {
        mockScene = {
            config: {
                balance: {
                    value: {
                        key: "currency",
                    },
                },
                paneCollections: {
                    shop: "shop",
                    manage: "manage",
                },
            },
            events: {
                emit: jest.fn(),
            },
        };
        mockCurrencyItem = {
            qty: 500,
        };
        mockItem = {
            id: "item",
            price: 50,
        };
        mockShopItem = {
            qty: 1,
        };
        mockInventoryItem = {
            qty: 5,
        };
        collections.get = jest.fn(collectionName =>
            collectionName === "shop" ? mockShopCollection : mockManageCollection,
        );
        mockShopCollection = {
            get: jest.fn(() => mockShopItem),
            set: jest.fn(),
        };
        mockManageCollection = {
            get: jest.fn(itemId => (itemId === "currency" ? mockCurrencyItem : mockInventoryItem)),
            set: jest.fn(),
        };
    });
    afterEach(() => jest.clearAllMocks());

    describe("Buying an item", () => {
        test("item quantity is reduced by 1 in the shop collection", () => {
            const expectedItem = { ...mockItem, qty: mockShopItem.qty - 1 };
            transact.buy(mockScene, mockItem);
            expect(mockShopCollection.set).toHaveBeenCalledWith(expectedItem);
        });

        test("item quantity is increased by 1 and given purchased state in the inventory collection", () => {
            const expectedItem = { ...mockItem, qty: mockInventoryItem.qty + 1, state: "purchased" };
            transact.buy(mockScene, mockItem);
            expect(mockManageCollection.set).toHaveBeenCalledWith(expectedItem);
        });

        test("item is added to the inventory collection with qty set to 1 when the item does not exist in the inventory yet", () => {
            mockInventoryItem = undefined;
            const expectedItem = { ...mockItem, qty: 1, state: "purchased" };
            transact.buy(mockScene, mockItem);
            expect(mockManageCollection.set).toHaveBeenCalledWith(expectedItem);
        });

        test("balance item has its quantity reduced by the price of the item", () => {
            const expectedBalanceItem = { ...mockCurrencyItem, qty: mockCurrencyItem.qty - mockItem.price };
            transact.buy(mockScene, mockItem);
            expect(mockManageCollection.set).toHaveBeenCalledWith(expectedBalanceItem);
        });

        test("emits an updatebalance event", () => {
            transact.buy(mockScene, mockItem);
            expect(mockScene.events.emit).toHaveBeenCalledWith("updatebalance");
        });
    });
});
