/**
 * @module components/shop
 * @copyright BBC 2020
 * @author BBC Children's D+E
 * @license Apache-2.0
 */
import { Shop, launchShopOverlay } from "../../../src/components/shop/shop.js";
import { ShopMenu } from "../../../src/components/shop/shop-menu-screen.js";
import { ShopList } from "../../../src/components/shop/shop-list-screen.js";
import { ShopConfirm } from "../../../src/components/shop/shop-confirm-screen.js";
import { gmi } from "../../../src/core/gmi/gmi.js";

jest.mock("../../../src/components/shop/scrollable-list/scrollable-list.js");
jest.mock("../../../src/components/shop/shop-menu-screen.js");
jest.mock("../../../src/components/shop/shop-list-screen.js");
jest.mock("../../../src/components/shop/shop-confirm-screen.js");

describe("Shop scene config", () => {
	test("returns the correct config object", () => {
		const expectedConfig = {
			"shop-menu": {
				scene: ShopMenu,
				routes: { test: "this" },
				title: "yes",
			},
			"shop-list": {
				scene: ShopList,
				routes: {},
				hidden: true,
			},
			"shop-confirm": {
				scene: ShopConfirm,
				routes: {},
				hidden: true,
			},
		};
		expect(Shop({ key: "shop", routes: { test: "this" }, title: "yes" })).toEqual(expectedConfig);
	});
});

describe("launchShopOverlay()", () => {
	const mockScene = { scene: { pause: jest.fn() }, addOverlay: jest.fn() };
	gmi.sendStatsEvent = jest.fn();

	beforeEach(() => launchShopOverlay(mockScene, "shopNavKey"));

	test("pauses the scene it's called on", () => {
		expect(mockScene.scene.pause).toHaveBeenCalled();
	});

	test("sends a stats event via gmi", () => {
		expect(gmi.sendStatsEvent).toHaveBeenCalledWith("shop", "click");
	});

	test("adds an overlay", () => {
		expect(mockScene.addOverlay).toHaveBeenCalledWith("shopNavKey-menu");
	});
});
