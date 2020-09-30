/**
 * Home is the main title screen for the game.
 *
 * @module components/shop
 * @copyright BBC 2020
 * @author BBC Children's D+E
 * @license Apache-2.0
 */
import { Screen } from "../../core/screen.js";

import { scrollableList } from "../../core/layout/scrollable-list/scrollable-list.js";

export class Shop extends Screen {
    create() {
        this.addBackgroundItems();
        const buttons = ["exit", "audio"];
        this.setLayout(buttons);

        this.panel = scrollableList(this);
    }
}
