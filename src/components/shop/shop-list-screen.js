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
import { setBalance } from "./balance.js";
import { initResizers } from "./backgrounds.js";

export class ShopList extends Screen {
    preload() {
        this.plugins.installScenePlugin("rexUI", RexUIPlugin, "rexUI", this, true);
        initResizers();
    }

    create() {
        this.addBackgroundItems();
        this.setLayout(["overlayBack", "pause"]);

        this.transientData[this.scene.key] = { title: this.transientData.shop.mode };
        setBalance(this);

        this.inventoryFilter = item => item.id !== this.transientData.shop.config.balance;
        this.scrollableList = new ScrollableList(this, this.transientData.shop.mode, this.inventoryFilter);

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
        this.scrollableList.reset();
    }

    onResume() {
        this.removeOverlay();
        this._data.addedBy.addOverlay(this.scene.key);
    }
}
