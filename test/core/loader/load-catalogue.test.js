/**
 * @copyright BBC 2020
 * @author BBC Children's D+E
 * @license Apache-2.0
 */

import { loadCatalogue } from "../../../src/core/loader/load-catalogue.js";
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
        once: jest.fn(),
    },
    cache: {
        json: {
            get: jest.fn(),
        },
    },
};

const initCatalogueSpy = jest.fn()

catalogue.initCatalogue = () => initCatalogueSpy;

describe("get-catalogue", () => {
    afterEach(() => jest.clearAllMocks());

    describe("loadCatalogue", () => {
        test("registers a callback that calls initCatalogue once per catalogue key on load complete, and starts the loader", () => {
            loadCatalogue(mockScreen, mockConfig);
            expect(mockScreen.load.once.mock.calls[0][0]).toEqual("complete");
            const loadComplete = mockScreen.load.once.mock.calls[0][1];
            expect(mockScreen.load.start).toHaveBeenCalled();
            loadComplete();
            expect(initCatalogueSpy).toHaveBeenCalledTimes(2);
        });
    });
});
