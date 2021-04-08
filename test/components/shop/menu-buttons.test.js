/**
 * @module components/shop
 * @copyright BBC 2020
 * @author BBC Children's D+E
 * @license Apache-2.0
 */

import {
    createMenuButtons,
    createConfirmButtons,
    resizeGelButtons,
} from "../../../src/components/shop/menu-buttons.js";
import * as button from "../../../src/core/layout/create-button.js";
import * as textElem from "../../../src/core/layout/text.js";
import * as gel from "../../../src/core/layout/gel-defaults.js";
import * as mockGmi from "../../../src/core/gmi/gmi.js";

jest.mock("../../../src/core/layout/metrics.js");
jest.mock("../../../src/core/layout/text.js");
jest.mock("../../../src/core/layout/create-button.js");
jest.mock("../../../src/core/layout/gel-defaults.js");
jest.mock("../../../src/core/gmi/gmi.js");

describe("create menu/confirm buttons", () => {
    let mockScene;
    let mockGelButton;
    let mockTextElem;
    let mockTextWithOrigin;
    let mockChannel;
    beforeEach(() => {
        mockGmi.gmi.setStatsScreen = jest.fn();
        mockGmi.gmi.sendStatsEvent = jest.fn();
        mockChannel = "gel-channel";
        gel.buttonsChannel = jest.fn(() => mockChannel);
        mockTextWithOrigin = { mock: "text" };
        mockTextElem = { setOrigin: jest.fn(() => mockTextWithOrigin) };
        textElem.addText = jest.fn(() => mockTextElem);
        mockGelButton = { overlays: { set: jest.fn() } };
        button.createButton = jest.fn(() => mockGelButton);
        mockScene = {
            addOverlay: jest.fn(),
            transientData: {
                shop: {},
            },
            config: {
                menu: {
                    buttons: {
                        key: "menukey",
                    },
                },
                confirm: {
                    buttons: {
                        key: "buy-key",
                        cancelKey: "cancel-key",
                    },
                },
            },
            scene: {
                key: "shop-menu",
                pause: jest.fn(),
            },
        };
    });
    afterEach(() => jest.clearAllMocks());

    test("returns a shop and manage menu button", () => {
        const buttons = createMenuButtons(mockScene);
        expect(buttons.length).toBe(2);
    });

    test("creates two menu buttons with the correct button config", () => {
        createMenuButtons(mockScene);
        expect(button.createButton).toHaveBeenCalledTimes(2);
        expect(button.createButton).toHaveBeenCalledWith(mockScene, {
            gameButton: true,
            accessible: true,
            channel: mockChannel,
            title: "Shop",
            id: "shop_menu_button",
            ariaLabel: "Shop",
            action: expect.any(Function),
            key: mockScene.config.menu.buttons.key,
        });
        expect(button.createButton).toHaveBeenCalledWith(mockScene, {
            gameButton: true,
            accessible: true,
            channel: mockChannel,
            title: "Manage",
            id: "manage_menu_button",
            ariaLabel: "Manage",
            action: expect.any(Function),
            key: mockScene.config.menu.buttons.key,
        });
    });

    test("sets a caption on both menu buttons", () => {
        createMenuButtons(mockScene);
        expect(mockGelButton.overlays.set).toHaveBeenCalledTimes(2);
        expect(mockGelButton.overlays.set).toHaveBeenCalledWith("caption", mockTextWithOrigin);
    });

    test("menu button action sets transient data correctly when shop button is clicked", () => {
        createMenuButtons(mockScene);
        button.createButton.mock.calls[0][1].action();
        expect(mockScene.transientData.shop.mode).toBe("shop");
    });

    test("menu button action sets transient data correctly when manage button is clicked", () => {
        createMenuButtons(mockScene);
        button.createButton.mock.calls[1][1].action();
        expect(mockScene.transientData.shop.mode).toBe("manage");
    });

    test("menu button action sets pauses the scene", () => {
        createMenuButtons(mockScene);
        button.createButton.mock.calls[0][1].action();
        expect(mockScene.scene.pause).toHaveBeenCalled();
    });

    test("menu button action adds the shop list overlay", () => {
        createMenuButtons(mockScene);
        button.createButton.mock.calls[0][1].action();
        expect(mockScene.addOverlay).toHaveBeenCalledWith("shop-list");
    });

    test("buy button sends 'shopbuy' stat when clicked", () => {
        createMenuButtons(mockScene);
        button.createButton.mock.calls[0][1].action();
        expect(mockGmi.gmi.sendStatsEvent).toHaveBeenCalledWith("shopbuy", "click", {});
    });

    test("manage button sends 'shopmanage' stat when clicked", () => {
        createMenuButtons(mockScene);
        button.createButton.mock.calls[1][1].action();
        expect(mockGmi.gmi.sendStatsEvent).toHaveBeenCalledWith("shopmanage", "click", {});
    });

    test("returns an action button and a cancel button", () => {
        const buttons = createConfirmButtons(
            mockScene,
            "action",
            () => {},
            () => {},
            {},
        );
        expect(buttons.length).toBe(2);
    });

    test("creates two confirm buttons with the correct button config", () => {
        const confirmCallback = jest.fn();
        const cancelCallback = jest.fn();
        createConfirmButtons(mockScene, "Buy", confirmCallback, cancelCallback, {});
        expect(button.createButton).toHaveBeenCalledTimes(2);
        expect(button.createButton).toHaveBeenCalledWith(mockScene, {
            gameButton: true,
            accessible: true,
            channel: mockChannel,
            title: "Buy",
            id: "tx_buy_button",
            ariaLabel: "Buy",
            action: confirmCallback,
            key: "buy-key",
        });
        expect(button.createButton).toHaveBeenCalledWith(mockScene, {
            gameButton: true,
            accessible: true,
            channel: mockChannel,
            title: "Cancel",
            id: "tx_cancel_button",
            ariaLabel: "Cancel",
            action: cancelCallback,
            key: "cancel-key",
        });
    });

    test("Adds 'clickSound' to config if set in item config", () => {
        const confirmCallback = jest.fn();
        const cancelCallback = jest.fn();
        createConfirmButtons(mockScene, "Buy", confirmCallback, cancelCallback, { audio: { buy: "test-click" } });

        expect(button.createButton).toHaveBeenCalledWith(mockScene, {
            gameButton: true,
            accessible: true,
            channel: mockChannel,
            title: "Buy",
            id: "tx_buy_button",
            ariaLabel: "Buy",
            action: confirmCallback,
            key: "buy-key",
            clickSound: "test-click",
        });
    });

    test("sets a caption on both confirm buttons", () => {
        createConfirmButtons(
            mockScene,
            "action",
            () => {},
            () => {},
            {},
        );
        expect(mockGelButton.overlays.set).toHaveBeenCalledTimes(2);
        expect(mockGelButton.overlays.set).toHaveBeenCalledWith("caption", mockTextWithOrigin);
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
    let mockScene;
    let mockOuterBounds;

    beforeEach(() => {
        mockOuterBounds = { x: 0, y: 0, height: 300, width: 800 };
        mockScene = {
            config: {
                menu: {
                    buttonsRight: true,
                },
            },
        };
        pane = {
            buttons: [mockButton],
            config: {
                menu: {
                    buttonsRight: true,
                },
            },
            rect: {
                getBounds: jest.fn(() => mockOuterBounds),
                scene: mockScene,
                list: [{ getBounds: () => mockOuterBounds }],
            },
        };
        mockButton.scene = mockScene;
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
            mockScene.config.menu.buttonsRight = false;
            resizeGelButtons(pane);
            expect(mockButton.setX.mock.calls[0][0]).toBe(300);
        });
    });
});
