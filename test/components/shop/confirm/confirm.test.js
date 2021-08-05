/**
 * @module components/shop
 * @copyright BBC 2020
 * @author BBC Children's D+E
 * @license Apache-2.0
 */

import { createConfirm } from "../../../../src/components/shop/confirm/confirm.js";
import * as shopConfirmActions from "../../../../src/components/shop/confirm/actions.js";
import * as itemPanel from "../../../../src/components/shop/confirm/item-panel.js";
import * as buttonPanel from "../../../../src/components/shop/confirm/button-panel.js";

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
		itemPanel.createItemPanel = jest.fn(() => mockItemPanel);
		buttonPanel.createButtonPanel = jest.fn(() => mockButtonPanel);
		itemPanel.resizeItemPanel = jest.fn(() => mockItemPanelResizeFn);
		buttonPanel.resizeButtonPanel = jest.fn(() => mockButtonPanelResizeFn);
		shopConfirmActions.actions = {
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
		expect(buttonPanel.createButtonPanel).toHaveBeenCalledWith(mockScene, mockScene.transientData.shop.item);
	});

	test("creates an item panel", () => {
		createConfirm(mockScene);
		expect(itemPanel.createItemPanel).toHaveBeenCalledWith(mockScene, mockScene.transientData.shop.item);
	});

	test("returns a function that calls resize on both panels", () => {
		const returnedFn = createConfirm(mockScene);
		expect(buttonPanel.resizeButtonPanel).toHaveBeenCalledWith(mockScene, mockButtonPanel);
		expect(itemPanel.resizeItemPanel).toHaveBeenCalledWith(mockScene, mockItemPanel);
		jest.clearAllMocks();
		returnedFn();
		expect(mockItemPanelResizeFn).toHaveBeenCalled();
		expect(mockButtonPanelResizeFn).toHaveBeenCalled();
	});
});
