/**
 * Test screen for Gel Text
 *
 * @module components/home
 * @copyright BBC 2018
 * @author BBC Children's D+E
 * @license Apache-2.0
 */
import { buttonsChannel } from "../layout/gel-defaults.js";
import { Screen } from "../screen.js";
import { eventBus } from "../event-bus.js";

export class GelText extends Screen {
    create() {
        this.addBackgroundItems();
        this.setLayout(["exit", "play", "pause"]);

        const style = {
            "background-color": "white",
            font: "32px Arial",
            color: "red",
            "font-weight": "bold",
            padding: "5px 10px",
        };

        this.add.gelText("Multiline text\nCentered\nMultiline text", {
            style,
            position: { x: 0, y: -200 },
            align: "center",
        });
        this.add.gelText("Right\naligned\ntext", { style, position: { x: -200, y: 0 }, align: "right" });
        this.add.gelText("Left\naligned\ntext", { style, position: { x: 200, y: 0 }, align: "left" });

        eventBus.subscribe({
            channel: buttonsChannel(this),
            name: "play",
            callback: this.navigation.next,
        });
    }
}
