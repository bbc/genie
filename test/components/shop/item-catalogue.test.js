/**
 * @copyright BBC 2020
 * @author BBC Children's D+E
 * @license Apache-2.0
 */

import { catalogue, initCatalogue } from "../../../src/components/shop/item-catalogue.js";

const catalogueData = {
    catalogueSectionKey: "test-data",
    catalogueItems: [
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
    let catalogue;

    function init() {
        const { catalogueSectionKey, catalogueItems } = catalogueData;
        initCatalogue(catalogueSectionKey, catalogueItems);
        catalogue = catalogue.get(catalogueSectionKey);
    }

    beforeEach(() => {
        init();
    });

    describe("initRegistry", () => {
        test("returns a registry object with getters and setters", () => {
            expect(catalogue.items).toBeInstanceOf(Array);
            expect(typeof catalogue.get).toBe("function");
            expect(typeof catalogue.getCategory).toBe("function");
            expect(typeof catalogue.set).toBe("function");
        });

        test("exposes itemsRegistry to window.__debug when it exists", () => {
            window.__debug = {};
            init();
            expect(typeof window.__debug.items).toBe("object");
        });
    });

    describe("getters", () => {
        test("get with returns a single item with a matching id", () => {
            const itemOne = catalogue.get("item-1");
            const expectedItem = catalogueData.catalogueItems[0];
            expect(itemOne).toEqual(expectedItem);
        });

        test("getCategory returns all items in that category", () => {
            const categoryOneItems = catalogue.getCategory("category-1");
            expect(categoryOneItems.length).toEqual(2);
        });

        test("get returns undefined when no matching item exists", () => {
            expect(catalogue.get("fish")).toBe(undefined);
        });
    });

    describe("setter", () => {
        test("merges the provided object into the matching item", () => {
            catalogue.set("item-1", { someKey: "someValue" });
            expect(catalogue.get("item-1").someKey).toEqual("someValue");
        });

        test("returns true if set was successful", () => {
            expect(catalogue.set("item-1", { someKey: "someValue" })).toBe(true);
        });

        test("returns false if it could not replace the item", () => {
            const itemToSet = { id: "foo" };
            expect(catalogue.set(itemToSet)).toBe(false);
        });
    });
});
