/**
 * Placeholder for shop screen.
 *
 * @module components/shop
 * @copyright BBC 2020
 * @author BBC Children's D+E
 * @license Apache-2.0
 */
import { Screen } from "../../core/screen.js";
import { scrollableList } from "../../core/layout/scrollable-list/scrollable-list.js";
import RexUIPlugin from "../../../lib/rexuiplugin.min.js";
import { getMetrics } from "../../core/scaler.js";

export class Shop extends Screen {
    preload() {
        this.plugins.installScenePlugin("rexUI", RexUIPlugin, "rexUI", this);
    }

    create() {
        this.addBackgroundItems();
        const buttons = ["home", "pause"];
        this.setLayout(buttons);
        const metrics = getMetrics();
        this.title = this.createTitle(metrics);
        this.wallet = this.createWallet(metrics);
        this.panel = scrollableList(this);
    }

    createTitle(metrics) {
        const { title } = this.config;

        const titleContainer = this.add.container();
        titleContainer.add(this.add.image(0, 0, title.background));
        titleContainer.add(this.add.text(0, 0, title.text, title.font).setOrigin(0.5));

        titleContainer.setPosition(0, this.getYPos(metrics, titleContainer));

        return titleContainer;
    }

    createWallet(metrics) {
        const { wallet } = this.config;

        const walletContainer = this.add.container();
        walletContainer.add(this.add.image(0, 0, wallet.background));
        walletContainer.add(this.add.image(0, 0, wallet.icon));
        walletContainer.add(this.add.text(0, 0, wallet.defaultBalance, wallet.font).setOrigin(0.5));

        walletContainer.setPosition(this.getXPos(metrics, walletContainer), this.getYPos(metrics, walletContainer));

        return walletContainer;
    }

    getYPos(metrics, container) {
        const { verticalBorderPad, verticals } = metrics;
        return verticals.top + verticalBorderPad + container.getBounds().height / 2;
    }

    getXPos(metrics, container) {
        const { safeHorizontals, buttonMin, horizontalBorderPad } = metrics;
        return safeHorizontals.right - container.getBounds().width / 2 - buttonMin - horizontalBorderPad;
    }
}
