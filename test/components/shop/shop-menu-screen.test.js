/**
 * @module components/shop
 * @copyright BBC 2020
 * @author BBC Children's D+E
 * @license Apache-2.0
 */
import RexUIPlugin from "../../../lib/rexuiplugin.min.js";
import * as scaler from "../../../src/core/scaler.js";
import * as title from "../../../src/core/titles.js";
import * as balance from "../../../src/components/shop/balance.js";
import * as menu from "../../../src/components/shop/menu.js";
import { ShopMenu } from "../../../src/components/shop/shop-menu-screen.js";
import { initResizers } from "../../../src/components/shop/backgrounds.js";

jest.mock("../../../src/core/titles.js");
jest.mock("../../../src/components/shop/backgrounds.js");
jest.mock("../../../src/components/shop/balance.js");
jest.mock("../../../src/components/shop/menu.js");
jest.mock("../../../lib/rexuiplugin.min.js");
jest.mock("../../../src/core/scaler.js");

describe("Shop Menu Screen", () => {
    let shopMenu;
    let mockTitle;
    let mockResize;
    let mockScalerEvent;
    let mockShopConfig;
    beforeEach(() => {
        mockTitle = {
            title: { resize: jest.fn(), destroy: jest.fn() },
            subtitle: { resize: jest.fn(), destroy: jest.fn() },
        };
        title.createTitles = jest.fn(() => mockTitle);
        mockResize = jest.fn();
        menu.createMenu = jest.fn(() => mockResize);
        mockScalerEvent = { unsubscribe: jest.fn() };
        scaler.onScaleChange = { add: jest.fn(() => mockScalerEvent) };
        mockShopConfig = { mock: "config" };
        ShopMenu.prototype.plugins = {
            installScenePlugin: jest.fn(),
        };
        ShopMenu.prototype.events = {
            once: jest.fn(),
            on: jest.fn(),
            off: jest.fn(),
        };
        shopMenu = new ShopMenu();
        shopMenu.titles = mockTitle;
        shopMenu.addBackgroundItems = jest.fn();
        shopMenu.setLayout = jest.fn();
        shopMenu.scene = { key: "shop-menu" };
        shopMenu.plugins = { installScenePlugin: jest.fn() };
        shopMenu._data = { addedBy: undefined, transient: {}, config: { "shop-menu": { shopConfig: mockShopConfig } } };

        global.RexPlugins = {
            GameObjects: {
                NinePatch: jest.fn(),
            },
        };
    });
    afterEach(() => jest.clearAllMocks());

    test("installs rexUI plugin on preload", () => {
        shopMenu.preload();
        expect(shopMenu.plugins.installScenePlugin).toHaveBeenCalledWith("rexUI", RexUIPlugin, "rexUI", shopMenu, true);
    });

    test("inits resizers", () => {
        shopMenu.preload();
        expect(initResizers).toHaveBeenCalled();
    });

    test("calls addBackgroundItems on create", () => {
        shopMenu.create();
        expect(shopMenu.addBackgroundItems).toHaveBeenCalled();
    });

    test("calls setLayout on create", () => {
        shopMenu.create();
        expect(shopMenu.setLayout).toHaveBeenCalledWith(["back", "pause"]);
    });

    test("calls setLayout with overlay back button when being overlayed", () => {
        shopMenu._data.addedBy = { screen: "mock" };
        shopMenu.create();
        expect(shopMenu.setLayout).toHaveBeenCalledWith(["overlayBack", "pause"]);
    });

    test("sets shopConfig to transientData", () => {
        shopMenu.create();
        expect(shopMenu.transientData.shop).toEqual({ config: mockShopConfig });
    });

    test("calls setBalance", () => {
        shopMenu.create();
        expect(balance.setBalance).toHaveBeenCalledWith(shopMenu);
    });

    test("creates menu", () => {
        shopMenu.create();
        expect(menu.createMenu).toHaveBeenCalledWith(shopMenu);
    });

    test("adds a onScaleChange event on create", () => {
        shopMenu.create();
        expect(scaler.onScaleChange.add).toHaveBeenCalledWith(expect.any(Function));
    });

    test("onScaleChange callback resizes menu", () => {
        shopMenu.create();
        const callback = scaler.onScaleChange.add.mock.calls[0][0];
        callback();
        expect(mockResize).toHaveBeenCalled();
    });

    test("onScaleChange callback is removed on scene shutdown", () => {
        shopMenu.create();

        expect(shopMenu.events.once.mock.calls[0][0]).toBe("shutdown");
        shopMenu.events.once.mock.calls[0][1]();

        expect(mockScalerEvent.unsubscribe).toHaveBeenCalled();
    });

    test("adds an onResume event on create", () => {
        shopMenu.create();
        expect(shopMenu.events.on).toHaveBeenCalledWith("resume", expect.any(Function));
    });

    test("onResume callback sets balance and updates titles", () => {
        shopMenu.create();
        const callback = shopMenu.events.on.mock.calls[0][1];
        callback(); //call once to create titles.
        jest.clearAllMocks();
        callback();
        expect(balance.setBalance).toHaveBeenCalledWith(shopMenu);
        expect(mockTitle.title.destroy).toHaveBeenCalled();
        expect(mockTitle.subtitle.destroy).toHaveBeenCalled();
        expect(title.createTitles).toHaveBeenCalledWith(shopMenu);
    });

    test("onResume callback is removed on scene shutdown", () => {
        shopMenu.create();
        expect(shopMenu.events.once.mock.calls[0][0]).toBe("shutdown");
        shopMenu.events.once.mock.calls[0][1]();
        expect(shopMenu.events.off).toHaveBeenCalledWith("resume", expect.any(Function));
    });
});
