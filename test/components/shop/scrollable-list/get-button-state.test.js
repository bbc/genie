/**
 * @copyright BBC 2021
 * @author BBC Children's D+E
 * @license Apache-2.0
 */

/*
const equippable = item => Boolean(item.slot);
const stocked = item => item?.qty > 0;
const locked = (item, config) => item.state && config.states[item.state] && config.states[item.state].disabled;
const equipped = item => item?.state === "equipped";

export const getButtonState = (scene, item, title) => {
    const states = [];
    const inventoryItem = collections.get(scene.config.paneCollections.manage).get(item.id);
    const isButtonCta = title === "shop" ? stocked(inventoryItem) : equipped(inventoryItem);
    states.push(isButtonCta ? "actioned" : "cta");
    states.push(equippable(item) ? "equippable" : "consumable");
    states.push(stocked(item) ? "available" : "unavailable");
    states.push(locked(item, scene.config) ? "locked" : "unlocked");
    return states;
};

 */

import { getButtonState } from "../../../../src/components/shop/scrollable-list/get-button-state.js";
import { collections } from "../../../../src/core/collections.js";

describe("getButtonState", () => {
    let mockScene;
    let mockItem;
    let mockCollection;

    beforeEach(() => {
        mockScene = {
            config: {
                states: { equipped: "", testLockedState: { disabled: true } },
                paneCollections: { manage: "manageKey" },
            },
        };
        mockItem = {
            id: "mockId",
            ariaLabel: "mockAriaLabel",
            state: "",
            title: "shop",
            description: "test description",
        };
        mockCollection = { get: jest.fn().mockReturnValue(mockItem) };
        collections.get = jest.fn().mockReturnValue(mockCollection);
    });

    afterEach(jest.clearAllMocks);

    test("if shop and not in inventory contains 'cta'", () => {
        expect(getButtonState(mockScene, mockItem, "shop")).toContain("cta");
    });

    test("if shop and in inventory contains 'actioned'", () => {
        mockItem.qty = 1;
        expect(getButtonState(mockScene, mockItem, "shop")).toContain("actioned");
    });

    test("if manage and not equipped contains 'cta'", () => {
        expect(getButtonState(mockScene, mockItem, "manage")).toContain("cta");
    });

    test("if manage and equipped contains 'actioned'", () => {
        mockItem.state = "equipped";
        expect(getButtonState(mockScene, mockItem, "manage")).toContain("actioned");
    });

    test("if no item.slot contains 'consumable'", () => {
        expect(getButtonState(mockScene, mockItem, "shop")).toContain("consumable");
    });

    test("if has item.slot contains 'consumable'", () => {
        mockItem.slot = "test";
        expect(getButtonState(mockScene, mockItem, "shop")).toContain("equippable");
    });

    test("if no item.qty contains 'unavailable'", () => {
        expect(getButtonState(mockScene, mockItem, "shop")).toContain("unavailable");
    });

    test("if has item.qty contains 'available'", () => {
        mockItem.qty = 1;
        expect(getButtonState(mockScene, mockItem, "shop")).toContain("available");
    });

    test("if has item.state is not disabled contains 'unlocked'", () => {
        expect(getButtonState(mockScene, mockItem, "shop")).toContain("unlocked");
    });

    test("if item state is a disabled state contains 'locked'", () => {
        mockItem.state = "testLockedState";
        expect(getButtonState(mockScene, mockItem, "shop")).toContain("locked");
    });
});
