/**
 * @module core/layout/scrollable-list
 * @copyright BBC 2020
 * @author BBC Children's D+E
 * @license Apache-2.0 Apache-2.0
 */
import * as buttons from "../../../../src/components/shop/scrollable-list/scrollable-list-buttons.js";
import * as overlays from "../../../../src/components/shop/scrollable-list/button-overlays.js";
import { collections } from "../../../../src/core/collections.js";

describe("Scrollable List Buttons", () => {
    let button;
    let mockItem;
    let mockCollection;

    const mockButton = {
        width: 100,
        setScale: jest.fn(),
        config: { id: "foo_bar_itemKey_shop" },
        overlays: { remove: jest.fn(), list: { foo: "bar", baz: "qux" } },
        sprite: {},
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
            listPadding: { x: 10, y: 8, outerPadFactor: 2 },
            states: { locked: { properties: { someProperty: "someValue" }, disabled: true } },
            overlay: {
                items: [{ foo: "bar" }],
                options: {
                    shop: [
                        { baz: "qux", activeInStates: ["cta"] },
                        { wiz: "bang", activeInStates: ["actioned"] },
                        { wiz: "bang", activeInStates: ["unique"] },
                        { wiz: "bang", activeInStates: ["notInStock"] },
                    ],
                    manage: [
                        { baz: "qux", activeInStates: ["cta"] },
                        { wiz: "bang", activeInStates: ["actioned"] },
                    ],
                },
            },
            paneCollections: { shop: "armoury", manage: "inventory" },
        },
        input: { y: 50 },
        scene: { key: "shop" },
    };
    mockButton.scene = mockScene;

    overlays.overlays1Wide = jest.fn();

    afterEach(() => jest.clearAllMocks());

    beforeEach(() => {
        mockItem = {
            id: "mockId",
            ariaLabel: "mockAriaLabel",
            state: "",
        };
        mockCollection = { get: jest.fn().mockReturnValue(mockItem) };
        collections.get = jest.fn().mockReturnValue(mockCollection);
        button = buttons.createGelButton(mockScene, mockItem, "shop");
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
            buttons.createGelButton(mockScene, mockItem, "shop");
            expect(mockButton.setScale).toHaveBeenCalled();
        });

        test("merges any properties specified for the item's state into the gel button sprite", () => {
            mockItem.state = "locked";
            buttons.createGelButton(mockScene, mockItem, "shop");
            expect(mockButton.sprite.someProperty).toBe("someValue");
        });

        test("applies overlays", () => {
            buttons.createGelButton(mockScene, mockItem, "manage");
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
            test("and an array of strings used as state labels", () => {
                const expectedStates = ["cta", "consumable", "unavailable", "unlocked"];
                expect(mockButton.overlays.state).toStrictEqual(expectedStates);
            });
            test("which switch based on the item state, slot, and quantity", () => {
                jest.clearAllMocks();
                mockItem.slot = "someSlot";
                mockItem.state = "purchased";
                mockItem.qty = 1;
                buttons.createGelButton(mockScene, mockItem, "shop");
                const expectedStates = ["actioned", "equippable", "available", "unlocked"];
                expect(mockButton.overlays.state).toStrictEqual(expectedStates);
            });
            test("unsetAll() unsets all overlays", () => {
                mockButton.overlays.unsetAll();
                expect(mockButton.overlays.remove.mock.calls[0][0]).toBe("foo");
                expect(mockButton.overlays.remove.mock.calls[1][0]).toBe("baz");
            });
            test("setAll() sets all overlays for the current state", () => {
                jest.clearAllMocks();
                mockButton.overlays.setAll();
                const expected = [{ foo: "bar" }, { baz: "qux", activeInStates: ["cta"] }];
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
});
