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

export class Shop extends Screen {
    preload() {
        this.plugins.installScenePlugin("rexUI", RexUIPlugin, "rexUI", this);
    }

    create() {
        this.addBackgroundItems();
        this.setLayout(["home", "pause"]);
        const metrics = getMetrics();
        this.title = this.createTitle(metrics);
        this.wallet = this.createWallet(metrics);
        this.panel = new ScrollableList(this).panel;
        this.setupEvents();
    }

    createTitle(metrics) {
        const { title } = this.config;

        const titleBackground = this.add.image(0, 0, title.background);
        const titleText = this.add.text(0, 0, title.text, title.font).setOrigin(0.5);
        const titleContainer = this.add.container();

        const titleTextBounds = titleText.getBounds();
        const titleWidth = titleTextBounds.width + title.titlePadding;
        const titleHeight = titleTextBounds.height + title.titlePadding;
        const titleBackgroundBounds = titleBackground.getBounds();
        titleBackground.setScale(titleWidth / titleBackgroundBounds.width, titleHeight / titleBackgroundBounds.height);
        titleContainer.add([titleBackground, titleText]);

        titleContainer.setScale(this.getScaleFactor(metrics, titleContainer, true));
        titleContainer.setPosition(0, this.getYPos(metrics, titleContainer));

        return titleContainer;
    }

    createWallet(metrics) {
        const { wallet } = this.config;

        const walletBackground = this.add.image(0, 0, wallet.background);
        const walletIcon = this.add.image(0, 0, wallet.icon);
        const walletBalance = this.add.text(0, 0, wallet.defaultBalance, wallet.font).setOrigin(1, 0.5);
        const walletContainer = this.add.container();

        const walletWidth = walletBalance.getBounds().width + walletIcon.getBounds().width + wallet.iconPadding * 3;
        walletBalance.setPosition(walletWidth / 4 + wallet.iconPadding, 0);
        walletIcon.setPosition(-walletWidth / 4, 0);
        walletBackground.setScale(walletWidth / walletBackground.getBounds().width);
        walletContainer.add([walletBackground, walletIcon, walletBalance]);

        walletContainer.setScale(this.getScaleFactor(metrics, walletContainer));
        walletContainer.setPosition(this.getXPos(walletContainer), this.getYPos(metrics));

        return walletContainer;
    }

    getScaleFactor(metrics, container, fixedWidth = false) {
        const { verticals, verticalBorderPad } = metrics;
        container.setScale(1);
        const topEdge = verticals.top;
        const safeArea = this.layout.getSafeArea({}, false);
        const availableSpace = safeArea.y - topEdge - verticalBorderPad;
        const containerBounds = container.getBounds();
        const padding = this.config.title.titlePadding / 2;
        const scaleFactorY = (availableSpace - padding) / containerBounds.height;
        const scaleFactorX = safeArea.width / 4 / container.getBounds().width;
        return fixedWidth ? scaleFactorY : Math.min(scaleFactorY, scaleFactorX);
    }

    getYPos(metrics) {
        const { verticals, verticalBorderPad } = metrics;
        const safeArea = this.layout.getSafeArea({}, false);
        const padding = (safeArea.y - verticals.top) / 2 + verticalBorderPad / 2;
        return verticals.top + padding;
    }

    getXPos(container) {
        const safeArea = this.layout.getSafeArea({}, false);
        return safeArea.width / 2 - container.getBounds().width / 2 - this.config.listPadding.x;
    }

    setupEvents() {
        const resize = this.resize.bind(this);
        const scaleEvent = onScaleChange.add(() => resize());
        this.events.once("shutdown", scaleEvent.unsubscribe);
    }

    resize() {
        const metrics = getMetrics();
        this.title.setScale(this.getScaleFactor(metrics, this.title, true));
        this.title.setPosition(0, this.getYPos(metrics));
        this.wallet.setScale(this.getScaleFactor(metrics, this.wallet));
        this.wallet.setPosition(this.getXPos(this.wallet), this.getYPos(metrics));
    }
}
