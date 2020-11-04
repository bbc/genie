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
        this.setLayout(["back", "pause"]);

        this.backMessage = this.memoizeBackButton();

        this.customMessage = {
            channel: this.backMessage.channel,
            name: this.backMessage.name,
            callback: () => this.setVisible("top"),
        };

        const metrics = getMetrics();
        this.title = createTitle(this, metrics);
        this.balance = createBalance(this, metrics);

        this.menus = {
            top: createMenu(this, this.config.menu),
            shop: new ScrollableList(this),
            inventory: new ScrollableList(this),
        };
        this.menus.top.setVisible(true);
        this.menus.shop.setVisible(false);
        this.menus.inventory.setVisible(false);

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
        if (menu === "top") {
            this.menus.top.setVisible(true);
            this.menus.shop.setVisible(false);
            this.menus.inventory.setVisible(false);
            eventBus.removeSubscription(this.customMessage);
            eventBus.subscribe(this.backMessage);
            return;
        }

        eventBus.removeSubscription(this.backMessage);
        this.menus.top.setVisible(false);
        menu === "shop" && this.menus.shop.setVisible(true);
        menu === "manage" && this.menus.inventory.setVisible(true);
        eventBus.subscribe(this.customMessage);
    }

    resize() {
        const metrics = getMetrics();
        const safeArea = getSafeArea(this.layout);
        this.menus.top.resize(safeArea);
        this.title.setScale(getScaleFactor({ metrics, container: this.title, fixedWidth: true, safeArea }));
        this.title.setPosition(0, getYPos(metrics, safeArea));
        this.balance.setScale(getScaleFactor({ metrics, container: this.balance, safeArea }));
        this.balance.setPosition(
            getXPos(this.balance, safeArea, this.config.listPadding.x),
            getYPos(metrics, safeArea),
        );
    }
}
