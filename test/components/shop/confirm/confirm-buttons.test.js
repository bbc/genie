/**
 * @copyright BBC 2021
 * @author BBC Children's D+E
 * @license Apache-2.0
 */
import { addConfirmButtons } from "../../../../src/components/shop/confirm/confirm-buttons.js";
import * as collectionsModule from "../../../../src/core/collections.js";
import * as transactModule from "../../../../src/components/shop/transact.js";
import * as gmiModule from "../../../../src/core/gmi/gmi.js";

describe("Confirm Buttons", () => {
    let mockButton;
    let mockText;
    let mockScene;
    let mockShopItem;
    let mockBalance;
    let mockShopCollection;

    beforeEach(() => {
        gmiModule.gmi = { sendStatsEvent: jest.fn() };
        transactModule.getBalanceItem = jest.fn(() => mockBalance);
        mockShopItem = { qty: 10, id: "test-id" };
        mockBalance = { qty: 0 };

        mockShopCollection = { get: jest.fn(() => mockShopItem), set: jest.fn() };

        collectionsModule.collections = { get: jest.fn(() => mockShopCollection) };
        mockButton = {
            overlays: {
                set: jest.fn(),
            },
            config: {
                id: "test-button-id",
            },
            scene: {
                sys: {
                    scale: {
                        parent: {},
                    },
                    accessibleButtons: [],
                },
                scene: {
                    key: "test-scene-key",
                },
            },
            input: {},
        };

        mockText = {
            setOrigin: jest.fn(),
        };
        mockScene = {
            _data: { addedBy: { scene: { resume: jest.fn() } } },
            removeOverlay: jest.fn(),
            transientData: {
                shop: {
                    config: {
                        shopCollections: {
                            manage: {},
                        },
                    },
                },
            },
            config: {
                confirm: {
                    buttons: {
                        key: "test-button-key",
                    },
                },
            },
            scene: { key: "test-key" },
            add: {
                gelButton: jest.fn(() => mockButton),
                text: jest.fn(() => mockText),
            },
        };
    });

    afterEach(jest.clearAllMocks);

    describe("addConfirmButtons", () => {
        test("creates 2 buttons", () => {
            expect(addConfirmButtons(mockScene, "", "", {}).length).toBe(2);
        });
    });

    test("disables action button if action is buy and you don't have enough balance", () => {
        mockBalance.qty = 10;

        const buttons = addConfirmButtons(mockScene, "", "buy", { price: 20 });

        expect(buttons[0].alpha).toBe(0.25);
    });

    test("disables action button if action is buy but there is no stock", () => {
        mockShopItem.qty = 0;

        const buttons = addConfirmButtons(mockScene, "", "buy", { price: 2 });

        expect(buttons[0].alpha).toBe(0.25);
    });

    test("Does not disable action button if action is buy and there is stock + balance", () => {
        mockBalance.qty = 100;
        const buttons = addConfirmButtons(mockScene, "", "buy", { price: 2 });

        expect(buttons[0].alpha).not.toBeDefined();
    });

    test("Removes overlay when buy button has been clicked ", () => {
        addConfirmButtons(mockScene, "", "buy", { price: 2 });

        const confirmCallback = mockScene.add.gelButton.mock.calls[0][2].action;

        confirmCallback();
        expect(mockScene.removeOverlay).toHaveBeenCalled();
    });
});
