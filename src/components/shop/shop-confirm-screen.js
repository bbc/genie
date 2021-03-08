/**
 * @module components/shop
 * @copyright BBC 2020
 * @author BBC Children's D+E
 * @license Apache-2.0
 */
import RexUIPlugin from "../../../lib/rexuiplugin.min.js";
import { onScaleChange } from "../../core/scaler.js";
import { Screen } from "../../core/screen.js";
import { createTitles } from "../../core/titles.js";
import { createConfirm } from "./confirm.js";
import { collections } from "../../core/collections.js";

export class ShopConfirm extends Screen {
    preload() {
        this.plugins.installScenePlugin("rexUI", RexUIPlugin, "rexUI", this, true);
    }

    create() {
        this.addBackgroundItems();
        this.setLayout(["overlayBack", "pause"]);

        this.confirm = createConfirm(this, this.transientData.shop.mode, this.transientData.shop.item);
        const shopConfig = this.transientData.shop.config;
        this.transientData[this.scene.key] = {
            action: this.confirm.action,
            balance: collections.get(shopConfig.shopCollections.manage).get(shopConfig.balance).qty,
        };
        this.titles = createTitles(this);

        this.setupEvents();
        this.resize();
    }

    setupEvents() {
        const resize = this.resize.bind(this);
        const scaleEvent = onScaleChange.add(resize);
        this.events.once("shutdown", scaleEvent.unsubscribe);
    }

    resize() {
        this.titles.title.resize();
        this.titles.subtitle.resize();
    }
}
