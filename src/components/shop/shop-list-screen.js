/**
 * @module components/shop
 * @copyright BBC 2020
 * @author BBC Children's D+E
 * @license Apache-2.0
 */
import { Screen } from "../../core/screen.js";
import { ScrollableList } from "./scrollable-list/scrollable-list.js";
import RexUIPlugin from "../../../lib/rexuiplugin.min.js";
import { onScaleChange } from "../../core/scaler.js";
import { createTitles } from "../../core/titles.js";
import { gmi } from "../../core/gmi/gmi.js";
import { setBalance } from "./balance.js";

export class ShopList extends Screen {
    preload() {
        this.plugins.installScenePlugin("rexUI", RexUIPlugin, "rexUI", this, true);
    }

    create() {
        gmi.setStatsScreen(this.transientData.shop.mode === "shop" ? "shopbuy" : "shopmanage");
        this.addBackgroundItems();
        this.setLayout(["overlayBack", "pause"]);
        const shopConfig = this.transientData.shop.config;

        this.transientData[this.scene.key] = {
            title: this.transientData.shop.mode,
        };
        setBalance(this);

        this.titles = createTitles(this);
        this.inventoryFilter = item => item.id !== shopConfig.balance;
        this.list = new ScrollableList(this, this.transientData.shop.mode, this.inventoryFilter);

        this.setupEvents();
        this.resize();
    }

    setupEvents() {
        const resize = this.resize.bind(this);
        const scaleEvent = onScaleChange.add(resize);
        this.events.once("shutdown", scaleEvent.unsubscribe);
        const onResume = this.onResume.bind(this);
        this.events.on("resume", onResume);
        this.events.once("shutdown", () => this.events.off("resume", onResume));
    }

    resize() {
        this.list.reset();
        this.titles.title.resize();
        this.titles.subtitle.resize();
    }

    onResume() {
        this.removeOverlay();
        this._data.addedBy.addOverlay(this.scene.key);
    }
}
