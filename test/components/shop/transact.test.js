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
            id: "id",
        };
        mockShopItem = {
            qty: 1,
        };
        mockInventoryItem = {
            qty: 0,
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

    describe("Buy", () => {
        test("item quantity is reduced by 1 in the shop collection when buying an item", () => {
            const expectedItem = { ...mockItem, qty: mockShopItem.qty - 1 };
            transact.buy(mockScene, mockItem);
            expect(mockShopCollection.set).toHaveBeenCalledWith(expectedItem);
        });
    });
});
