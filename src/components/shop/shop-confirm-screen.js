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
import { createBalance } from "./balance-ui.js";
import { createConfirm } from "./confirm.js";

export class ShopConfirm extends Screen {
    preload() {
        this.plugins.installScenePlugin("rexUI", RexUIPlugin, "rexUI", this, true);
    }

    create() {
        this.addBackgroundItems();
        this.setLayout(["back", "pause"]);

        this.titles = createTitles(this);
        this.balance = createBalance(this);

        this.confirm = createConfirm(this, this.transientData.shop.title, this.transientData.shop.item);

        this.setupEvents();
        this.resize();
    }

    setupEvents() {
        const resize = this.resize.bind(this);
        const scaleEvent = onScaleChange.add(resize);
        this.events.once("shutdown", scaleEvent.unsubscribe);
    }

    resize() {
        this.balance.resize();
    }
}
