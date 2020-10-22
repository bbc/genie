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
import { createTitles } from "./../select/titles.js";

export const getSafeArea = layout => layout.getSafeArea({}, false);

export const getXPos = (container, safeArea, padding) => safeArea.width / 2 - container.getBounds().width / 2 - padding;

export const getYPos = (metrics, safeArea) => {
    const { verticals, verticalBorderPad } = metrics;
    const padding = (safeArea.y - verticals.top) / 2 + verticalBorderPad / 2;
    return verticals.top + padding;
};

export const getScaleFactor = args => {
    container.setScale(1);
    const { metrics, container, fixedWidth, safeArea } = args;
    const { verticals, verticalBorderPad } = metrics;
    const availableSpace = safeArea.y - verticals.top - verticalBorderPad;
    const containerBounds = container.getBounds();
    const padding = verticalBorderPad / 2;
    const scaleFactorY = (availableSpace - padding) / containerBounds.height;
    const scaleFactorX = safeArea.width / 4 / containerBounds.width;
    return fixedWidth ? scaleFactorY : Math.min(scaleFactorY, scaleFactorX);
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

    setupEvents() {
        const resize = this.resize.bind(this);
        const scaleEvent = onScaleChange.add(() => resize());
        this.events.once("shutdown", scaleEvent.unsubscribe);
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
