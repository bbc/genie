/**
 * @module components/shop
 * @copyright BBC 2020
 * @author BBC Children's D+E
 * @license Apache-2.0 Apache-2.0
 */

import * as transact from "../../../src/components/shop/transact.js";
import { collections } from "../../../src/core/collections.js";

describe("doTransaction", () => {
    let mockTx;
    let result;
    let doTransaction;

    const mockScene = {
        config: { paneCollections: { shop: "foo", manage: "bar" } },
    };
    const mockShopCol = { set: jest.fn(), get: jest.fn().mockReturnValue("baz") };
    const mockInvCol = { set: jest.fn() };
    const mockItem = { id: "someItem", price: 50 };

    beforeEach(() => {
        doTransaction = transact.doTransaction(mockScene);
        collections.get = jest.fn().mockReturnValueOnce(mockShopCol).mockReturnValue(mockInvCol);
    });
    afterEach(() => jest.clearAllMocks());

    describe("when called from shop", () => {
        beforeEach(() => {
            mockTx = { title: "shop", item: mockItem };
            result = doTransaction(mockTx);
        });
        test("gets both collections", () => {
            expect(collections.get).toHaveBeenCalledWith("foo");
            expect(collections.get).toHaveBeenCalledWith("bar");
        });
        test("processes a buy transaction", () => {
            const expectedShopSet = { ...mockItem, state: "owned", qty: -1 };
            expect(mockShopCol.set.mock.calls[0][0]).toStrictEqual(expectedShopSet);
            const expectedInvSet = { ...mockItem, qty: +1 };
            expect(mockInvCol.set.mock.calls[0][0]).toStrictEqual(expectedInvSet);
        });
        test("returns the price that was charged", () => {
            expect(result).toBe(50);
        });
    });
});
