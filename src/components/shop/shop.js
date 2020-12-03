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

const memoizeBackButton = config => (({ channel, key, action }) => ({ channel, name: key, callback: action }))(config);

export class Shop extends Screen {
    preload() {
        this.plugins.installScenePlugin("rexUI", RexUIPlugin, "rexUI", this);
    }

    create() {
        this.addBackgroundItems();
        this.setLayout(["back", "pause"]);

        this.backMessage = memoizeBackButton(this.layout.buttons.back.config);
        this.paneStack = [];

        this.customMessage = {
            channel: this.backMessage.channel,
            name: this.backMessage.name,
            callback: this.back.bind(this),
        };

        this.title = createTitle(this);
        this.balance = createBalance(this);

        const confirm = createConfirm(this);
        const callback = confirm.prepTransaction;

        const inventoryFilter = item => item.id !== this.config.balance.value.key;

        this.panes = {
            top: createMenu(this),
            shop: new ScrollableList(this, "shop", callback),
            manage: new ScrollableList(this, "manage", callback, inventoryFilter),
            confirm,
        };
        this.setVisiblePane("top");

        this.setupEvents();

        this.resize();
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

    setupEvents() {
        const resize = this.resize.bind(this);
        const scaleEvent = onScaleChange.add(() => resize());
        this.events.once("shutdown", scaleEvent.unsubscribe);
    }

    setVisiblePane(pane) {
        Object.keys(this.panes).forEach(key => this.panes[key].setVisible(pane === key));
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
        this.panes.confirm.resize(safeArea);
        this.title.setScale(getScaleFactor({ metrics, container: this.title, fixedWidth: true, safeArea }));
        this.title.setPosition(0, getYPos(metrics, safeArea));
        this.balance.setScale(getScaleFactor({ metrics, container: this.balance, safeArea }));
        this.balance.setPosition(
            getXPos(this.balance, safeArea, this.config.listPadding.x),
            getYPos(metrics, safeArea),
        );
    }
}
