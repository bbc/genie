/**
 * Placeholder for shop screen.
 *
 * @module components/shop
 * @copyright BBC 2020
 * @author BBC Children's D+E
 * @license Apache-2.0
 */
import { Screen } from "../../core/screen.js";
import { scrollableList, resizePanel } from "../../core/layout/scrollable-list/scrollable-list.js";
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
        this.setupScrollableList();
    }

    setupScrollableList() {
        this.panel = scrollableList(this);

        const a11yGroup = this.add.container();
        a11yGroup.reset = () => resizePanel(this, this.panel);
        a11yGroup.add(this.panel);

        this.layout.addCustomGroup("shop", a11yGroup, 0);
        a11y.addGroupAt("shop", 0);
    }
}
