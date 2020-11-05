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

        this.panes = {
            top: createMenu(this, this.config.menu),
            shop: new ScrollableList(this),
            manage: new ScrollableList(this),
        };
        this.panes.top.setVisible(true);
        this.panes.shop.setVisible(false);
        this.panes.manage.setVisible(false);

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

    setVisible(visiblePane) {
        eventBus.removeSubscription(visiblePane === "top" ? this.customMessage : this.backMessage);
        eventBus.subscribe(visiblePane === "top" ? this.backMessage : this.customMessage);
        Object.keys(this.panes).forEach(key =>
            visiblePane === key ? this.panes[key].setVisible(true) : this.panes[key].setVisible(false),
        );
    }

    resize() {
        const metrics = getMetrics();
        const safeArea = getSafeArea(this.layout);
        this.panes.top.resize(safeArea);
        this.title.setScale(getScaleFactor({ metrics, container: this.title, fixedWidth: true, safeArea }));
        this.title.setPosition(0, getYPos(metrics, safeArea));
        this.balance.setScale(getScaleFactor({ metrics, container: this.balance, safeArea }));
        this.balance.setPosition(
            getXPos(this.balance, safeArea, this.config.listPadding.x),
            getYPos(metrics, safeArea),
        );
    }
}
