/**
 * @copyright BBC 2018
 * @author BBC Children's D+E
 * @license Apache-2.0
 */
import { Screen } from "../../../core/screen.js";
//import { accessibilify } from "../core/accessibility/accessibilify.js";

export class Launcher extends Screen {

    create() {
        this.add
            .text(0, 200, `TEST`, {
                font: "32px ReithSans",
                fill: "#f6931e",
                align: "center",
            })
            .setOrigin(0.5);

        this.setLayout(["home"])
    }
}
