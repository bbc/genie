/**
 * @module components/shop
 * @copyright BBC 2020
 * @author BBC Children's D+E
 * @license Apache-2.0
 */
import RexUIPlugin from "../../../lib/rexuiplugin.min.js";
import * as scaler from "../../../src/core/scaler.js";
import * as balance from "../../../src/components/shop/balance.js";
import * as confirmModule from "../../../src/components/shop/confirm/confirm.js";
import * as gmi from "../../../src/core/gmi/gmi.js";
import { ShopConfirm } from "../../../src/components/shop/shop-confirm-screen.js";
import { initResizers } from "../../../src/components/shop/backgrounds.js";

jest.mock("../../../src/components/shop/balance.js");
jest.mock("../../../src/components/shop/confirm/confirm.js");
jest.mock("../../../lib/rexuiplugin.min.js");
jest.mock("../../../src/core/scaler.js");
jest.mock("../../../src/core/gmi/gmi.js");

describe("Shop Confirm Screen", () => {
    let shopConfirm;
    let mockConfirm;
    let mockScalerEvent;
    let mockShopConfig;
    beforeEach(() => {
        gmi.gmi = { setStatsScreen: jest.fn(), sendStatsEvent: jest.fn() };
        mockConfirm = jest.fn();
        confirmModule.createConfirm = jest.fn(() => mockConfirm);
        mockScalerEvent = { unsubscribe: jest.fn() };
        scaler.onScaleChange = { add: jest.fn(() => mockScalerEvent) };
        mockShopConfig = { mock: "config" };
        ShopConfirm.prototype.plugins = {
            installScenePlugin: jest.fn(),
        };
        ShopConfirm.prototype.events = {
            once: jest.fn(),
            on: jest.fn(),
            off: jest.fn(),
        };
        shopConfirm = new ShopConfirm();
        shopConfirm.addBackgroundItems = jest.fn();
        shopConfirm.setLayout = jest.fn();
        shopConfirm.scene = { key: "shop-confirm" };
        shopConfirm.plugins = { installScenePlugin: jest.fn() };
        shopConfirm._data = {
            addedBy: undefined,
            transient: { shop: { title: "shop", item: "item" } },
            config: { "shop-confirm": { shopConfig: mockShopConfig } },
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
        shopConfirm.preload();
        expect(shopConfirm.plugins.installScenePlugin).toHaveBeenCalledWith(
            "rexUI",
            RexUIPlugin,
            "rexUI",
            shopConfirm,
            true,
        );
    });

    test("calls addBackgroundItems on create", () => {
        shopConfirm.create();
        expect(shopConfirm.addBackgroundItems).toHaveBeenCalled();
    });

    test("calls setLayout on create", () => {
        shopConfirm.create();
        expect(shopConfirm.setLayout).toHaveBeenCalledWith(["overlayBack", "pause"]);
    });

    test("calls setBalance", () => {
        shopConfirm.create();
        expect(balance.setBalance).toHaveBeenCalledWith(shopConfirm);
    });

    test("creates confirm", () => {
        shopConfirm.create();
        expect(confirmModule.createConfirm).toHaveBeenCalledWith(shopConfirm);
    });

    test("adds a onScaleChange event on create", () => {
        shopConfirm.create();
        expect(scaler.onScaleChange.add).toHaveBeenCalledWith(expect.any(Function));
    });

    test("onScaleChange callback is removed on scene shutdown", () => {
        shopConfirm.create();
        expect(shopConfirm.events.once).toHaveBeenCalledWith("shutdown", mockScalerEvent.unsubscribe);
    });
});
