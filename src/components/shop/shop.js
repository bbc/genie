/**
 * Placeholder for shop screen.
 *
 * @module components/shop
 * @copyright BBC 2020
 * @author BBC Children's D+E
 * @license Apache-2.0
 */
import { Screen } from "../../core/screen.js";
import { ScrollableList } from "../../core/layout/scrollable-list/scrollable-list.js";
import RexUIPlugin from "../../../lib/rexuiplugin.min.js";
import { getMetrics, onScaleChange } from "../../core/scaler.js";
import { createTitle } from "./shop-titles.js";
import { createBalance } from "./balance-ui.js";
import { createMenu } from "./menu.js";
import { getSafeArea, getXPos, getYPos, getScaleFactor } from "./shop-layout.js";

import { eventBus } from "../../core/event-bus.js";

export class Shop extends Screen {
    preload() {
        this.plugins.installScenePlugin("rexUI", RexUIPlugin, "rexUI", this);
    }

    create() {
        this.addBackgroundItems();
        const { buttons } = this.setLayout(["back", "pause"]);

        this.defaultBackButtonAction = this.memoizeBackButton();

        const metrics = getMetrics();
        this.title = createTitle(this, metrics); // title needs a fn to set the title text... later.
        this.balance = createBalance(this, metrics);

        const shopList = new ScrollableList(this);
        const inventoryList = new ScrollableList(this);
        const topMenu = createMenu(
            this,
            this.config.menu,
        );
        this.menus = {
            top: topMenu,
            shop: shopList,
            inventory: inventoryList,
        };
        this.menus.shop.toggleVisible();
        this.menus.inventory.toggleVisible();
        this.setupEvents();
    }

    memoizeBackButton() {
        const backButtonConfig = this.layout.buttons.back.config;
        const message = {
            channel: backButtonConfig.channel,
            name: backButtonConfig.key,
            callback: backButtonConfig.action,
        };
        return message;
    }

    setupEvents() {
        const resize = this.resize.bind(this);
        const scaleEvent = onScaleChange.add(() => resize());
        this.events.once("shutdown", scaleEvent.unsubscribe);
    }

    setVisible(menu) {
        this.menus.top.toggleVisible();
        console.log('BEEBUG: menu', menu);
    }

    resize() {
        const metrics = getMetrics();
        const safeArea = getSafeArea(this.layout);
        this.title.setScale(getScaleFactor({ metrics, container: this.title, fixedWidth: true, safeArea }));
        this.title.setPosition(0, getYPos(metrics, safeArea));
        this.balance.setScale(getScaleFactor({ metrics, container: this.balance, safeArea }));
        this.balance.setPosition(
            getXPos(this.balance, safeArea, this.config.listPadding.x),
            getYPos(metrics, safeArea),
        );
    }
}
