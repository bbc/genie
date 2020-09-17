/**
 * @copyright BBC 2020
 * @author BBC Children's D+E
 * @license Apache-2.0
 */

import { itemsRegistry, initRegistry } from "../../../src/components/shop/item-registry.js";

const registryData = {
    registryKey: "test-data",
    registryItems: [
        {
            id: "item-1",
            category: ["category-1"],
        },
        {
            id: "item-2",
            category: ["category-1", "category-2"],
        },
        {
            id: "item-3",
            category: ["category-2"],
        },
    ]
};

describe("Item registry", () => {
    let registry;

    beforeEach(() => {
        const { registryKey, registryItems } = registryData;
        initRegistry(registryKey, registryItems);
        registry = itemsRegistry.get(registryKey);
    });

    describe("initRegistry", () => {
        test("returns a registry object with getters and setters", () => {
            expect(registry.items).toBeInstanceOf(Array);
            expect(typeof registry.get).toBe("function");
            expect(typeof registry.getCategory).toBe("function");
            expect(typeof registry.set).toBe("function");
        });
    });

    describe("getters", () => {

        test("get with returns a single item with a matching id", () => {
            const itemOne = registry.get("item-1");
            const expectedItem = registryData.registryItems[0];
            expect(itemOne).toEqual(expectedItem);
        });

        test("getCategory returns all items in that category", () => {
            const categoryOneItems = registry.getCategory("category-1");
            expect(categoryOneItems.length).toEqual(2);
        });

        test("get returns undefined when no matching item exists", () => {
            expect(registry.get("fish")).toBe(undefined);
        });
    });

    describe("setter", () => {
        test("replaces the item with a matching id in the registry with the provided item", () => {
            const itemToSet = { id: "item-1", someKey: "someValue" };
            registry.set(itemToSet);
            expect(registry.get("item-1").someKey).toEqual("someValue");
        });

        test("returns true if set was successful", () => {
            const itemToSet = { id: "item-1" };
            expect(registry.set(itemToSet)).toBe(true);
        });

        test("returns false if it could not replace the item", () => {
            const itemToSet = { id: "foo" };
            expect(registry.set(itemToSet)).toBe(false);
        });
    });
});
