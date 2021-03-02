/**
 * @module core/layout/scrollable-list
 * @copyright BBC 2020
 * @author BBC Children's D+E
 * @license Apache-2.0 Apache-2.0
 */
import { createListButton } from "../../../../src/components/shop/scrollable-list/scrollable-list-buttons.js";
import * as overlays from "../../../../src/components/shop/scrollable-list/button-overlays.js";
import { collections } from "../../../../src/core/collections.js";

describe("Scrollable List Buttons", () => {
    let mockItem;
    let mockCollection;
    const dummyCallback = () => {};

    let mockButton = {
        width: 100,
        setScale: jest.fn(),
        config: { id: "foo_bar_itemKey_shop", title: "shop" },
        overlays: { remove: jest.fn(), list: { foo: "bar", baz: "qux" } },
        sprite: {},
    };
    const mockScene = {
        assetPrefix: "shop",
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
        sys: {
            scale: {
                parent: {},
            },
        },
    };
    mockButton.scene = mockScene;

    overlays.overlays1Wide = jest.fn();

    afterEach(() => jest.clearAllMocks());

    beforeEach(() => {
        mockItem = {
            id: "mockId",
            ariaLabel: "mockAriaLabel",
            state: "",
            title: "shop",
            description: "test description",
        };
        mockCollection = { get: jest.fn().mockReturnValue(mockItem) };
        collections.get = jest.fn().mockReturnValue(mockCollection);
        button = createListButton(mockScene, mockItem, "shop", dummyCallback);
    });

    describe("createListButton()", () => {
        test("adds a gel button", () => {
            expect(mockScene.add.gelButton).toHaveBeenCalled();
        });

        test("provides it the correct config", () => {
            const expectedConfig = {
                accessible: true,
                action: dummyCallback,
                ariaLabel: "shop - test description",
                channel: "gel-buttons-shop",
                gameButton: true,
                group: "shop",
                id: "scroll_button_mockId_shop",
                key: "itemBackground",
                scene: "shop",
                scrollable: true,
                title: "shop",
            };
            expect(mockScene.add.gelButton).toHaveBeenCalledWith(0, 0, expectedConfig);
        });

        test("scales the button", () => {
            createListButton(mockScene, mockItem, "shop");
            expect(mockButton.setScale).toHaveBeenCalled();
        });

        test("merges any properties specified for the item's state into the gel button sprite", () => {
            mockItem.state = "locked";
            createListButton(mockScene, mockItem, "shop");
            expect(mockButton.sprite.someProperty).toBe("someValue");
        });

        test("applies overlays", () => {
            createListButton(mockScene, mockItem, "manage");
            expect(overlays.overlays1Wide).toHaveBeenCalled();
        });
    });
});
