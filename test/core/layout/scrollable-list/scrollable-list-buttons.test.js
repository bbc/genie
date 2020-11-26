/**
 * @module core/layout/scrollable-list
 * @copyright BBC 2020
 * @author BBC Children's D+E
 * @license Apache-2.0 Apache-2.0
 */
import * as buttons from "../../../../src/core/layout/scrollable-list/scrollable-list-buttons.js";
import * as overlays from "../../../../src/core/layout/scrollable-list/button-overlays.js";
import * as handlers from "../../../../src/core/layout/scrollable-list/scrollable-list-handlers.js";
import { eventBus } from "../../../../src/core/event-bus.js";
import * as a11y from "../../../../src/core/accessibility/accessibilify.js";

describe("Scrollable List Buttons", () => {
    const mockButton = {
        width: 100,
        setScale: jest.fn(),
        config: { id: "foo" },
        rexContainer: { parent: { getTopmostSizer: jest.fn().mockReturnValue({ space: { top: 10 } }) } },
        overlays: { remove: jest.fn(), list: { a: "foo", b: "bar" } },
    };

    const mockScene = {
        assetPrefix: "mockScene",
        add: {
            gelButton: jest.fn().mockReturnValue(mockButton),
        },
        layout: {
            getSafeArea: jest.fn().mockReturnValue({ width: 100 }),
        },
        config: {
            eventChannel: "mockChannel",
            assetKeys: {
                itemBackground: "itemBackground",
            },
            listPadding: { x: 10, y: 8 },
            overlay: {
                items: [{ foo: "bar" }],
                options: {
                    shop: [
                        { baz: "qux", activeStates: ["cta"] },
                        { wiz: "bang", activeStates: ["actioned"] },
                    ],
                },
            },
        },
        input: { y: 50 },
        scale: { displaySize: { height: 100 } },
        scene: { key: "shop" },
        events: { once: jest.fn() },
    };

    const mockItem = {
        id: "mockId",
        ariaLabel: "mockAriaLabel",
    };

    overlays.overlays1Wide = jest.fn();
    a11y.accessibilify = jest.fn();
    const mockEvent = { unsubscribe: "foo" };
    eventBus.subscribe = jest.fn().mockReturnValue(mockEvent);
    handlers.handleClickIfVisible = jest.fn();
    const mockCallback = jest.fn();

    afterEach(() => jest.clearAllMocks());

    beforeEach(() => buttons.createGelButton(mockScene, mockItem, "shop", "cta", mockCallback));

    describe("createGelButton()", () => {
        test("adds a gel button", () => {
            expect(mockScene.add.gelButton).toHaveBeenCalled();
        });

        test("provides it the correct config", () => {
            const expectedConfig = {
                accessibilityEnabled: true,
                ariaLabel: "mockAriaLabel",
                channel: "mockChannel",
                gameButton: true,
                group: "shop",
                id: "scroll_button_mockId_shop",
                key: "itemBackground",
                scene: "mockScene",
                scrollable: true,
            };
            expect(mockScene.add.gelButton).toHaveBeenCalledWith(0, 0, expectedConfig);
        });

        test("subscribes to the event bus", () => {
            const args = eventBus.subscribe.mock.calls[0][0];
            expect(args.channel).toEqual("mockChannel");
            expect(args.name).toEqual("scroll_button_mockId_shop");
            const callback = handlers.handleClickIfVisible.mock.calls[0][2];
            callback();
            expect(mockCallback).toHaveBeenCalled();
            expect(mockScene.events.once).toHaveBeenCalledWith("shutdown", "foo");
        });

        test("scales the button", () => {
            buttons.createGelButton(mockScene, mockItem, "shop", "cta");
            expect(mockButton.setScale).toHaveBeenCalled();
        });

        test("applies overlays", () => {
            buttons.createGelButton(mockScene, mockItem, "shop", "cta");
            expect(overlays.overlays1Wide).toHaveBeenCalled();
        });

        describe("overlay handling", () => {
            test("decorates the button's .overlays with additional functions", () => {
                expect(typeof mockButton.overlays.setAll).toBe("function");
                expect(typeof mockButton.overlays.unsetAll).toBe("function");
            });
            test("plus all the overlay configs", () => {
                const expected = {
                    items: mockScene.config.overlay.items,
                    options: mockScene.config.overlay.options.shop,
                };
                expect(mockButton.overlays.configs).toStrictEqual(expected);
            });
            test("and a string to indicate state", () => {
                expect(mockButton.overlays.state).toBe("cta");
            });
            test("unsetAll() unsets all overlays", () => {
                mockButton.overlays.unsetAll();
                expect(mockButton.overlays.remove.mock.calls[0][0]).toBe("a");
                expect(mockButton.overlays.remove.mock.calls[1][0]).toBe("b");
            });
            test("setAll() sets all overlays for the current state", () => {
                jest.clearAllMocks();
                mockButton.overlays.setAll();
                const expected = [{ foo: "bar" }, { baz: "qux", activeStates: ["cta"] }];
                const { configs } = overlays.overlays1Wide.mock.calls[0][0];
                expect(configs).toStrictEqual(expected);
            });
        });
    });
});
