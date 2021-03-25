/**
 * @copyright BBC 2021
 * @author BBC Children's D+E
 * @license Apache-2.0
 */
import { titleText } from "../../../../src/components/shop/confirm/title-text.js";
import * as collectionsModule from "../../../../src/core/collections.js";
import * as itemChecksModule from "../../../../src/components/shop/confirm/item-checks.js";

describe("Prompt Text", () => {
    let mockScene;
    let mockCollection;
    let mockItem;

    beforeEach(() => {
        mockScene = {
            config: {
                confirm: {
                    prompt: {
                        buy: {
                            illegal: "illegalBuyPrompt",
                            legal: "legalBuyPrompt",
                            unavailable: "unavailableBuyPrompt",
                        },
                        equip: {
                            illegal: "illegalEquipPrompt",
                            legal: "legalEquipPrompt",
                        },
                        unequip: "unequipPrompt",
                        use: "usePrompt",
                    },
                },
            },
            transientData: { shop: { config: { shopCollections: { manage: {} } } } },
        };

        mockItem = { qty: 0, price: 99 };

        mockCollection = { get: jest.fn(() => mockItem) };
        collectionsModule.collections = { get: jest.fn(() => mockCollection) };
    });

    afterEach(jest.clearAllMocks);

    describe("for the shop", () => {
        test("when item is out of stock, is the 'item unavailable' prompt", () => {
            itemChecksModule.canAffordItem = jest.fn(() => true);
            itemChecksModule.itemIsInStock = jest.fn(() => false);

            expect(titleText.buy({ scene: mockScene, action: "buy", item: {} })).toBe("unavailableBuyPrompt");
        });

        test("when item is in stock and not affordable, is the 'can't afford' prompt", () => {
            itemChecksModule.canAffordItem = jest.fn(() => false);
            itemChecksModule.itemIsInStock = jest.fn(() => true);
            expect(titleText.buy({ scene: mockScene, action: "buy", item: {} })).toBe("illegalBuyPrompt");
        });

        test("when item is in stock and affordable, is the 'confirm transaction' prompt", () => {
            itemChecksModule.canAffordItem = jest.fn(() => true);
            itemChecksModule.itemIsInStock = jest.fn(() => true);
            expect(titleText.buy({ scene: mockScene, action: "buy", item: {} })).toBe("legalBuyPrompt");
        });
    });

    describe("for the inventory", () => {
        test("unequip action returns configured unequip prompt", () => {
            expect(titleText.unequip({ scene: mockScene, action: "unequip", item: {} })).toBe("unequipPrompt");
        });

        test("when equipping and item is equippable is the 'equip' text", () => {
            itemChecksModule.isEquippable = jest.fn(() => true);
            expect(titleText.equip({ scene: mockScene, action: "equip", item: {} })).toBe("legalEquipPrompt");
        });

        test("when equipping and item is not equippable is the illegal 'equip' text", () => {
            itemChecksModule.isEquippable = jest.fn(() => false);
            expect(titleText.equip({ scene: mockScene, action: "equip", item: {} })).toBe("illegalEquipPrompt");
        });

        test("when the item is consumable, is the 'use' text", () => {
            expect(titleText.use({ scene: mockScene, action: "use", item: {} })).toBe("usePrompt");
        });
    });
});
