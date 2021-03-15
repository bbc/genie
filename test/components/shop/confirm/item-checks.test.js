/**
 * @copyright BBC 2021
 * @author BBC Children's D+E
 * @license Apache-2.0
 */
import {
    getShopConfig,
    itemIsInStock,
    isEquippable,
    canAffordItem,
} from "../../../../src/components/shop/confirm/item-checks.js";
import * as collectionsModule from "../../../../src/core/collections.js";
import * as transactModule from "../../../../src/components/shop/transact.js";

describe("Item Checks", () => {
    beforeEach(() => {});

    afterEach(jest.clearAllMocks);

    describe("getShopConfig", () => {
        test("gets scene.transientData.shop.config from scene", () => {
            const mockScene = { transientData: { shop: { config: "test-config" } } };

            expect(getShopConfig(mockScene)).toBe("test-config");
        });
    });

    describe("itemIsInStock", () => {
        test("Returns true if shop quantity > 0", () => {
            const mockCollection = { get: jest.fn(() => ({ qty: 10 })) };
            collectionsModule.collections.get = jest.fn(() => mockCollection);

            const mockScene = { transientData: { shop: { config: { shopCollections: { shop: "test-shop" } } } } };

            expect(itemIsInStock(mockScene, {})).toBe(true);
        });

        test("Returns false if shop quantity is 0", () => {
            const mockCollection = { get: jest.fn(() => ({ qty: 0 })) };
            collectionsModule.collections.get = jest.fn(() => mockCollection);

            const mockScene = { transientData: { shop: { config: { shopCollections: { shop: "test-shop" } } } } };

            expect(itemIsInStock(mockScene, {})).toBe(false);
        });
    });

    describe("isEquippable", () => {
        test("Returns true if item has a slot", () => {
            expect(isEquippable({ slot: "test" })).toBe(true);
        });

        test("Returns false if item has no slot", () => {
            expect(isEquippable({})).toBe(false);
        });
    });

    describe("canAffordItem", () => {
        test("Returns true if item price is less than the quantity of currency items held", () => {
            const mockScene = { transientData: { shop: { config: "test-config" } } };
            transactModule.getBalanceItem = jest.fn(() => ({ qty: 10 }));

            expect(canAffordItem(mockScene, { price: 9 })).toBe(true);
        });

        test("Returns false if item price is more than the quantity of currency items held", () => {
            const mockScene = { transientData: { shop: { config: "test-config" } } };
            transactModule.getBalanceItem = jest.fn(() => ({ qty: 10 }));

            expect(canAffordItem(mockScene, { price: 11 })).toBe(false);
        });
    });
});
