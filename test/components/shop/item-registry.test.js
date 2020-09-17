/**
 * @copyright BBC 2020
 * @author BBC Children's D+E
 * @license Apache-2.0
 */

import * as itemRegistry from "../../../src/components/shop/item-registry.js";

const registryData = [
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
];

describe("Item registry", () => {
    let registry;

    beforeEach(() => {
        registry = itemRegistry.initRegistry(registryData);
    });

    afterEach(() => jest.clearAllMocks());

    describe("initRegistry", () => {
        test("returns a registry object with getters and setters", () => {
            expect(registry.itemsArray).toBeInstanceOf(Array);
            expect(typeof registry.get).toBe("function");
            expect(typeof registry.getCategory).toBe("function");
            expect(typeof registry.set).toBe("function");
        });
    });

    describe("getters", () => {
        test("parameterless get returns all items in the registry", () => {
            const itemsFromGet = registry.get();
            expect(itemsFromGet.length).toEqual(3);
        });

        test("get with an id parameter returns a single item with that id", () => {
            const itemOne = registry.get("item-1");
            const expectedItem = registryData[0];
            expect(itemOne).toEqual(expectedItem);
        });

        test("get with an id parameter and a category array returns the item only if it has a category match", () => {
            const itemOne = registry.get("item-1", ["category-1"]);
            const expectedItem = registryData[0];
            expect(itemOne).toEqual(expectedItem);
        });

        test("getCategory returns all items in that category", () => {
            const categoryOneItems = registry.getCategory("category-1");
            expect(categoryOneItems.length).toEqual(2);
        });

        test("get returns undefined when no matching item exists", () => {
            expect(registry.get("fish")).toBe(undefined);
            expect(registry.get("item-1", ["category-3"])).toBe(undefined);
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
