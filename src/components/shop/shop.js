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
import { getMetrics, onScaleChange } from "../../core/scaler.js";
import { createWallet } from "./wallet-ui.js";

export const getSafeArea = layout => layout.getSafeArea({}, false);
export const getXPos = (container, safeArea, padding) => safeArea.width / 2 - container.getBounds().width / 2 - padding;
export const getYPos = (metrics, safeArea) => {
    const { verticals, verticalBorderPad } = metrics;
    const padding = (safeArea.y - verticals.top) / 2 + verticalBorderPad / 2;
    return verticals.top + padding;
};

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
        this.wallet = createWallet(this, metrics);
        this.panel = scrollableList(this);
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
        titleContainer.setPosition(0, getYPos(metrics, getSafeArea(this.layout)));

        return titleContainer;
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

    setupEvents() {
        const resize = this.resize.bind(this);
        const scaleEvent = onScaleChange.add(() => resize());
        this.events.once("shutdown", scaleEvent.unsubscribe);
    }

    resize() {
        const metrics = getMetrics();
        const safeArea = getSafeArea(this.layout);
        this.title.setScale(this.getScaleFactor(metrics, this.title, true));
        this.title.setPosition(0, getYPos(metrics, safeArea));
        this.wallet.setScale(this.getScaleFactor(metrics, this.wallet));
        this.wallet.setPosition(getXPos(this.wallet, safeArea, this.config.listPadding.x), getYPos(metrics, safeArea));
    }
}
