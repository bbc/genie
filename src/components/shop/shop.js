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
import * as a11y from "../../core/accessibility/accessibility-layer.js";

export class Shop extends Screen {
    preload() {
        this.plugins.installScenePlugin("rexUI", RexUIPlugin, "rexUI", this);
    }

    create() {
        this.addBackgroundItems();
        const buttons = ["exit", "audio"];
        this.setLayout(buttons);
        a11y.addGroupAt("shop", 0);
        this.panel = scrollableList(this);
        this.panel.a11yWrapper = document.getElementById("accessible-group-shop");
        this.panel.updateA11y(); // prob want to hook this to resize
        
        // gelGroupElem.style.top = "-100px";
    }
}
