/**
 * @copyright BBC 2018
 * @author BBC Children's D+E
 * @license Apache-2.0
 */
import { Screen } from "../../../core/screen.js";
import { eventBus } from "../../event-bus.js";
import { buttonsChannel } from "../../layout/gel-defaults.js";
//import { accessibilify } from "../core/accessibility/accessibilify.js";

const addButton = (scene, x, y, title, id, callback) => {
    const button = scene.add.gelButton(x, y, {
        scene: "gelDebug",
        key: "button",
        id,
        channel: buttonsChannel(scene),
        gameButton: true,
    });
    const text = scene.add.text(0, 0, title).setOrigin(0.5, 0.5);
    button.overlays.set("text", text);

    eventBus.subscribe({
        channel: buttonsChannel(scene),
        name: id,
        callback,
    });
};

export class Launcher extends Screen {
    create() {
        this.add.image(0, 0, "home.background");
        this.add
            .text(0, -250, "EXAMPLES", {
                font: "32px ReithSans",
                fill: "#f6931e",
                align: "center",
            })
            .setOrigin(0.5);

        this.setLayout(["home"]);

        addButton(this, -280, -180, "Select 1 item", "select-1", this.navigation.select1);
        addButton(this, -280, -100, "Select Grid", "select-grid", this.navigation.selectGrid);
    }
}
