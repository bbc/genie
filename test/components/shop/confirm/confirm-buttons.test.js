/**
 * @copyright BBC 2021
 * @author BBC Children's D+E
 * @license Apache-2.0
 */
import { addConfirmButtons } from "../../../../src/components/shop/confirm/confirm-buttons.js";
import * as menuButtons from "../../../../src/components/shop/menu-buttons.js";
import * as itemChecks from "../../../../src/components/shop/confirm/item-checks.js";
import * as transact from "../../../../src/components/shop/transact.js";

jest.mock("../../../../src/core/collections.js");
jest.mock("../../../../src/components/shop/transact.js");
jest.mock("../../../../src/components/shop/menu-buttons.js");
jest.mock("../../../../src/components/shop/confirm/item-checks.js");

describe("Confirm Buttons", () => {
    let mockScene;
    let mockConfirmButtons;
    let mockActionButton;
    let mockCancelButton;
    let mockItem;

    beforeEach(() => {
        itemChecks.canAffordItem = jest.fn(() => true);
        itemChecks.isEquippable = jest.fn(() => true);
        itemChecks.itemIsInStock = jest.fn(() => true);
        mockConfirmButtons = [mockActionButton, mockCancelButton];
        mockItem = { price: 20 };
        mockActionButton = { accessibleElement: { update: jest.fn() }, input: { enabled: true } };
        mockCancelButton = { accessibleElement: { update: jest.fn() }, input: { enabled: true } };
        menuButtons.createConfirmButtons = jest.fn(() => mockConfirmButtons);
        mockScene = {
            _data: { addedBy: { scene: { resume: jest.fn() } } },
            removeOverlay: jest.fn(),
        };
    });

    afterEach(jest.clearAllMocks);

    test("returns 2 buttons", () => {
        const buttons = addConfirmButtons(mockScene, "", "", {});
        expect(buttons).toBe(mockConfirmButtons);
        expect(buttons.length).toBe(2);
    });

    test("calls createConfirmButtons correctly", () => {
        addConfirmButtons(mockScene, "mockTitle", "buy", mockItem);
        expect(menuButtons.createConfirmButtons).toHaveBeenCalledWith(
            mockScene,
            "Buy",
            expect.any(Function),
            expect.any(Function),
            { price: 20 },
        );
        const actionButtonCallback = menuButtons.createConfirmButtons.mock.calls[0][2];
        const cancelButtonCallback = menuButtons.createConfirmButtons.mock.calls[0][3];
        jest.clearAllMocks();
        actionButtonCallback();
        expect(transact.buy).toHaveBeenCalledWith(mockScene, mockItem);
        expect(mockScene._data.addedBy.scene.resume).toHaveBeenCalled();
        expect(mockScene.removeOverlay).toHaveBeenCalled();
        jest.clearAllMocks();
        cancelButtonCallback();
        expect(mockScene._data.addedBy.scene.resume).toHaveBeenCalled();
        expect(mockScene.removeOverlay).toHaveBeenCalled();
    });

    test("action button calls transact equip when action is equip", () => {
        addConfirmButtons(mockScene, "mockTitle", "equip", mockItem);
        const actionButtonCallback = menuButtons.createConfirmButtons.mock.calls[0][2];
        jest.clearAllMocks();
        actionButtonCallback();
        expect(transact.equip).toHaveBeenCalledWith(mockScene, mockItem);
    });

    test("action button calls transact unequip when action is unequip", () => {
        addConfirmButtons(mockScene, "mockTitle", "unequip", mockItem);
        const actionButtonCallback = menuButtons.createConfirmButtons.mock.calls[0][2];
        jest.clearAllMocks();
        actionButtonCallback();
        expect(transact.unequip).toHaveBeenCalledWith(mockScene, mockItem);
    });

    test("action button calls transact use when action is use", () => {
        addConfirmButtons(mockScene, "mockTitle", "use", mockItem);
        const actionButtonCallback = menuButtons.createConfirmButtons.mock.calls[0][2];
        jest.clearAllMocks();
        actionButtonCallback();
        expect(transact.use).toHaveBeenCalledWith(mockScene, mockItem);
    });

    test("disables action button when action is buy but can't afford item", () => {
        itemChecks.canAffordItem = jest.fn(() => false);
        const buttons = addConfirmButtons(mockScene, "mockTitle", "buy", mockItem);
        expect(buttons[0].alpha).toBe(0.25);
        expect(buttons[0].tint).toBe(0xff0000);
        expect(buttons[0].input.enabled).toBe(false);
        expect(buttons[0].accessibleElement.update).toHaveBeenCalled();
    });

    test("disables action button when action is buy but item isn't in stock", () => {
        itemChecks.itemIsInStock = jest.fn(() => false);
        const buttons = addConfirmButtons(mockScene, "mockTitle", "buy", mockItem);
        expect(buttons[0].alpha).toBe(0.25);
        expect(buttons[0].tint).toBe(0xff0000);
        expect(buttons[0].input.enabled).toBe(false);
        expect(buttons[0].accessibleElement.update).toHaveBeenCalled();
    });

    test("disables action button when action is equip but item isn't equippable", () => {
        itemChecks.isEquippable = jest.fn(() => false);
        const buttons = addConfirmButtons(mockScene, "mockTitle", "equip", mockItem);
        expect(buttons[0].alpha).toBe(0.25);
        expect(buttons[0].tint).toBe(0xff0000);
        expect(buttons[0].input.enabled).toBe(false);
        expect(buttons[0].accessibleElement.update).toHaveBeenCalled();
    });
});
