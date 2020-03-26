/**
 * @copyright BBC 2020
 * @author BBC Children's D+E
 * @license Apache-2.0
 */
import { Launcher } from "../../../src/core/debug/launcher.js";
import { eventBus } from "../../../src/core/event-bus.js";
import * as examplesModule from "../../../src/core/debug/examples.js";

describe("Examples Launcher", () => {
    let launcher;

    beforeEach(() => {
        launcher = new Launcher();

        const mockButton = {
            config: {
                id: "testButton",
            },
            overlays: { set: jest.fn() },
            scene: {
                scene: { key: "testKey" },
                sys: { scale: { parent: "mockParent" }, accessibleButtons: [] },
            },
        };

        launcher.add = {
            image: jest.fn(),
            text: jest.fn(() => ({
                setOrigin: jest.fn(),
            })),
            gelButton: jest.fn(() => mockButton),
        };
        launcher.setLayout = jest.fn();
        launcher.navigation = { next: jest.fn(), example1: jest.fn(), example2: jest.fn() };
        launcher.scene = { key: "launcher", add: jest.fn() };
        launcher.cache = {
            json: {
                get: jest.fn(() => ({ config: { files: [] } })),
            },
        };
        launcher._data = {
            transient: {},
            navigation: {},
            config: {
                theme: {},
            },
        };

        launcher.load = {
            setBaseURL: jest.fn(),
            setPath: jest.fn(),
            pack: jest.fn(),
        };

        examplesModule.examples = {
            example1: {
                scene: function() {},
                title: "test title",
                transientData: {
                    testKey: "testValue",
                },
                routes: {},
            },
            example2: {
                scene: function() {},
                title: "test title",
                routes: {},
            },
        };

        eventBus.subscribe = jest.fn();
    });

    describe("create method", () => {
        beforeEach(() => {
            launcher.create();
        });

        test("Intentionally loose test as page not included in final output", () => {
            expect(launcher.add.image).toHaveBeenCalled();
            expect(launcher.add.gelButton).toHaveBeenCalled();
            expect(launcher.setLayout).toHaveBeenCalledWith(["home"]);
            expect(eventBus.subscribe).toHaveBeenCalled();
        });

        test("Sets transientData if present in example config", () => {
            eventBus.subscribe.mock.calls[1][0].callback();
            expect(launcher._data.transient.example1.testKey).toBe("testValue");
        });

        test("Does not set transientData if absent from example config", () => {
            eventBus.subscribe.mock.calls[3][0].callback();
            expect(launcher._data.transient.testKey).not.toBeDefined();
        });
    });

    describe("preload method", () => {
        beforeEach(() => {
            launcher.preload();
        });

        test("Preloads example files so they aren't part of standard loader", () => {
            expect(launcher.load.setBaseURL).toHaveBeenCalled();
            expect(launcher.load.setPath).toHaveBeenCalled();
            expect(launcher.load.pack).toHaveBeenCalledWith("example-files");
        });
    });
});
