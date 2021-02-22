/**
 * @module components/shop
 * @copyright BBC 2020
 * @author BBC Children's D+E
 * @license Apache-2.0
 */
import { Screen } from "../../core/screen.js";
import { ScrollableList } from "./scrollable-list/scrollable-list.js";
import RexUIPlugin from "../../../lib/rexuiplugin.min.js";
import { getMetrics, onScaleChange } from "../../core/scaler.js";
import { createConfirm } from "./confirm.js";
import { createTitle } from "./shop-titles.js";
import { createBalance } from "./balance-ui.js";
import { createMenu } from "./menu.js";
import { getSafeArea, getXPos, getYPos, getScaleFactor } from "./shop-layout.js";
import { eventBus } from "../../core/event-bus.js";
import * as a11y from "../../core/accessibility/accessibility-layer.js";
import { gmi } from "../../core/gmi/gmi.js";

const memoizeBackButton = config => (({ channel, key, action }) => ({ channel, name: key, callback: action }))(config);

export class Shop extends Screen {
    preload() {
        this.plugins.installScenePlugin("rexUI", RexUIPlugin, "rexUI", this, true);
    }

    create() {
        this.addBackgroundItems();
        const backNav = this.config.isOverlay ? "overlayBack" : "back";
        this.setLayout([backNav, "pause"]);

        this.backMessage = memoizeBackButton(this.layout.buttons[backNav].config);
        this.paneStack = [];

        this.customMessage = {
            channel: this.backMessage.channel,
            name: this.backMessage.name,
            callback: this.back.bind(this),
        };

        this.title = createTitle(this);
        this.balance = createBalance(this);

        const inventoryFilter = item => item.id !== this.config.balance.value.key;

        this.panes = {
            top: createMenu(this),
            shop: new ScrollableList(this, "shop"),
            manage: new ScrollableList(this, "manage", inventoryFilter),
        };
        this.setVisiblePane("top");

        this.setupEvents();

        this.resize();
    }

    stack(pane) {
        this.paneStack.push(pane);
        this.setVisiblePane(pane);
        this.paneStack.length === 1 && this.useCustomMessage();
        a11y.reset();
    }

    back() {
        this.panes.confirm?.container && this.panes.confirm.destroy();
        this.paneStack.pop();
        if (!this.paneStack.length) {
            this.setVisiblePane("top");
            this.useOriginalMessage(); // shop screen fires here
            return;
        }
        this.setVisiblePane(this.paneStack[this.paneStack.length - 1]);
    }

    setupEvents() {
        const resize = this.resize.bind(this);
        const scaleEvent = onScaleChange.add(resize);
        this.events.once("shutdown", scaleEvent.unsubscribe);
    }

    setVisiblePane(pane) {
        Object.keys(this.panes).forEach(key => this.panes[key] && this.panes[key].setVisible(pane === key));
        pane === "top" && this.title.setTitleText("Shop");
    }

    useCustomMessage() {
        eventBus.removeSubscription(this.backMessage);
        eventBus.subscribe(this.customMessage);
    }

    useOriginalMessage() {
        eventBus.removeSubscription(this.customMessage);
        eventBus.subscribe(this.backMessage);
    }

    resize() {
        const metrics = getMetrics();
        this.panes.top.resize();
        this.panes.shop.reset();
        if (this.panes.confirm?.container?.visible) {
            this.panes.confirm.destroy();
            this.panes.confirm = createConfirm(this, this.panes.confirm.title, this.panes.confirm.item);
        }
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

export const launchShopOverlay = (screen, shopKey) => {
    screen.scene.pause();
    gmi.sendStatsEvent("shop", "click");
    screen.addOverlay(shopKey);
};
