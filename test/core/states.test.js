/**
 * @copyright BBC 2020
 * @author BBC Children's D+E
 * @license Apache-2.0
 */
import { states, initState } from "../../src/core/states.js";
import * as gmiModule from "../../src/core/gmi/gmi.js";

describe("State", () => {
    let mockGmi;
    let mockSettings;

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
    });

    describe("Create", () => {
        test("adds an entry to the states map", () => {
            initState("stateKey", {});

            expect(states.get("stateKey")).toBeDefined();
        });

        test("returns an object with get, getAll and set access functions", () => {
            const stateSet = initState("stateKey", []);

            expect(stateSet.get).toEqual(expect.any(Function));
            expect(stateSet.getAll).toEqual(expect.any(Function));
            expect(stateSet.set).toEqual(expect.any(Function));
        });
    });

    describe("Returned set method", () => {
        test("calls gmiSetGameData with correct data", () => {
            const stateSet = initState("stateKey", []);
            stateSet.set("test_choice", "locked");

            expect(mockGmi.setGameData).toHaveBeenCalledWith("genie", {
                stateKey: { test_choice: { state: "locked" } },
            });
        });

        test("Sets state to null (undefined cannot be serialised) when called with no config", () => {
            const stateSet = initState("stateKey", []);
            stateSet.set("test_choice", "locked");
            stateSet.set("test_choice");

            expect(mockGmi.setGameData).toHaveBeenCalledWith("genie", {
                stateKey: { test_choice: { state: null } },
            });
        });
    });

    describe("Returned get method", () => {
        test("does not fail if gameData.genie is blank", () => {
            delete mockSettings.gameData.genie;
            const stateSet = initState("stateKey", []);

            expect(() => stateSet.get("test_choice")).not.toThrow();
        });

        test("Returns current state for given key", () => {
            const expectedData = { test: "data" };
            mockSettings.gameData.genie = { stateKey: { test_choice: expectedData } };
            const stateSet = initState("stateKey", []);

            expect(stateSet.get("test_choice")).toEqual(expectedData);
        });

        test("overrides config with local storage for a given key", () => {
            mockSettings.gameData.genie = { stateKey: { test_choice: { state: "complete" } } };
            const stateSet = initState("stateKey", [{ id: "test_choice", state: "locked" }]);
            expect(stateSet.get("test_choice").state).toEqual("complete");
        });
    });

    describe("Returned getAll method", () => {
        test("Returns current state for all keys", () => {
            mockSettings.gameData.genie = {
                stateKey: { test_choice1: { state: "complete" }, test_choice2: { state: "locked" } },
            };

            const testConfig = [
                { id: "test_choice1" },
                { id: "test_choice2", state: "complete" },
                { id: "test_choice3", state: "locked" },
            ];

            const expected = [
                { id: "test_choice1", state: "complete" },
                { id: "test_choice2", state: "locked" },
                { id: "test_choice3", state: "locked" },
            ];

            const stateSet = initState("stateKey", testConfig);
            expect(stateSet.getAll()).toEqual(expected);
        });

        test("Returns an empty array when there is no config and no local storage", () => {
            mockSettings.gameData.genie = {};

            const stateSet = initState("stateKey", []);
            expect(stateSet.getAll()).toEqual([]);
        });
    });

    describe("Debug", () => {
        test("adds states to __debug if present", () => {
            global.window.__debug = {};
            initState("localStorageKey", {});

            expect(window.__debug.states).toEqual(states);
        });
    });
});
