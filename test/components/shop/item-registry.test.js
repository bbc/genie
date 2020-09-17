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
    ],
};

describe("Item registry", () => {
    let registry;

    function init() {
        const { registryKey, registryItems } = registryData;
        initRegistry(registryKey, registryItems);
        registry = itemsRegistry.get(registryKey);
    }

    beforeEach(() => {
        init();
    });

    describe("initRegistry", () => {
        test("returns a registry object with getters and setters", () => {
            expect(registry.items).toBeInstanceOf(Array);
            expect(typeof registry.get).toBe("function");
            expect(typeof registry.getCategory).toBe("function");
            expect(typeof registry.set).toBe("function");
        });

        test("exposes itemsRegistry to window.__debug when it exists", () => {
            window.__debug = {};
            init();
            expect(typeof window.__debug.items).toBe("object");
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
        test("merges the provided object into the matching item", () => {
            registry.set("item-1", { someKey: "someValue" });
            expect(registry.get("item-1").someKey).toEqual("someValue");
        });

        test("returns true if set was successful", () => {
            expect(registry.set("item-1", { someKey: "someValue" })).toBe(true);
        });

        test("returns false if it could not replace the item", () => {
            const itemToSet = { id: "foo" };
            expect(registry.set(itemToSet)).toBe(false);
        });
    });
});
