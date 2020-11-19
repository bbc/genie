/**
 * @module components/shop
 * @copyright BBC 2020
 * @author BBC Children's D+E
 * @license Apache-2.0 Apache-2.0
 */

import {
    createMenuButtons,
    createConfirmButtons,
    resizeGelButtons,
} from "../../../src/components/shop/menu-buttons.js";
import { eventBus } from "../../../src/core/event-bus.js";
import * as a11y from "../../../src/core/accessibility/accessibilify.js";

describe("shop menu buttons", () => {
    let buttons;
    const mockButton = {
        overlays: { set: jest.fn() },
        setScale: jest.fn(),
        setY: jest.fn(),
        setX: jest.fn(),
        width: 53,
    };
    const mockText = { setOrigin: jest.fn() };
    const mockScene = {
        assetPrefix: "shop",
        add: {
            gelButton: jest.fn().mockReturnValue(mockButton),
            image: jest.fn(),
            text: jest.fn().mockReturnValue(mockText),
        },
        scene: { key: "mockSceneKey" },
        setVisiblePane: jest.fn(),
    };
    const mockConfig = {
        assetKeys: { buttonIcon: "mockIconKey", buttonBackground: "mockBackgroundKey" },
    };
    const mockOuterBounds = { y: 50, height: 400 };
    const mockInnerBounds = { x: 200, y: 50, height: 300, width: 100 };
    const yOffset = 47;
    eventBus.subscribe = jest.fn();
    a11y.accessibilify = jest.fn();

    afterEach(() => jest.clearAllMocks());

    describe("createMenuButtons()", () => {
        beforeEach(() => (buttons = createMenuButtons(mockScene, mockInnerBounds, mockConfig, yOffset)));
        test("adds two gel buttons", () => {
            expect(buttons.length).toBe(2);
            expect(mockScene.add.gelButton).toHaveBeenCalledTimes(2);
        });
        test("distributes them along the Y of bounds", () => {
            expect(mockScene.add.gelButton.mock.calls[0][0]).toBe(900);
            expect(mockScene.add.gelButton.mock.calls[0][1]).toBe(322);
            expect(mockScene.add.gelButton.mock.calls[1][0]).toBe(900);
            expect(mockScene.add.gelButton.mock.calls[1][1]).toBe(472);
        });
        test("gives them appropriate config", () => {
            const expectedConfig = {
                title: "Shop",
                gameButton: true,
                accessibilityEnabled: true,
                ariaLabel: "Shop",
                channel: "shop",
                group: "mockSceneKey",
                id: "shop_menu_button",
                key: "mockBackgroundKey",
                scene: "shop",
            };
            expect(mockScene.add.gelButton.mock.calls[0][2]).toStrictEqual(expectedConfig);
            const otherConfig = { ...expectedConfig, title: "Manage", id: "manage_menu_button", ariaLabel: "Manage" };
            expect(mockScene.add.gelButton.mock.calls[1][2]).toStrictEqual(otherConfig);
        });
        test("subscribes them to the event bus", () => {
            expect(eventBus.subscribe).toHaveBeenCalledTimes(2);
            const message = eventBus.subscribe.mock.calls[0][0];
            expect(message.channel).toBe("shop");
            expect(message.name).toBe("shop_menu_button");
            message.callback();
            expect(mockScene.setVisiblePane).toHaveBeenCalledWith("shop");
        });
        test("sets overlays for text and button icon", () => {
            expect(mockButton.overlays.set).toHaveBeenCalledTimes(4);
            expect(mockScene.add.image.mock.calls[0][2]).toBe("shop.mockIconKey");
            expect(mockScene.add.image.mock.calls[1][2]).toBe("shop.mockIconKey");
            expect(mockScene.add.text.mock.calls[0][2]).toBe("Shop");
            expect(mockScene.add.text.mock.calls[1][2]).toBe("Manage");
        });
        test("accesibilifies", () => {
            expect(a11y.accessibilify).toHaveBeenCalledTimes(2);
        });
        test("scales the buttons", () => {
            expect(mockButton.setScale).toHaveBeenCalledTimes(2);
        });
    });

    describe("createConfirmButtons", () => {
        beforeEach(() => (buttons = createConfirmButtons(mockScene, mockInnerBounds, mockConfig, yOffset)));

        test("provides a slightly different config", () => {
            const expectedConfig = {
                title: "Confirm",
                gameButton: true,
                accessibilityEnabled: true,
                ariaLabel: "Confirm",
                channel: "shop",
                group: "mockSceneKey",
                id: "tx_confirm_button",
                key: "mockBackgroundKey",
                scene: "shop",
            };
            expect(mockScene.add.gelButton.mock.calls[0][2]).toStrictEqual(expectedConfig);
            const otherConfig = { ...expectedConfig, title: "Cancel", id: "tx_cancel_button", ariaLabel: "Cancel" };
            expect(mockScene.add.gelButton.mock.calls[1][2]).toStrictEqual(otherConfig);
        });
    });

    describe("resizeGelButtons()", () => {
        beforeEach(() => {
            jest.clearAllMocks();
            resizeGelButtons(buttons, mockOuterBounds, mockInnerBounds, true);
        });

        test("sets the position of each button", () => {
            expect(mockButton.setY).toHaveBeenCalledTimes(2);
            expect(mockButton.setX).toHaveBeenCalledTimes(2);
            expect(mockButton.setX.mock.calls[0][0]).toBe(900);
            expect(mockButton.setY.mock.calls[0][0]).toBe(525);
            expect(mockButton.setY.mock.calls[1][0]).toBe(675);
        });
        test("sets the scale of each button", () => {
            expect(mockButton.setScale).toHaveBeenCalledTimes(2);
            expect(buttons[0].setScale).toHaveBeenCalledWith(1.8867924528301887);
        });
        describe("when buttonsRight is false", () => {
            beforeEach(() => {
                jest.clearAllMocks();
                resizeGelButtons(buttons, mockOuterBounds, mockInnerBounds, false);
            });
            test("the x position is further left", () => {
                expect(mockButton.setX.mock.calls[0][0]).toBe(500);
            });
        });
    });
});
