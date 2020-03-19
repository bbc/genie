/**
 * @copyright BBC 2020
 * @author BBC Children's D+E
 * @license Apache-2.0
 */
import { Launcher } from "../../../src/core/debug/launcher.js";
import { eventBus } from "../../../src/core/event-bus.js";
import * as examplesModule from "../../../src/core/debug/examples.js";
import { Results } from "../../../src/components/results/results-screen.js";

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
                scene: {
                    key: "testKey",
                },
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
        launcher.scene = {
            key: "launcher",
        };
        launcher._data = {
            transient: {},
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
            expect(launcher._data.transient.testKey).toBe("testValue");
        });

        test("Does not set transientData if absent from example config", () => {
            eventBus.subscribe.mock.calls[3][0].callback();
            console.log(eventBus.subscribe.mock.calls)
            expect(launcher._data.transient.testKey).not.toBeDefined();
        });
    });
});
