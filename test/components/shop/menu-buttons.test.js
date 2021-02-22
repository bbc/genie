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
import * as text from "../../../src/core/layout/text-elem.js";
import { gmi } from "../../../src/core/gmi/gmi.js";

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
        on: jest.fn(),
    };

    const mockText = { setOrigin: jest.fn() };
    text.addText = jest.fn().mockReturnValue(mockText);

    const mockOuterBounds = { x: 0, y: 0, height: 300, width: 800 };

    const mockScene = {
        assetPrefix: "shop",
        add: {
            gelButton: jest.fn(() => mockButton),
            image: jest.fn(),
        },
        scene: { key: "mockSceneKey" },
        setVisiblePane: jest.fn(),
        stack: jest.fn(),
        events: { once: jest.fn() },
        config: {
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
    gmi.setStatsScreen = jest.fn();

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
                key: "menuButtonBackground",
                scene: "shop",
            };
            expect(mockScene.add.gelButton.mock.calls[0][2]).toStrictEqual(expectedConfig);
            const otherConfig = { ...expectedConfig, title: "Manage", id: "manage_menu_button", ariaLabel: "Manage" };
            expect(mockScene.add.gelButton.mock.calls[1][2]).toStrictEqual(otherConfig);
        });
        describe("callback", () => {
            let callback;
            beforeEach(() => {
                callback = mockButton.on.mock.calls[0][1];
            });
            test("is subscribed to the event bus", () => {
                expect(mockButton.on).toHaveBeenCalledTimes(2);
                expect(typeof callback).toBe("function");
            });
            test("calls scene.stack with the pane title", () => {
                callback();
                expect(mockScene.stack).toHaveBeenCalledWith("shop");
            });
            test("and fires a screen view stat with hardcoded 'shopbuy' value", () => {
                callback();
                expect(gmi.setStatsScreen).toHaveBeenCalledWith("shopbuy");
            });
            test("the other button fires a hardcoded 'shopmanage' value", () => {
                const otherCallback = mockButton.on.mock.calls[1][1];
                otherCallback();
                expect(gmi.setStatsScreen).toHaveBeenCalledWith("shopmanage");
            });
        });
        test("sets text overlays", () => {
            expect(mockButton.overlays.set).toHaveBeenCalledTimes(2);
            expect(text.addText.mock.calls[0][3]).toBe("Shop");
            expect(text.addText.mock.calls[1][3]).toBe("Manage");
        });
        test("accesibilifies", () => {
            expect(a11y.accessibilify).toHaveBeenCalledTimes(2);
        });
    });

    describe("createConfirmButtons", () => {
        const cancelCallback = jest.fn();
        const confirmCallback = jest.fn();

        beforeEach(() => {
            createConfirmButtons(mockContainer, "Buy", confirmCallback, cancelCallback);
        });

        test("provides a slightly different config", () => {
            const expectedConfig = {
                title: "Buy",
                gameButton: true,
                accessibilityEnabled: true,
                ariaLabel: "Buy",
                channel: "shop",
                group: "mockSceneKey",
                id: "tx_buy_button",
                key: "menuButtonBackground",
                scene: "shop",
            };
            expect(mockScene.add.gelButton.mock.calls[0][2]).toStrictEqual(expectedConfig);
            const otherConfig = { ...expectedConfig, title: "Cancel", id: "tx_cancel_button", ariaLabel: "Cancel" };
            expect(mockScene.add.gelButton.mock.calls[1][2]).toStrictEqual(otherConfig);
        });
        test("uses the callback it was passed", () => {
            const firstCallback = mockButton.on.mock.calls[0][1];
            firstCallback();
            expect(confirmCallback).toHaveBeenCalled();
            const secondCallback = mockButton.on.mock.calls[1][1];
            secondCallback();
            expect(cancelCallback).toHaveBeenCalled();
        });
    });

    describe("resizeGelButtons()", () => {
        const mockButton = {
            setY: jest.fn(),
            setX: jest.fn(),
            setScale: jest.fn(),
            width: 200,
        };
        let pane;
        beforeEach(() => {
            pane = {
                buttons: [mockButton],
                config: {
                    menu: {
                        buttonsRight: true,
                    },
                },
                container: {
                    scene: mockScene,
                    list: [{ getBounds: () => mockOuterBounds }],
                },
            };
            jest.clearAllMocks();
            resizeGelButtons(pane);
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
                pane.container.scene.config.menu.buttonsRight = false;
                resizeGelButtons(pane);
                expect(mockButton.setX.mock.calls[0][0]).toBe(300);
            });
        });
    });
});
