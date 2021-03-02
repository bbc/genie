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
import * as button from "../../../src/core/layout/create-button.js";
import * as textElem from "../../../src/core/layout/text-elem.js";
import * as gel from "../../../src/core/layout/gel-defaults.js";

jest.mock("../../../src/core/layout/text-elem.js");
jest.mock("../../../src/core/layout/create-button.js");
jest.mock("../../../src/core/layout/gel-defaults.js");

describe("createMenuButtons()", () => {
    let mockScene;
    let mockGelButton;
    let mockTextElem;
    let mockTextWithOrigin;
    let mockChannel;
    beforeEach(() => {
        mockChannel = "gel-channel";
        gel.buttonsChannel = jest.fn().mockReturnValue(mockChannel);
        mockTextWithOrigin = { mock: "text" };
        mockTextElem = { setOrigin: jest.fn().mockReturnValue(mockTextWithOrigin) };
        textElem.addText = jest.fn().mockReturnValue(mockTextElem);
        mockGelButton = { overlays: { set: jest.fn() } };
        button.createButton = jest.fn().mockReturnValue(mockGelButton);
        mockScene = {
            config: {
                menu: {
                    buttons: {},
                },
            },
            scene: {
                key: "shop-menu",
            },
        };
    });
    afterEach(() => jest.clearAllMocks());

    test("returns a shop and manage menu button", () => {
        const buttons = createMenuButtons(mockScene);
        expect(buttons.length).toBe(2);
    });

    test("calls createButton twice with the correct button config", () => {
        createMenuButtons(mockScene);
        expect(button.createButton).toHaveBeenCalledTimes(2);
        expect(button.createButton).toHaveBeenCalledWith(mockScene, {
            gameButton: true,
            accessible: true,
            channel: mockChannel,
            group: "shop-menu",
            title: "Shop",
            id: "shop_menu_button",
            ariaLabel: "Shop",
            action: expect.any(Function),
        });
        expect(button.createButton).toHaveBeenCalledWith(mockScene, {
            gameButton: true,
            accessible: true,
            channel: mockChannel,
            group: "shop-menu",
            title: "Manage",
            id: "manage_menu_button",
            ariaLabel: "Manage",
            action: expect.any(Function),
        });
    });

    test("sets a caption on both buttons", () => {
        createMenuButtons(mockScene);
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
            mockScene.config.menu.buttonsRight = false;
            resizeGelButtons(pane);
            expect(mockButton.setX.mock.calls[0][0]).toBe(300);
        });
    });
});
