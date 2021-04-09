/**
 * @module components/shop
 * @copyright BBC 2020
 * @author BBC Children's D+E
 * @license Apache-2.0
 */
import RexUIPlugin from "../../../lib/rexuiplugin.min.js";
import * as scaler from "../../../src/core/scaler.js";
import * as balance from "../../../src/components/shop/balance.js";
import * as list from "../../../src/components/shop/scrollable-list/scrollable-list.js";
import * as gmi from "../../../src/core/gmi/gmi.js";
import { ShopList } from "../../../src/components/shop/shop-list-screen.js";
import { initResizers } from "../../../src/components/shop/backgrounds.js";

jest.mock("../../../src/components/shop/balance.js");
jest.mock("../../../src/components/shop/scrollable-list/scrollable-list.js");
jest.mock("../../../lib/rexuiplugin.min.js");
jest.mock("../../../src/core/scaler.js");
jest.mock("../../../src/core/gmi/gmi.js");

describe("Shop List Screen", () => {
    let shopList;
    let mockList;
    let mockScalerEvent;
    let mockShopConfig;
    beforeEach(() => {
        gmi.gmi = { setStatsScreen: jest.fn(), sendStatsEvent: jest.fn() };
        mockList = { reset: jest.fn() };
        list.ScrollableList = jest.fn(() => mockList);
        mockScalerEvent = { unsubscribe: jest.fn() };
        scaler.onScaleChange = { add: jest.fn(() => mockScalerEvent) };
        mockShopConfig = { mock: "config", title: { text: "shop" } };
        ShopList.prototype.plugins = {
            installScenePlugin: jest.fn(),
        };
        ShopList.prototype.events = {
            once: jest.fn(),
            on: jest.fn(),
            off: jest.fn(),
        };
        shopList = new ShopList();
        shopList.addBackgroundItems = jest.fn();
        shopList.removeOverlay = jest.fn();
        shopList.setLayout = jest.fn();
        shopList.scene = { key: "shop-list" };
        shopList.plugins = { installScenePlugin: jest.fn() };
        shopList._data = {
            addedBy: { addOverlay: jest.fn() },
            transient: { shop: { mode: "shop", config: { balance: "balance" } } },
            config: { "shop-menu": { shopConfig: mockShopConfig } },
        };

        global.RexPlugins = {
            GameObjects: {
                NinePatch: jest.fn(),
            },
        };
        initResizers();
    });
    afterEach(() => jest.clearAllMocks());

    test("installs rexUI plugin on preload", () => {
        shopList.preload();
        expect(shopList.plugins.installScenePlugin).toHaveBeenCalledWith("rexUI", RexUIPlugin, "rexUI", shopList, true);
    });

    test("calls addBackgroundItems on create", () => {
        shopList.create();
        expect(shopList.addBackgroundItems).toHaveBeenCalled();
    });

    test("calls setLayout on create", () => {
        shopList.create();
        expect(shopList.setLayout).toHaveBeenCalledWith(["overlayBack", "pause"]);
    });

    test("makes shop title available as transientData", () => {
        shopList.create();
        expect(shopList.transientData["shop-list"]).toEqual({ title: "shop" });
    });

    test("makes shop title available as transientData in other modes", () => {
        shopList._data = {
            addedBy: { addOverlay: jest.fn() },
            transient: { shop: { mode: "manage", config: { balance: "balance" } } },
            config: { "shop-menu": { shopConfig: mockShopConfig } },
        };

        shopList.create();
        expect(shopList.transientData["shop-list"]).toEqual({ title: "manage" });
    });

    test("calls setBalance", () => {
        shopList.create();
        expect(balance.setBalance).toHaveBeenCalledWith(shopList);
    });

    test("attaches an inventory filter function that returns true when item id is not the balance key", () => {
        shopList.create();
        expect(shopList.inventoryFilter({ id: "helmet" })).toBe(true);
    });

    test("attaches an inventory filter function that returns false when item id is the balance key", () => {
        shopList.create();
        expect(shopList.inventoryFilter({ id: shopList._data.transient.shop.config.balance })).toBe(false);
    });

    test("creates list and adds reference to screen on create", () => {
        shopList.create();

        expect(list.ScrollableList).toHaveBeenCalledWith(
            shopList,
            shopList._data.transient.shop.mode,
            shopList.inventoryFilter,
        );
        expect(shopList.scrollableList).toBe(mockList);
    });

    test("adds a onScaleChange event on create", () => {
        shopList.create();
        expect(scaler.onScaleChange.add).toHaveBeenCalledWith(expect.any(Function));
    });

    test("onScaleChange callback resets/resizes list", () => {
        shopList.create();
        const callback = scaler.onScaleChange.add.mock.calls[0][0];
        callback();
        expect(mockList.reset).toHaveBeenCalled();
    });

    test("onScaleChange callback is removed on scene shutdown", () => {
        shopList.create();
        expect(shopList.events.once).toHaveBeenCalledWith("shutdown", mockScalerEvent.unsubscribe);
    });

    test("adds an onResume event on create", () => {
        shopList.create();
        expect(shopList.events.on).toHaveBeenCalledWith("resume", expect.any(Function));
    });

    test("onResume callback restarts this overlay", () => {
        shopList.create();
        const callback = shopList.events.on.mock.calls[0][1];
        callback();
        expect(shopList.removeOverlay).toHaveBeenCalled();
        expect(shopList._data.addedBy.addOverlay).toHaveBeenCalledWith(shopList.scene.key);
    });

    test("onResume callback is removed on scene shutdown", () => {
        shopList.create();
        const resumeCallback = shopList.events.on.mock.calls[0][1];
        const shutdownCallback = shopList.events.once.mock.calls[1][1];
        expect(shopList.events.once).toHaveBeenCalledWith("shutdown", expect.any(Function));
        shutdownCallback();
        expect(shopList.events.off).toHaveBeenCalledWith("resume", resumeCallback);
    });
});
