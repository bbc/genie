/**
 * @copyright BBC 2020
 * @author BBC Children's D+E
 * @license Apache-2.0
 */

import { loadCatalogue, getCatalogueKeys, loadToCache } from "../../../src/core/loader/get-catalogue.js";
import * as catalogue from "../../../src/components/shop/item-catalogue.js";

const mockConfig = {
    foo: {
        catalogueKey: "bar",
    },
    baz: {
        catalogueKey: "qux",
    },
};

const mockScreen = {
    load: {
        json5: jest.fn(),
        start: jest.fn(),
        on: jest.fn(),
    },
    cache: {
        json: {
            get: jest.fn(),
        },
    },
};

catalogue.initCatalogue = jest.fn();

describe("get-catalogue", () => {
    afterEach(() => jest.clearAllMocks());

    describe("loadCatalogue", () => {
        test("registers a callback that calls initCatalogue once per catalogue key on load complete, and starts the loader", () => {
            loadCatalogue(mockScreen, mockConfig);
            expect(mockScreen.load.on.mock.calls[0][0]).toEqual("complete");
            const callbackOnComplete = mockScreen.load.on.mock.calls[0][1];
            expect(mockScreen.load.start).toHaveBeenCalled();
            callbackOnComplete();
            expect(mockScreen.cache.json.get).toHaveBeenCalledWith("catalogue-bar");
            expect(mockScreen.cache.json.get).toHaveBeenCalledWith("catalogue-qux");
        });
    });

    describe("getCatalogueKeys", () => {
        test("returns an array of all catalogueKey strings in config", () => {
            const keys = getCatalogueKeys(mockConfig);
            expect(keys).toEqual(["bar", "qux"]);
        });
    });

    describe("loadToCache", () => {
        test("calls load.json5 with a key and url", () => {
            const key = "foo";
            loadToCache(mockScreen)(key);
            expect(mockScreen.load.json5).toHaveBeenCalledWith({
                key: "catalogue-foo",
                url: "items/foo.json5",
            });
        });
    });
});
