/**
 * @module components/shop
 * @copyright BBC 2020
 * @author BBC Children's D+E
 * @license Apache-2.0
 */
import RexUIPlugin from "../../../lib/rexuiplugin.min.js";
import { onScaleChange } from "../../core/scaler.js";
import { Screen } from "../../core/screen.js";
import { setBalance } from "./balance.js";
import { createConfirm } from "./confirm.js";
import { initResizers } from "./backgrounds.js";

export class ShopConfirm extends Screen {
    preload() {
        this.plugins.installScenePlugin("rexUI", RexUIPlugin, "rexUI", this, true);
        initResizers();
    }

    create() {
        this.addBackgroundItems();
        this.setLayout(["overlayBack", "pause"]);

        this.confirm = createConfirm(this, this.transientData.shop.mode, this.transientData.shop.item);

        this.transientData[this.scene.key] = { action: this.confirm.action };
        setBalance(this);

        this.setupEvents();
        this.resize();
    }

    setupEvents() {
        const resize = this.resize.bind(this);
        const scaleEvent = onScaleChange.add(resize);
        this.events.once("shutdown", scaleEvent.unsubscribe);
    }

    resize() {
        this.confirm.resize();
    }
}
