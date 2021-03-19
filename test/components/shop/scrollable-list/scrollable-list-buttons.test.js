/**
 * @module core/layout/scrollable-list
 * @copyright BBC 2020
 * @author BBC Children's D+E
 * @license Apache-2.0 Apache-2.0
 */
import { createListButton } from "../../../../src/components/shop/scrollable-list/scrollable-list-buttons.js";
import * as overlays from "../../../../src/components/shop/scrollable-list/button-overlays.js";
import * as createButton from "../../../../src/core/layout/create-button.js";
import { collections } from "../../../../src/core/collections.js";

jest.mock("../../../../src/components/shop/scrollable-list/button-overlays.js");
jest.mock("../../../../src/core/layout/create-button.js");

describe("Scrollable List Buttons", () => {
    let mockItem;
    let mockCollection;
    const dummyCallback = () => {};
    let mockGelButton;
    let mockScene;

    afterEach(() => jest.clearAllMocks());

    beforeEach(() => {
        mockScene = {
            assetPrefix: "shop",
            layout: {
                getSafeArea: jest.fn(() => ({ width: 100 })),
            },
            config: {
                listPadding: { x: 10, y: 8, outerPadFactor: 2 },
                states: { locked: { properties: { someProperty: "someValue" }, disabled: true } },
                overlay: {
                    items: [{ foo: "bar" }],
                    options: {
                        shop: [
                            { baz: "qux", showWhen: ["cta"] },
                            { wiz: "bang", showWhen: ["actioned"] },
                            { wiz: "bang", showWhen: ["unique"] },
                            { wiz: "bang", showWhen: ["notInStock"] },
                        ],
                        manage: [
                            { baz: "qux", showWhen: ["cta"] },
                            { wiz: "bang", showWhen: ["actioned"] },
                        ],
                    },
                },
            },
            input: { y: 50 },
            scene: { key: "shop" },
            sys: {
                scale: {
                    parent: {},
                },
            },
            transientData: {
                shop: {
                    config: {
                        shopCollections: {
                            manage: "",
                            shop: "",
                        },
                    },
                },
            },
        };
        mockGelButton = {
            item: {},
            scene: mockScene,
            config: { id: "foo_bar_itemKey_shop", title: "shop" },
            sprite: {},
            setScale: jest.fn(),
            off: jest.fn(),
        };
        mockItem = {
            id: "mockId",
            ariaLabel: "mockAriaLabel",
            state: "",
            title: "shop",
            description: "test description",
        };
        mockCollection = { get: jest.fn(() => mockItem) };
        collections.get = jest.fn(() => mockCollection);
        createButton.createButton = jest.fn(() => mockGelButton);
        createListButton(mockScene, mockItem, "shop", dummyCallback);
    });

    describe("createListButton()", () => {
        test("adds a gel button", () => {
            expect(createButton.createButton).toHaveBeenCalled();
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
            expect(createButton.createButton).toHaveBeenCalledWith(mockScene, expectedConfig);
        });

        test("Adds state to beginning of Aria Label", () => {
            mockItem.state = "locked";
            jest.clearAllMocks();
            createListButton(mockScene, mockItem, "shop");
            expect(createButton.createButton.mock.calls[0][1].ariaLabel).toBe("locked shop - test description");
        });

        test("scales the button", () => {
            createListButton(mockScene, mockItem, "shop");
            expect(mockGelButton.setScale).toHaveBeenCalled();
        });

        test("merges any properties specified for the item's state into the gel button sprite", () => {
            mockItem.state = "locked";
            createListButton(mockScene, mockItem, "shop");
            expect(mockGelButton.sprite.someProperty).toBe("someValue");
        });

        test("applies overlays", () => {
            createListButton(mockScene, mockItem, "manage");
            expect(overlays.overlays1Wide).toHaveBeenCalled();
        });

        test("turns off the pointer up event on the button if the button is not enabled", () => {
            mockItem.state = "locked";
            createListButton(mockScene, mockItem, "shop");
            expect(mockGelButton.off).toHaveBeenCalledWith(Phaser.Input.Events.POINTER_UP);
        });

        test("does not turn off the pointer up event on the button if the button is enabled", () => {
            createListButton(mockScene, mockItem, "shop");
            expect(mockGelButton.off).not.toHaveBeenCalled();
        });
    });
});
