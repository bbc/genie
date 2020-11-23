/**
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
import { createConfirm } from "./confirm.js";

export class Shop extends Screen {
    preload() {
        this.plugins.installScenePlugin("rexUI", RexUIPlugin, "rexUI", this);
    }

    create() {
        this.addBackgroundItems();
        this.setLayout(["back", "pause"]);

        this.backMessage = this.memoizeBackButton();
        this.paneStack = [];

        this.customMessage = {
            channel: this.backMessage.channel,
            name: this.backMessage.name,
            callback: () => this.back(),
        };

        const metrics = getMetrics();
        const safeArea = getSafeArea(this.layout);

        this.title = createTitle(this, metrics, safeArea);
        this.balance = createBalance(this, metrics, safeArea);

        const confirm = createConfirm(this, this.config, safeArea);

        this.panes = {
            top: createMenu(this, this.config.menu, safeArea),
            shop: new ScrollableList(this, "shop", confirm.prepTransaction),
            manage: new ScrollableList(this, "manage", confirm.prepTransaction),
            confirm,
        };
        this.setVisiblePane("top");

        this.setupEvents();
    }

    stack(pane) {
        this.paneStack.push(pane);
        this.setVisiblePane(pane);
        this.paneStack.length === 1 && this.useCustomMessage();
    }

    back() {
        this.paneStack.pop();
        if (!this.paneStack.length) {
            this.setVisiblePane("top");
            this.useOriginalMessage();
            return;
        }
        this.setVisiblePane(this.paneStack[this.paneStack.length - 1]);
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

    setVisiblePane(pane) {
        Object.keys(this.panes).forEach(key =>
            pane === key ? this.panes[key].setVisible(true) : this.panes[key].setVisible(false),
        );
        this.title.setTitleText(pane === "top" ? "Shop" : pane);
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
