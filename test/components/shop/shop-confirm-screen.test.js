/**
 * @module components/shop
 * @copyright BBC 2020
 * @author BBC Children's D+E
 * @license Apache-2.0
 */
import RexUIPlugin from "../../../lib/rexuiplugin.min.js";
import * as scaler from "../../../src/core/scaler.js";
import * as balance from "../../../src/components/shop/balance.js";
import * as confirm from "../../../src/components/shop/confirm.js";
import { ShopConfirm } from "../../../src/components/shop/shop-confirm-screen.js";

jest.mock("../../../src/components/shop/balance.js");
jest.mock("../../../src/components/shop/confirm.js");
jest.mock("../../../lib/rexuiplugin.min.js");
jest.mock("../../../src/core/scaler.js");

describe("Shop Confirm Screen", () => {
    let shopConfirm;
    let mockConfirm;
    let mockScalerEvent;
    let mockShopConfig;
    beforeEach(() => {
        mockConfirm = { mock: "confirm", resize: jest.fn() };
        confirm.createConfirm = jest.fn().mockReturnValue(mockConfirm);
        mockScalerEvent = { unsubscribe: jest.fn() };
        scaler.onScaleChange = { add: jest.fn().mockReturnValue(mockScalerEvent) };
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

    test("creates confirm and adds reference to screen on create", () => {
        shopConfirm.create();
        expect(confirm.createConfirm).toHaveBeenCalledWith(
            shopConfirm,
            shopConfirm.transientData.shop.mode,
            shopConfirm.transientData.shop.item,
        );
        expect(shopConfirm.confirm).toBe(mockConfirm);
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
