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
        setLegal: jest.fn(),
        input: {},
        accessibleElement: { update: jest.fn() },
    };
    const mockText = { setOrigin: jest.fn() };
    const mockOuterBounds = { x: 0, y: 0, height: 300, width: 800 };

    const mockScene = {
        assetPrefix: "shop",
        add: {
            gelButton: jest.fn(() => mockButton),
            image: jest.fn(),
            text: jest.fn(() => mockText),
        },
        scene: { key: "mockSceneKey" },
        setVisiblePane: jest.fn(),
        stack: jest.fn(),
        events: { once: jest.fn() },
        config: {
            assetKeys: { buttonIcon: "mockIconKey", buttonBackground: "mockBackgroundKey" },
            menu: { buttonsRight: true },
        },
        layout: {
            getSafeArea: jest.fn(() => mockOuterBounds),
        },
    };

    const mockContainer = {
        scene: mockScene,
        list: [
            {
                getBounds: () => mockOuterBounds,
            },
        ],
    };
    const mockEvent = { unsubscribe: "foo" };
    eventBus.subscribe = jest.fn(() => mockEvent);
    a11y.accessibilify = jest.fn(x => x);

    afterEach(() => jest.clearAllMocks());

    describe("createMenuButtons()", () => {
        beforeEach(() => (buttons = createMenuButtons(mockContainer)));
        test("adds two gel buttons", () => {
            expect(buttons.length).toBe(2);
            expect(mockScene.add.gelButton).toHaveBeenCalledTimes(2);
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
            expect(mockScene.stack).toHaveBeenCalledWith("shop");
            expect(mockScene.events.once).toHaveBeenCalledWith("shutdown", "foo");
        });
        test("sets text overlays", () => {
            expect(mockButton.overlays.set).toHaveBeenCalledTimes(2);
            expect(mockScene.add.text.mock.calls[0][2]).toBe("Shop");
            expect(mockScene.add.text.mock.calls[1][2]).toBe("Manage");
        });
        test("accesibilifies", () => {
            expect(a11y.accessibilify).toHaveBeenCalledTimes(2);
        });
    });

    describe("createConfirmButtons", () => {
        const callback = jest.fn();
        beforeEach(() => {
            createConfirmButtons(mockContainer, callback);
        });

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
        test("uses the callback it was passed", () => {
            const message = eventBus.subscribe.mock.calls[0][0];
            message.callback();
            expect(callback).toHaveBeenCalled();
        });
        describe("setLegal()", () => {
            let confirmButton;
            beforeEach(() => (confirmButton = buttons[0]));

            test("is applied to the 'Confirm' button", () => {
                expect(typeof confirmButton.setLegal).toBe("function");
            });
            test("when called with true, sets tint and alpha and enables the a11y elem", () => {
                confirmButton.setLegal(true);
                expect(confirmButton.alpha).toBe(1);
                expect(confirmButton.tint).toBe(0xffffff);
                expect(confirmButton.input.enabled).toBe(true);
                expect(confirmButton.accessibleElement.update).toHaveBeenCalled();
            });
            test("when called with false, sets tint and alpha and disables the a11y elem", () => {
                confirmButton.setLegal(false);
                expect(confirmButton.alpha).toBe(0.25);
                expect(confirmButton.tint).toBe(0xff0000);
                expect(confirmButton.input.enabled).toBe(false);
                expect(confirmButton.accessibleElement.update).toHaveBeenCalled();
            });
        });
    });

    describe("resizeGelButtons()", () => {
        const mockButton = {
            setY: jest.fn(),
            setX: jest.fn(),
            setScale: jest.fn(),
            width: 200,
        };
        let container;
        beforeEach(() => {
            container = {
                buttons: [mockButton],
                config: {
                    menu: {
                        buttonsRight: true,
                    },
                },
                scene: mockScene,
                list: [{ getBounds: () => mockOuterBounds }],
            };
            jest.clearAllMocks();
            resizeGelButtons(container);
        });

        test("sets the position of each button", () => {
            expect(mockButton.setX.mock.calls[0][0]).toBe(1100);
            expect(mockButton.setY.mock.calls[0][0]).toBe(375);
        });
        test("sets the scale of each button", () => {
            expect(mockButton.setScale).toHaveBeenCalledTimes(1);
            expect(mockButton.setScale).toHaveBeenCalledWith(4);
        });
        describe("when buttonsRight is false", () => {
            test("the x position is mirrored", () => {
                jest.clearAllMocks();
                container.scene.config.menu.buttonsRight = false;
                resizeGelButtons(container, mockOuterBounds);
                expect(mockButton.setX.mock.calls[0][0]).toBe(300);
            });
        });
    });
});
