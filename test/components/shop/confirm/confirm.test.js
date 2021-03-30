/**
 * @module components/shop
 * @copyright BBC 2020
 * @author BBC Children's D+E
 * @license Apache-2.0
 */

import { createConfirm } from "../../../../src/components/shop/confirm/confirm.js";
import * as ShopConfirmActions from "../../../../src/components/shop/confirm/actions.js";
import * as ItemPanel from "../../../../src/components/shop/confirm/item-panel.js";
import * as ButtonPanel from "../../../../src/components/shop/confirm/button-panel.js";

jest.mock("../../../../src/components/shop/confirm/item-panel.js");
jest.mock("../../../../src/components/shop/confirm/button-panel.js");
jest.mock("../../../../src/components/shop/confirm/actions.js");

describe("createConfirm", () => {
    let mockScene;
    let mockAction;
    let mockItemPanel;
    let mockButtonPanel;
    let mockItemPanelResizeFn;
    let mockButtonPanelResizeFn;

    beforeEach(() => {
        mockItemPanelResizeFn = jest.fn();
        mockButtonPanelResizeFn = jest.fn();
        mockItemPanel = "mockItemPanel";
        mockButtonPanel = "mockButtonPanel";
        mockAction = "mockAction";
        ItemPanel.createItemPanel = jest.fn(() => mockItemPanel);
        ButtonPanel.createButtonPanel = jest.fn(() => mockButtonPanel);
        ItemPanel.resizeItemPanel = jest.fn(() => mockItemPanelResizeFn);
        ButtonPanel.resizeButtonPanel = jest.fn(() => mockButtonPanelResizeFn);
        ShopConfirmActions.actions = {
            mockTitle: jest.fn(
                (scene, item) => scene === mockScene && item === mockScene.transientData.shop.item && mockAction,
            ),
        };
        mockScene = {
            scene: { key: "mockKey" },
            transientData: {
                shop: {
                    mode: "mockTitle",
                    item: "mockItem",
                },
            },
        };
    });

    afterEach(() => jest.clearAllMocks());

    test("sets transientData action", () => {
        createConfirm(mockScene);
        expect(mockScene.transientData[mockScene.scene.key].action).toBe(mockAction);
    });

    test("creates a button panel", () => {
        createConfirm(mockScene);
        expect(ButtonPanel.createButtonPanel).toHaveBeenCalledWith(mockScene, mockScene.transientData.shop.item);
    });

    test("creates an item panel", () => {
        createConfirm(mockScene);
        expect(ItemPanel.createItemPanel).toHaveBeenCalledWith(mockScene, mockScene.transientData.shop.item);
    });

    test("returns a function that calls resize on both panels", () => {
        const returnedFn = createConfirm(mockScene);
        expect(ButtonPanel.resizeButtonPanel).toHaveBeenCalledWith(mockScene, mockButtonPanel);
        expect(ItemPanel.resizeItemPanel).toHaveBeenCalledWith(mockScene, mockItemPanel);
        jest.clearAllMocks();
        returnedFn();
        expect(mockItemPanelResizeFn).toHaveBeenCalled();
        expect(mockButtonPanelResizeFn).toHaveBeenCalled();
    });
});
