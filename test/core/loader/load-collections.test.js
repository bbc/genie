/**
 * @copyright BBC 2020
 * @author BBC Children's D+E
 * @license Apache-2.0
 */
import { loadCollections } from "../../../src/core/loader/load-collections.js";
import * as initCollectionModule from "../../../src/core/collections.js";

describe("loadCollections", () => {
    let mockConfig;
    let mockCache;
    let mockScreen;

    beforeEach(() => {
        mockConfig = {
            screen1: {
                collection: "collection1",
            },
            screen2: {
                collection: "collection2",
            },
        };

        mockCache = {
            "collections/collection1": { catalogue: "catalogue1" },
            "collections/collection2": { catalogue: "catalogue2" },
        };

        mockScreen = {
            load: {
                json5: jest.fn(),
                start: jest.fn(),
                once: jest.fn(),
            },
            cache: {
                json: {
                    get: jest.fn(key => mockCache[key]),
                },
            },
        };
    });

    afterEach(() => jest.clearAllMocks());

    describe("loadCollections", () => {
        test("Adds the correct collection file urls to the loader ", () => {
            loadCollections(mockScreen, mockConfig);
            expect(mockScreen.load.json5.mock.calls[0][0].key).toEqual("collections/collection1");
            expect(mockScreen.load.json5.mock.calls[1][0].key).toEqual("collections/collection2");

            expect(mockScreen.load.json5.mock.calls[0][0].url).toEqual("collections/collection1.json5");
            expect(mockScreen.load.json5.mock.calls[1][0].url).toEqual("collections/collection2.json5");
        });

        test("a screen can initialise an array of collections", () => {
            mockConfig.screen2.collection = ["collection2", "collection3"];
            loadCollections(mockScreen, mockConfig);
            expect(mockScreen.load.json5.mock.calls[0][0].key).toEqual("collections/collection1");
            expect(mockScreen.load.json5.mock.calls[1][0].key).toEqual("collections/collection2");
            expect(mockScreen.load.json5.mock.calls[2][0].key).toEqual("collections/collection3");

            expect(mockScreen.load.json5.mock.calls[0][0].url).toEqual("collections/collection1.json5");
            expect(mockScreen.load.json5.mock.calls[1][0].url).toEqual("collections/collection2.json5");
            expect(mockScreen.load.json5.mock.calls[2][0].url).toEqual("collections/collection3.json5");
        });

        test("Adds the correct catalogue file urls to the loader", () => {
            loadCollections(mockScreen, mockConfig);

            const collectionsLoaded = mockScreen.load.once.mock.calls[0][1];
            collectionsLoaded();

            expect(mockScreen.load.json5.mock.calls[0][0].key).toEqual("collections/collection1");
            expect(mockScreen.load.json5.mock.calls[1][0].key).toEqual("collections/collection2");

            expect(mockScreen.load.json5.mock.calls[2][0].url).toEqual("collections/catalogue1.json5");
            expect(mockScreen.load.json5.mock.calls[3][0].url).toEqual("collections/catalogue2.json5");
        });

        test("Does not add catalogue file urls if inline catalogue used", () => {
            mockCache["collections/collection1"].catalogue = ["test-array"];
            loadCollections(mockScreen, mockConfig);

            const collectionsLoaded = mockScreen.load.once.mock.calls[0][1];
            collectionsLoaded();

            expect(mockScreen.load.json5).not.toHaveBeenCalledWith({
                key: "collections/catalogue1",
                url: "collections/catalogue1.json5",
            });
        });

        test("Initialises collections", () => {
            const initSpy = jest.fn();
            initCollectionModule.initCollection = () => initSpy;

            loadCollections(mockScreen, mockConfig);

            const collectionsLoaded = mockScreen.load.once.mock.calls[0][1];
            collectionsLoaded();

            const cataloguesLoaded = mockScreen.load.once.mock.calls[1][1];
            cataloguesLoaded();

            expect(initSpy.mock.calls[0][0]).toBe("collection1");
            expect(initSpy.mock.calls[1][0]).toBe("collection2");
        });
    });
});
