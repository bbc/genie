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
import { createMenu } from "./menu.js";
import { setBalance } from "./balance.js";
import { initResizers } from "./backgrounds.js";

export class ShopMenu extends Screen {
    preload() {
        this.plugins.installScenePlugin("rexUI", RexUIPlugin, "rexUI", this, true);
        initResizers();
    }

    create() {
        this.addBackgroundItems();
        const backNav = this._data.addedBy ? "overlayBack" : "back";
        this.setLayout([backNav, "pause"]);

        this.transientData.shop = { config: this.config.shopConfig };
        setBalance(this);

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
        setBalance(this);
        Object.values(this.titles).forEach(title => title.destroy());
        this.titles = createTitles(this);
        Object.values(this.titles).forEach(title => title.resize());
    }

    resize() {
        this.menu.resize();
    }
}
