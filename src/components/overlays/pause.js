/**
 * Pause is an overlay screen created every time the pause button is pressed.
 *
 * @module components/overlays/pause
 * @copyright BBC 2019
 * @author BBC Children's D+E
 * @license Apache-2.0
 */
import { Screen } from "../../core/screen.js";
import { gmi } from "../../core/gmi/gmi.js";

export class Pause extends Screen {
	preload() {
		this.sound.pauseAll();
		this.events.once("shutdown", this.sound.resumeAll.bind(this.sound));
	}

	create() {
		this.addBackgroundItems();
		const parentKey = this._data.addedBy.scene.key;
		const isAboveSelectScreen = parentKey.includes("select");
		const achievements = gmi.achievements.get().length ? ["achievements"] : [];
		const pauseReplay = this.context.navigation[parentKey].routes.restart ? ["pauseReplay"] : [];
		let levelSelect = this.context.navigation[this.scene.key].routes.select ? ["levelSelect"] : [];
		levelSelect = isAboveSelectScreen ? [] : levelSelect;
		const buttons = ["home", "audio", "settings", "pausePlay", "howToPlay"];

		this.setLayout([...buttons, ...achievements, ...levelSelect, ...pauseReplay]);
	}
}
