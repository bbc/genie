/**
 * @copyright BBC 2020
 * @author BBC Children's D+E
 * @license Apache-2.0
 */
import { collections, initCollection } from "../../src/core/collections.js";
import * as gmiModule from "../../src/core/gmi/gmi.js";

describe("Collections", () => {
    let mockSettings;
    let mockGmi;
    let testCollection;
    let testCatalogue;
    let mockScreen;
    let mockCache;

    beforeEach(() => {
        mockSettings = { gameData: {} };
        mockGmi = {
            setGameData: jest.fn(),
            getAllSettings: jest.fn(() => mockSettings),
        };

        const mockWindow = {
            getGMI: () => mockGmi,
        };

        gmiModule.setGmi(undefined, mockWindow);

        testCollection = {
            catalogue: "testCatalogue",
        };

        testCatalogue = [
            {
                id: "id1",
                title: "Title 1 ",
                description: "Catalogue Item 1.",
                tags: ["tag1"],
            },
            {
                id: "id2",
                title: "Title 2",
                description: "Catalogue Item 2.",
                tags: ["tag2"],
            },
        ];

        mockCache = {
            "collections/testCollection": testCollection,
            "collections/testCatalogue": testCatalogue,
        };

        mockScreen = {
            cache: {
                json: {
                    get: jest.fn(key => mockCache[key]),
                },
            },
        };
    });

    afterEach(jest.clearAllMocks);

    describe("initCollection", () => {
        test("adds an entry to the collections map", () => {
            initCollection(mockScreen)("testCollection");
            expect(collections.get("testCollection")).toBeDefined();
        });

        test("returns an object with get, getAll and set access functions", () => {
            const collection = initCollection(mockScreen)("testCollection");

            expect(collection.get).toEqual(expect.any(Function));
            expect(collection.getAll).toEqual(expect.any(Function));
            expect(collection.set).toEqual(expect.any(Function));
        });
    });

    describe("Returned getAll method", () => {
        test("Returns all catalogues from json cache if string specified", () => {
            const collection = initCollection(mockScreen)("testCollection");
            const expected = testCatalogue.map(item => ({ ...item, qty: 1 }));

            expect(collection.getAll()).toEqual(expected);
        });

        test("uses inline array as catalogue if specified", () => {
            testCollection.catalogue = [
                {
                    id: "Xid1",
                    title: "XTitle 1 ",
                    description: "XCatalogue Item 1.",
                    tags: ["Xtag1"],
                },
                {
                    id: "Xid2",
                    title: "XTitle 2",
                    description: "XCatalogue Item 2.",
                    tags: ["Xtag2"],
                },
            ];

            const collection = initCollection(mockScreen)("testCollection");
            const expected = testCollection.catalogue.map(item => ({ ...item, qty: 1 }));

            expect(collection.getAll()).toEqual(expected);
        });

        test("Returns all catalogue items with tags listed in 'include' property and default qty of 1", () => {
            testCollection.include = ["tag1", "tag2"];

            const expected = testCatalogue.map(item => ({ ...item, qty: 1 }));

            const collection = initCollection(mockScreen)("testCollection");
            expect(collection.getAll()).toEqual(expected);
        });

        test("Returns all catalogue items specified by 'defaults' config and default qty of 1", () => {
            testCollection.defaults = [{ id: "id1" }];

            const collection = initCollection(mockScreen)("testCollection");
            const expected = testCatalogue.map(item => ({ ...item, qty: 1 }));

            expect(collection.getAll()).toEqual(expected);
        });

        test("Returns all catalogue items specified by 'defaults' config and any specified overrides", () => {
            testCollection.defaults = [{ id: "id1", qty: 5, state: "testState" }];

            const collection = initCollection(mockScreen)("testCollection");
            expect(collection.getAll()).toEqual([
                { ...testCatalogue[0], qty: 5, state: "testState" },
                { ...testCatalogue[1], qty: 1 },
            ]);
        });

        test("Returns tagged items with 'defaults' overrides", () => {
            testCollection.include = ["tag1", "tag2"];
            testCollection.defaults = [{ id: "id1", qty: 5, state: "testState" }];

            const expected = [
                {
                    description: "Catalogue Item 1.",
                    id: "id1",
                    qty: 5,
                    state: "testState",
                    tags: ["tag1"],
                    title: "Title 1 ",
                },
                {
                    description: "Catalogue Item 2.",
                    id: "id2",
                    qty: 1,
                    tags: ["tag2"],
                    title: "Title 2",
                },
            ];

            const collection = initCollection(mockScreen)("testCollection");
            expect(collection.getAll()).toEqual(expected);
        });

        test("Returns tagged items with 'defaults' overrides and local storage overrides", () => {
            mockSettings.gameData.genie = {
                collections: {
                    testCollection: [{ id: "id2", qty: 10 }],
                },
            };

            testCollection.include = ["tag1", "tag2"];
            testCollection.defaults = [{ id: "id1", qty: 5, state: "testState" }];

            const expected = [
                {
                    description: "Catalogue Item 1.",
                    id: "id1",
                    qty: 5,
                    state: "testState",
                    tags: ["tag1"],
                    title: "Title 1 ",
                },
                {
                    description: "Catalogue Item 2.",
                    id: "id2",
                    qty: 10,
                    tags: ["tag2"],
                    title: "Title 2",
                },
            ];

            const collection = initCollection(mockScreen)("testCollection");
            expect(collection.getAll()).toEqual(expected);
        });

        test("Correctly unions local storage data with defaults if items are not in base (filtered) set", () => {
            mockSettings.gameData.genie = {
                collections: {
                    testCollection: [
                        { id: "id2", qty: 10 },
                        { id: "ItemOutsideSet", qty: 5 },
                    ],
                },
            };

            testCatalogue.push({
                id: "ItemOutsideSet",
                qty: 10,
            });

            testCollection.include = ["tag1", "tag2"];
            testCollection.defaults = [{ id: "id1", qty: 5, state: "testState" }];

            const expected = [
                {
                    description: "Catalogue Item 1.",
                    id: "id1",
                    qty: 5,
                    state: "testState",
                    tags: ["tag1"],
                    title: "Title 1 ",
                },
                {
                    description: "Catalogue Item 2.",
                    id: "id2",
                    qty: 10,
                    tags: ["tag2"],
                    title: "Title 2",
                },
                {
                    id: "ItemOutsideSet",
                    qty: 5,
                },
            ];

            const collection = initCollection(mockScreen)("testCollection");
            expect(collection.getAll()).toEqual(expected);
        });
    });

    describe("Returned get method", () => {
        test("does not fail if gameData.genie is blank", () => {
            delete mockSettings.gameData.genie;
            expect(() => initCollection("testCollection", mockScreen)).not.toThrow();
        });

        test("Returns current state for given key", () => {
            const expectedData = {
                description: "Catalogue Item 1.",
                id: "id1",
                qty: 5,
                tags: ["tag1"],
                title: "Title 1 ",
            };

            testCollection.include = ["tag1", "tag2"];
            mockSettings.gameData.genie = { collections: { testCollection: [{ id: "id1", qty: 5 }] } };

            const collection = initCollection(mockScreen)("testCollection");
            expect(collection.get("id1")).toEqual(expectedData);
        });
    });

    describe("Returned set method", () => {
        test("calls gmiSetGameData with correct data", () => {
            const collection = initCollection(mockScreen)("testCollection");
            collection.set({ id: "id1", qty: 5, state: "testState" });

            const expected = { collections: { testCollection: [{ id: "id1", qty: 5, state: "testState" }] } };

            expect(mockGmi.setGameData).toHaveBeenCalledWith("genie", expected);
        });

        test("Sets Collection to null (undefined cannot be serialised) when called with no config", () => {
            const collection = initCollection(mockScreen)("testCollection");
            collection.set({ id: "id1" });

            const expected = { collections: { testCollection: [{ id: "id1" }] } };

            expect(mockGmi.setGameData).toHaveBeenCalledWith("genie", expected);
        });

        test("Always serialises to an array ", () => {
            const collection = initCollection(mockScreen)("testCollection");
            collection.set({ id: "id1", qty: 5, state: "testState" });

            expect(mockGmi.setGameData.mock.calls[0][1].collections.testCollection).toStrictEqual(expect.any(Array));
        });

        test("Fires a warning if item not in catalogue / does not save", () => {
            const spy = jest.spyOn(console, "warn").mockImplementation(() => {});

            const collection = initCollection(mockScreen)("testCollection");
            collection.set({ id: "NotInCatalogue", qty: 5, state: "testState" });

            expect(spy).toHaveBeenCalled();
            expect(mockGmi.setGameData).not.toHaveBeenCalled();
        });

        test("Fires a warning if config is not an object", () => {
            const spy = jest.spyOn(console, "warn").mockImplementation(() => {});

            const collection = initCollection(mockScreen)("testCollection");
            collection.set(100);
            collection.set("string");

            expect(spy).toHaveBeenCalledTimes(2);
            expect(mockGmi.setGameData).not.toHaveBeenCalled();
        });
    });
});
