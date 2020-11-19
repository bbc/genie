/**
 * @module components/shop
 * @copyright BBC 2020
 * @author BBC Children's D+E
 * @license Apache-2.0 Apache-2.0
 */

import * as transact from "../../../src/components/shop/transact.js";

describe("doTransaction", () => {
    let mockTx;

    afterEach(() => jest.clearAllMocks());

    describe("from shop", () => {
        beforeEach(() => {
            mockTx = { title: "shop" };
            transact.doTransaction(mockTx);
        });
        test("calls buy", () => {
            expect(false).toBe(true);
        });
    });

    describe("from manage", () => {
        beforeEach(() => {
            mockTx = { title: "manage" };
            transact.doTransaction(mockTx);
        });
        test("calls equip", () => {
            expect(false).toBe(true);
        });
    });
});
