/**
 * @module core/layout/scrollable-list
 * @copyright BBC 2020
 * @author BBC Children's D+E
 * @license Apache-2.0 Apache-2.0
 */
import * as buttons from "../../../../src/components/shop/scrollable-list/scrollable-list-buttons.js";
import * as overlays from "../../../../src/components/shop/scrollable-list/button-overlays.js";
import * as handlers from "../../../../src/components/shop/scrollable-list/scrollable-list-handlers.js";
import { eventBus } from "../../../../src/core/event-bus.js";
import * as a11y from "../../../../src/core/accessibility/accessibilify.js";
import { collections } from "../../../../src/core/collections.js";

describe("Scrollable List Buttons", () => {
    let button;
    let mockItem;
    let mockCollection;

    const mockButton = {
        input: { enabled: true },
        on: jest.fn(),
        off: jest.fn(),
        width: 100,
        setScale: jest.fn(),
        config: { id: "foo_bar_itemKey_shop" },
        rexContainer: { parent: { getTopmostSizer: jest.fn().mockReturnValue({ space: { top: 10 } }) } },
        overlays: { remove: jest.fn(), list: { foo: "bar", baz: "qux" } },
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
            listPadding: { x: 10, y: 8, outerPadFactor: 2 },
            overlay: {
                items: [{ foo: "bar" }],
                options: {
                    shop: [
                        { baz: "qux", activeStates: ["cta"] },
                        { wiz: "bang", activeStates: ["actioned"] },
                        { wiz: "bang", activeStates: ["unique"] },
                        { wiz: "bang", activeStates: ["notInStock"] },
                    ],
                    manage: [
                        { baz: "qux", activeStates: ["cta"] },
                        { wiz: "bang", activeStates: ["actioned"] },
                    ],
                },
            },
            paneCollections: { shop: "armoury", manage: "inventory" },
        },
        input: { y: 50 },
        scale: { displaySize: { height: 100 } },
        scene: { key: "shop" },
        events: { once: jest.fn() },
    };
    mockButton.scene = mockScene;

    overlays.overlays1Wide = jest.fn();
    a11y.accessibilify = jest.fn();
    const mockEvent = { unsubscribe: "foo" };
    eventBus.subscribe = jest.fn().mockReturnValue(mockEvent);
    handlers.handleClickIfVisible = jest.fn();
    const mockCallback = jest.fn();

    afterEach(() => jest.clearAllMocks());

    beforeEach(() => {
        mockItem = {
            id: "mockId",
            ariaLabel: "mockAriaLabel",
            state: "",
        };
        mockCollection = { get: jest.fn().mockReturnValue(mockItem) };
        collections.get = jest.fn().mockReturnValue(mockCollection);
        button = buttons.createGelButton(mockScene, mockItem, "shop", "cta", mockCallback);
    });

    describe("createGelButton()", () => {
        test("adds a gel button", () => {
            expect(mockScene.add.gelButton).toHaveBeenCalled();
        });

        test("provides it the correct config", () => {
            const expectedConfig = {
                gameButton: true,
                group: "shop",
                id: "scroll_button_mockId_shop",
                key: "itemBackground",
                scene: "mockScene",
                scrollable: true,
            };
            expect(mockScene.add.gelButton).toHaveBeenCalledWith(0, 0, expectedConfig);
        });

        test("scales the button", () => {
            buttons.createGelButton(mockScene, mockItem, "shop", "cta");
            expect(mockButton.setScale).toHaveBeenCalled();
        });

        test("applies overlays", () => {
            buttons.createGelButton(mockScene, mockItem, "manage", "actioned");
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
                expect(mockButton.overlays.remove.mock.calls[0][0]).toBe("foo");
                expect(mockButton.overlays.remove.mock.calls[1][0]).toBe("baz");
            });
            test("setAll() sets all overlays for the current state", () => {
                jest.clearAllMocks();
                mockButton.overlays.setAll();
                const expected = [{ foo: "bar" }, { baz: "qux", activeStates: ["cta"] }];
                const configs = overlays.overlays1Wide.mock.calls[0][1];
                expect(configs).toEqual(expected);
            });
        });
    });
    describe("updateButton()", () => {
        test("gets the item from the appropriate collection", () => {
            buttons.updateButton(button);
            expect(collections.get).toHaveBeenCalledWith("armoury");
            expect(mockCollection.get).toHaveBeenCalledWith("itemKey");
        });
        test("updates the overlays if the data was updated", () => {
            jest.clearAllMocks();
            button.item = { ...button.item, state: "equipped" };
            buttons.updateButton(button);
            expect(button.overlays.remove).toHaveBeenCalledWith("foo");
            expect(button.overlays.remove).toHaveBeenCalledWith("baz");
            expect(overlays.overlays1Wide).toHaveBeenCalled();
        });
        test("does not update if the data has not changed", () => {
            jest.clearAllMocks();
            buttons.updateButton(button);
            expect(button.overlays.remove).not.toHaveBeenCalled();
            expect(button.overlays.remove).not.toHaveBeenCalled();
            expect(overlays.overlays1Wide).not.toHaveBeenCalled();
        });
    });

    describe("getButtonState() returns a string describing the button state", () => {
        test("state is actioned when in the shop and items no longer available", () => {
            mockItem.qty = 0;
            expect(buttons.getButtonState(mockScene, { qty: 1 }, "shop")).toEqual(["cta", "consumable", "available"]);
            mockItem.qty = 1;
            expect(buttons.getButtonState(mockScene, { qty: 0 }, "shop")).toEqual([
                "actioned",
                "consumable",
                "unavailable",
            ]);
        });
        test("state is actioned when in the manage section and item is equipped", () => {
            const item = { slot: "helmet" };
            expect(buttons.getButtonState(mockScene, item, "manage")).toEqual(["cta", "equippable", "unavailable"]);
            mockItem.state = "equipped";
            expect(buttons.getButtonState(mockScene, item, "manage")).toEqual([
                "actioned",
                "equippable",
                "unavailable",
            ]);
        });
    });
});
