/**
 * Pause is an overlay screen created every time the pause button is pressed.
 *
 * @module components/overlays/pause
 * @copyright BBC 2019
 * @author BBC Children's D+E
 * @license Apache-2.0
 */
import { Screen } from "../../core/screen.js";

export class Pause extends Screen {
    preload() {
        this.sound.pauseAll();
        this.events.once("shutdown", this.sound.resumeAll.bind(this.sound));
    }

    create() {
        this.addBackgroundItems();
        const parentKey = this._data.addedBy.scene.key;
        const isAboveSelectScreen = parentKey.includes("select");
        const achievements = this.context.config.theme.game.achievements ? ["achievements"] : [];
        const pauseReplay = this.context.navigation[parentKey].routes.restart ? ["pauseReplay"] : [];
        let levelSelect = this.context.navigation["pause"].routes.select ? ["levelSelect"] : [];
        levelSelect = isAboveSelectScreen ? [] : levelSelect;
        const buttons = ["home", "audio", "settings", "pausePlay", "howToPlay"];

        this.setLayout([...buttons, ...achievements, ...levelSelect, ...pauseReplay]);
    }
}
