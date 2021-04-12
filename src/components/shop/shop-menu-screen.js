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
        const shopName = this.scene.key.slice(0, this.scene.key.indexOf("-"));
        if (shopName.includes("shop")) {
            this.transientData.shopTitle = shopName;
        } else {
            this.transientData.shopTitle = "shop";
        }
        this.setStatsScreen(this.transientData.shopTitle + "menu");
        this.addBackgroundItems();
        const backNav = this._data.addedBy ? "overlayBack" : "back";
        this.setLayout([backNav, "pause"]);

        this.transientData.shop = { config: this.config.shopConfig };
        setBalance(this);

        const resize = createMenu(this);
        const scaleEvent = onScaleChange.add(resize);

        const resume = () => {
            setBalance(this);
            Object.values(this.titles).forEach(title => title.destroy());
            this.titles = createTitles(this);
        };

        this.events.on("resume", resume);
        this.events.once("shutdown", () => {
            this.events.off(Phaser.Scenes.Events.RESUME, resume);
            scaleEvent.unsubscribe();
        });

        resize();
    }
}
