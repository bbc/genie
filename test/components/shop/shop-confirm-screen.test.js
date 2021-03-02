/**
 * @module components/shop
 * @copyright BBC 2020
 * @author BBC Children's D+E
 * @license Apache-2.0
 */
import RexUIPlugin from "../../../lib/rexuiplugin.min.js";
import * as scaler from "../../../src/core/scaler.js";
import * as title from "../../../src/core/titles.js";
import * as balance from "../../../src/components/shop/balance-ui.js";
import * as confirm from "../../../src/components/shop/confirm.js";
import { ShopConfirm } from "../../../src/components/shop/shop-confirm-screen.js";

jest.mock("../../../src/core/titles.js");
jest.mock("../../../src/components/shop/balance-ui.js");
jest.mock("../../../src/components/shop/confirm.js");
jest.mock("../../../lib/rexuiplugin.min.js");
jest.mock("../../../src/core/scaler.js");

describe("Shop Confirm Screen", () => {
    let shopConfirm;
    let mockTitle;
    let mockBalance;
    let mockConfirm;
    let mockScalerEvent;
    let mockShopConfig;
    beforeEach(() => {
        mockTitle = { mock: "title" };
        title.createTitles = jest.fn().mockReturnValue(mockTitle);
        mockBalance = { resize: jest.fn(), update: jest.fn() };
        balance.createBalance = jest.fn().mockReturnValue(mockBalance);
        mockConfirm = { mock: "confirm" };
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

    test("creates titles and adds reference to screen on create", () => {
        shopConfirm.create();
        expect(title.createTitles).toHaveBeenCalledWith(shopConfirm);
        expect(shopConfirm.titles).toBe(mockTitle);
    });

    test("creates balance and adds reference to screen on create", () => {
        shopConfirm.create();
        expect(balance.createBalance).toHaveBeenCalledWith(shopConfirm);
        expect(shopConfirm.balance).toBe(mockBalance);
    });

    test("creates confirm and adds reference to screen on create", () => {
        shopConfirm.create();
        expect(confirm.createConfirm).toHaveBeenCalledWith(
            shopConfirm,
            shopConfirm.transientData.shop.title,
            shopConfirm.transientData.shop.item,
        );
        expect(shopConfirm.confirm).toBe(mockConfirm);
    });

    test("adds a onScaleChange event on create", () => {
        shopConfirm.create();
        expect(scaler.onScaleChange.add).toHaveBeenCalledWith(expect.any(Function));
    });

    test("onScaleChange callback resizes balance ", () => {
        shopConfirm.create();
        const callback = scaler.onScaleChange.add.mock.calls[0][0];
        callback();
        expect(mockBalance.resize).toHaveBeenCalled();
    });

    test("onScaleChange callback is removed on scene shutdown", () => {
        shopConfirm.create();
        expect(shopConfirm.events.once).toHaveBeenCalledWith("shutdown", mockScalerEvent.unsubscribe);
    });
});
