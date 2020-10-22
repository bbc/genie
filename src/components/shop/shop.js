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
import { createWallet } from "./wallet-ui.js";
import { createTitles } from "./../select/titles.js";
import { getSafeArea, getXPos, getYPos, getScaleFactor } from "./shop-scaling.js";

export class Shop extends Screen {
    preload() {
        this.plugins.installScenePlugin("rexUI", RexUIPlugin, "rexUI", this);
    }

    create() {
        this.addBackgroundItems();
        this.setLayout(["home", "pause"]);
        const metrics = getMetrics();
        this.title = this.createTitle(metrics);
        this.wallet = createWallet(this, metrics);
        this.panel = new ScrollableList(this).panel;
        this.setupEvents();
    }

    createTitle(metrics) {
        const titleContainer = this.add.container();
        titleContainer.add(createTitles(this));

        titleContainer.setScale(
            getScaleFactor({
                metrics,
                container: titleContainer,
                fixedWidth: true,
                safeArea: getSafeArea(this.layout),
            }),
        );
        titleContainer.setPosition(0, getYPos(metrics, getSafeArea(this.layout)));

        return titleContainer;
    }

    resize() {
        const metrics = getMetrics();
        const safeArea = getSafeArea(this.layout);
        this.title.setScale(getScaleFactor({ metrics, container: this.title, fixedWidth: true, safeArea }));
        this.title.setPosition(0, getYPos(metrics, safeArea));
        this.wallet.setScale(getScaleFactor({ metrics, container: this.wallet, safeArea }));
        this.wallet.setPosition(getXPos(this.wallet, safeArea, this.config.listPadding.x), getYPos(metrics, safeArea));
    }
}
