/**
 * @copyright BBC 2020
 * @author BBC Children's D+E
 * @license Apache-2.0
 */

import { gmi } from "../../core/gmi/gmi.js";
import { ShopMenu } from "./shop-menu-screen.js";
import { ShopList } from "./shop-list-screen.js";
import { ShopConfirm } from "./shop-confirm-screen.js";

export const Shop = ({ key, back }) => ({
    [`${key}-menu`]: {
        scene: ShopMenu,
        routes: {
            back,
        },
    },
    [`${key}-list`]: {
        scene: ShopList,
    },
    [`${key}-confirm`]: {
        scene: ShopConfirm,
    },
});

export const launchShopOverlay = (screen, shopKey) => {
    screen.scene.pause();
    gmi.sendStatsEvent("shop", "click");
    screen.addOverlay(`${shopKey}-menu`);
};
