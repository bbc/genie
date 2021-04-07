/**
 * @module components/shop
 * @copyright BBC 2021
 * @author BBC Children's D+E
 * @license Apache-2.0
 */

import { actions } from "../../../../src/components/shop/confirm/actions.js";
import { collections } from "../../../../src/core/collections.js";

jest.mock("../../../../src/core/collections.js");

describe("Confirm actions", () => {
    let mockScene;
    let mockItem;
    let mockManageCollection;
    let mockInventoryItem;

    beforeEach(() => {
        mockInventoryItem = {};
        mockManageCollection = { get: jest.fn(() => mockInventoryItem) };
        mockScene = {
            transientData: {
                shop: {
                    config: {
                        shopCollections: {
                            manage: "manageCollection",
                        },
                    },
                },
            },
        };
        mockItem = {};
        collections.get = jest.fn(collectionName => collectionName === "manageCollection" && mockManageCollection);
    });

    afterEach(() => jest.clearAllMocks());

    test("action is 'buy' when in the shop", () => {
        expect(actions["shop"]()).toBe("buy");
    });

    test("action is 'equip' when in manage and item is in inventory and has purchased state and slot", () => {
        mockInventoryItem.state = "purchased";
        mockInventoryItem.slot = "legs";
        expect(actions["manage"](mockScene, mockItem)).toBe("equip");
    });

    test("action is 'unequip' when in manage and item is in inventory and has equipped state and slot", () => {
        mockInventoryItem.state = "equipped";
        mockInventoryItem.slot = "legs";
        expect(actions["manage"](mockScene, mockItem)).toBe("unequip");
    });

    test("action is 'use' when in manage and item is in inventory and has no slot", () => {
        expect(actions["manage"](mockScene, mockItem)).toBe("use");
    });
});
