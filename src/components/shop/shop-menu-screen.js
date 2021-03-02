/**
 * @module components/shop
 * @copyright BBC 2020
 * @author BBC Children's D+E
 * @license Apache-2.0
 */
import { Screen } from "../../core/screen.js";
import RexUIPlugin from "../../../lib/rexuiplugin.min.js";
import { onScaleChange } from "../../core/scaler.js";
import { createTitles } from "../../core/titles.js";
import { createBalance } from "./balance-ui.js";
import { createMenu } from "./menu.js";

export class ShopMenu extends Screen {
    preload() {
        this.plugins.installScenePlugin("rexUI", RexUIPlugin, "rexUI", this, true);
    }

    create() {
        this.addBackgroundItems();
        const backNav = this._data.addedBy ? "overlayBack" : "back";
        this.setLayout([backNav, "pause"]);

        this.transientData.shop = { config: this.config.shopConfig };
        this.titles = createTitles(this);
        this.balance = createBalance(this);
        this.menu = createMenu(this);

        this.setupEvents();
        this.resize();
    }

    setupEvents() {
        const scaleEvent = onScaleChange.add(() => this.resize());
        this.events.once("shutdown", scaleEvent.unsubscribe);
        const onResume = this.onResume.bind(this);
        this.events.on("resume", onResume);
        this.events.once("shutdown", () => this.events.off(Phaser.Scenes.Events.RESUME, onResume));
    }

    onResume() {
        this.balance.update();
    }

    resize() {
        this.menu.resize();
        this.balance.resize();
    }
}