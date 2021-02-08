/**
 * @module components/shop
 * @copyright BBC 2020
 * @author BBC Children's D+E
 * @license Apache-2.0 Apache-2.0
 */

import * as transact from "../../../src/components/shop/transact.js";
import { collections } from "../../../src/core/collections.js";
import { catchClause } from "@babel/types";

describe("doTransaction", () => {
    let mockTx;
    let result;
    let doTransaction;

    const mockCurrencyItem = { id: "someId", qty: 100 };
    const mockScene = {
        config: { paneCollections: { shop: "shop", manage: "manage" }, balance: { value: { key: "currencyKey" } } },
    };
    const mockShopCol = { set: jest.fn(), get: jest.fn().mockReturnValue("baz") };
    const mockInvCol = { set: jest.fn(), get: jest.fn().mockReturnValue(mockCurrencyItem) };
    const mockItem = { id: "someItem", price: 50 };

    beforeEach(() => {
        doTransaction = transact.doTransaction(mockScene);
        collections.get = jest.fn().mockImplementation(type => (type === "shop" && mockShopCol) || mockInvCol);
    });
    afterEach(() => jest.clearAllMocks());

    describe("when called from shop", () => {
        beforeEach(() => {
            mockTx = { title: "shop", item: mockItem };
            result = doTransaction(mockTx);
        });
        test("gets both collections", () => {
            expect(collections.get).toHaveBeenCalledWith("shop");
            expect(collections.get).toHaveBeenCalledWith("manage");
        });
        test("processes a buy transaction", () => {
            const expectedShopSet = { ...mockItem, state: "owned", qty: 0 };
            expect(mockShopCol.set.mock.calls[0][0]).toEqual(expectedShopSet);
            const expectedBoughtItemSet = { ...mockItem, qty: 101 };
            expect(mockInvCol.set.mock.calls[0][0]).toEqual(expectedBoughtItemSet);
            const expectedCurrencySet = { ...mockCurrencyItem, qty: 50 };
            expect(mockInvCol.set.mock.calls[1][0]).toEqual(expectedCurrencySet);
        });
        test("returns the price that was charged", () => {
            expect(result).toBe(50);
        });
    });
    describe("when called from manage", () => {
        beforeEach(() => {
            mockTx = { title: "manage", item: mockItem };
            result = doTransaction(mockTx);
        });
        test("only gets the inv collection", () => {
            expect(collections.get).toHaveBeenCalledWith("manage");
            expect(collections.get).not.toHaveBeenCalledWith("shop");
        });
        test("sets an 'equipped' state on the item", () => {
            const expectedInvSet = { ...mockItem, state: "equipped" };
            expect(mockInvCol.set.mock.calls[0][0]).toStrictEqual(expectedInvSet);
        });
    });
});
