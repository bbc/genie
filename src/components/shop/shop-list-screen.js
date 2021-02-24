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
import { createBalance } from "./balance-ui.js";

export class ShopList extends Screen {
    preload() {
        this.plugins.installScenePlugin("rexUI", RexUIPlugin, "rexUI", this, true);
    }

    create() {
        this.addBackgroundItems();
        this.setLayout(["back", "pause"]);

        this.titles = createTitles(this);
        this.balance = createBalance(this);
        const inventoryFilter = item => item.id !== this.config.balance.value.key;
        this.list = new ScrollableList(this, this.transientData["shop-menu"].list, inventoryFilter);

        this.setupEvents();
        this.resize();
    }

    setupEvents() {
        const resize = this.resize.bind(this);
        const scaleEvent = onScaleChange.add(resize);
        this.events.once("shutdown", scaleEvent.unsubscribe);
    }

    resize() {
        this.list.reset();
        this.balance.resize();
    }
}
