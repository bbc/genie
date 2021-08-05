/**
 *  ShopConfirm is a screen which prompts the player to confirm or cancel action on a selected item.
 *
 * @module components/shop
 * @copyright BBC 2020
 * @author BBC Children's D+E
 * @license Apache-2.0
 */
import RexUIPlugin from "../../../lib/rexuiplugin.min.js";
import { onScaleChange } from "../../core/scaler.js";
import { Screen } from "../../core/screen.js";
import { setBalance } from "./balance.js";
import { createConfirm } from "./confirm/confirm.js";
import { initResizers } from "./backgrounds.js";
import { gmi } from "../../core/gmi/gmi.js";

export class ShopConfirm extends Screen {
	preload() {
		this.plugins.installScenePlugin("rexUI", RexUIPlugin, "rexUI", this, true);
		initResizers();
	}

	create() {
		const screen = this.transientData.shop.mode === "shop" ? "buyconfirm" : "manageconfirm";
		gmi.setStatsScreen(this.transientData.shopTitle + screen);

		this.addBackgroundItems();
		this.setLayout(["overlayBack", "pause"]);

		const resize = createConfirm(this);
		setBalance(this);

		const scaleEvent = onScaleChange.add(resize);
		this.events.once("shutdown", scaleEvent.unsubscribe);

		resize();
	}
}
