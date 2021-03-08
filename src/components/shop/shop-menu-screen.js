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
import { collections } from "../../core/collections.js";

export class ShopMenu extends Screen {
    preload() {
        this.plugins.installScenePlugin("rexUI", RexUIPlugin, "rexUI", this, true);
    }

    create() {
        this.addBackgroundItems();
        const backNav = this._data.addedBy ? "overlayBack" : "back";
        this.setLayout([backNav, "pause"]);

        this.transientData[this.scene.key] = {
            balance: collections.get(this.config.shopConfig.shopCollections.manage).get(this.config.shopConfig.balance)
                .qty,
        };
        this.transientData.shop = {
            config: this.config.shopConfig,
        };
        this.titles = createTitles(this);
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
        this.removeOverlay();
        this._data.addedBy.addOverlay(this.scene.key);
    }

    resize() {
        this.menu.resize();
        this.titles.title.resize();
        this.titles.subtitle.resize();
    }
}
