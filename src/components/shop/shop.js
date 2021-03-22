/**
 *  * Shop is a series of screens which provide item listing, purchasing and inventory management.
 *
 * @copyright BBC 2020
 * @author BBC Children's D+E
 * @license Apache-2.0
 */
import { gmi } from "../../core/gmi/gmi.js";
import { ShopMenu } from "./shop-menu-screen.js";
import { ShopList } from "./shop-list-screen.js";
import { ShopConfirm } from "./shop-confirm-screen.js";

export const Shop = ({ key, routes, title }) => ({
    [`${key}-menu`]: {
        scene: ShopMenu,
        routes,
        title,
    },
    [`${key}-list`]: {
        scene: ShopList,
        routes: {},
        hidden: true,
    },
    [`${key}-confirm`]: {
        scene: ShopConfirm,
        routes: {},
        hidden: true,
    },
});

export const launchShopOverlay = (screen, shopKey) => {
    screen.scene.pause();
    gmi.sendStatsEvent("shop", "click");
    screen.addOverlay(`${shopKey}-menu`);
};
