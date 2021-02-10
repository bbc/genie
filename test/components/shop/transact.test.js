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
    beforeEach(() => {
        // TODO rewrite all these tests
    });
    afterEach(() => jest.clearAllMocks());

    test("test", () => {
        expect(1).toBe(1);
    });
});
