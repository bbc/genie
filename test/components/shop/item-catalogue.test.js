/**
 * @copyright BBC 2020
 * @author BBC Children's D+E
 * @license Apache-2.0
 */

import { catalogue, initCatalogue } from "../../../src/components/shop/item-catalogue.js";

const catalogueData = {
    key: "test-data",
    items: [
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

const mockScreen = {
    cache: {
        json: {
            get: () => catalogueData.items,
        },
    },
};

describe("Catalogue", () => {
    let testItemList;

    function init() {
        const { key, items } = catalogueData;
        initCatalogue(mockScreen)(key);
        testItemList = catalogue.get(key);
    }

    beforeEach(() => {
        init();
    });

    describe("initCatalogue", () => {
        test("returns a catalogue object with getters and setters", () => {
            expect(testItemList.items).toBeInstanceOf(Array);
            expect(typeof testItemList.get).toBe("function");
            expect(typeof testItemList.getCategory).toBe("function");
            expect(typeof testItemList.set).toBe("function");
        });

        test("exposes catalogue to window.__debug when it exists", () => {
            global.__debug = {};
            init();
            expect(typeof global.__debug.catalogue).toBe("object");
        });
    });

    describe("getters", () => {
        test("get with returns a single item with a matching id", () => {
            const itemOne = testItemList.get("item-1");
            const expectedItem = catalogueData.items[0];
            expect(itemOne).toEqual(expectedItem);
        });

        test("getCategory returns all items in that category", () => {
            const categoryOneItems = testItemList.getCategory("category-1");
            expect(categoryOneItems.length).toEqual(2);
        });

        test("get returns undefined when no matching item exists", () => {
            expect(testItemList.get("fish")).toBe(undefined);
        });
    });

    describe("setter", () => {
        test("merges the provided object into the matching item", () => {
            testItemList.set("item-1", { someKey: "someValue" });
            expect(testItemList.get("item-1").someKey).toEqual("someValue");
        });

        test("returns true if set was successful", () => {
            expect(testItemList.set("item-1", { someKey: "someValue" })).toBe(true);
        });

        test("returns false if it could not replace the item", () => {
            const itemToSet = { id: "foo" };
            expect(testItemList.set(itemToSet)).toBe(false);
        });
    });
});
