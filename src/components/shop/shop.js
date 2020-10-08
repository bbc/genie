/**
 * Placeholder for shop screen.
 *
 * @module components/shop
 * @copyright BBC 2020
 * @author BBC Children's D+E
 * @license Apache-2.0
 */
import { Screen } from "../../core/screen.js";
import { scrollableList } from "../../core/layout/scrollable-list/scrollable-list.js";
import RexUIPlugin from "../../../lib/rexuiplugin.min.js";

export class Shop extends Screen {
    preload() {
        this.plugins.installScenePlugin("rexUI", RexUIPlugin, "rexUI", this);
    }

    create() {
        this.addBackgroundItems();
        const buttons = ["exit", "audio"];
        this.setLayout(buttons);
        this.panel = scrollableList(this);
        // this.input.on("pointerdown", () => console.log('BEEBUG: x, y', this.input.x, this.input.y), this);
        // this.cursors = this.input.keyboard.createCursorKeys();
        // this.inputReady = true;
    }

    // update() {
    //     if (this.cursors.space.isDown && this.inputReady) {
    //         this.inputReady = false;
    //         if (this.rect) {
    //             this.rect.destroy();
    //             this.rect = undefined;
    //         } else {
    //             const safeArea = this.layout.getSafeArea();
    //             this.rect = this.add.rectangle(0, 0, safeArea.width, safeArea.height, 0xff0000);
    //             this.rect.alpha = 0.5;
    //         }
    //     }

    //     if (this.cursors.space.isUp && !this.inputReady) {
    //         this.inputReady = true;
    //     }
    // }
}
